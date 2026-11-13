import { CLAIM_TOKEN, DEMO_ESCROW, DEMO_PACK, DEMO_PACK_HASH, ESCROW_DEPLOY_TX, type ReceiptSnapshot, type TransactionLookup } from '../../shared/claims.ts'
import { formatUnits, isTxHash } from '../../shared/money.ts'
import { DEFAULT_SEPOLIA_RPC, SEPOLIA_CHAIN_ID } from '../../shared/network.ts'

export const openedTopic = '0x0a6c8e9de39c64de5e65faac4551a66856ab43754096999a4d2057adc7f68fe2'
export const paidTopic = '0x5337c6b747ece9ef8717d675d4f68488e54e6934c0333808e39e7a22fb871436'
export const rejectedTopic = '0x7308fcd6e90df54955b7689f3635b065f0c61a25f6e97d16fb3c4d6098dec9e4'
type Log = { topics: string[]; data: string; transactionHash: string; blockNumber: string; removed?: boolean }
type Receipt = { status: string; to: string | null; contractAddress: string | null; blockNumber: string }
type Transaction = { to: string | null; input: string; blockNumber: string | null }
export type Rpc = <T>(method: string, params: unknown[]) => Promise<T>

export const rpc: Rpc = async <T,>(method: string, params: unknown[]): Promise<T> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(DEFAULT_SEPOLIA_RPC, {
      method: 'POST', signal: controller.signal, headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
    const data = await response.json() as { result?: T; error?: unknown }
    if (!response.ok || data.error || data.result === undefined) throw new Error('Sepolia lookup failed.')
    return data.result
  } finally { clearTimeout(timeout) }
}
const same = (a: string | null | undefined, b: string) => a?.toLowerCase() === b.toLowerCase()
const word = (data: string, index: number) => {
  const value = data.slice(2 + index * 64, 66 + index * 64)
  if (!/^[a-fA-F0-9]{64}$/.test(value)) throw new Error('Invalid contract response.')
  return '0x' + value
}
const address = (value: string) => '0x' + value.slice(-40)

/** All evidence and contract state are read at one block. This is mined evidence, not a finality assertion. */
export async function readDemoClaim(hash = '', call: Rpc = rpc): Promise<ReceiptSnapshot> {
  if (hash && !isTxHash(hash)) throw new Error('Enter a complete 32-byte transaction hash.')
  if (BigInt(await call<string>('eth_chainId', [])) !== BigInt(SEPOLIA_CHAIN_ID)) throw new Error('Unexpected chain.')
  const block = await call<string>('eth_blockNumber', [])
  const deployment = await call<Receipt | null>('eth_getTransactionReceipt', [ESCROW_DEPLOY_TX])
  if (deployment?.status !== '0x1' || !same(deployment.contractAddress, DEMO_ESCROW)) throw new Error('Escrow deployment unavailable.')
  const token = await call<string>('eth_call', [{ to: DEMO_ESCROW, data: '0xfc0c546a' }, block])
  if (!same(address(word(token, 0)), CLAIM_TOKEN)) throw new Error('Unexpected escrow token.')
  const logs = (topics: (string | string[] | null)[], fromBlock: string) =>
    call<Log[]>('eth_getLogs', [{ address: DEMO_ESCROW, topics, fromBlock, toBlock: block }])
  const opens = await logs([openedTopic, null, DEMO_PACK_HASH], deployment.blockNumber)
  if (opens.length > 1) throw new Error('Ambiguous sample claim.')
  const open = opens[0]
  let claim: ReceiptSnapshot['claim'] = null
  if (open) {
    if (open.removed || !same(open.topics[2], DEMO_PACK_HASH)) throw new Error('Invalid opening event.')
    const id = BigInt(open.topics[1])
    const payee = address(open.topics[3])
    const amount = word(open.data, 0)
    const amountUsdt = formatUnits(BigInt(amount), 6)
    if (!same(payee, DEMO_PACK.shopAddress) || amountUsdt !== DEMO_PACK.amountUsdt) throw new Error('Claim does not match sample pack.')
    const decisions = await logs([[paidTopic, rejectedTopic], open.topics[1]], open.blockNumber)
    if (decisions.length > 1) throw new Error('Ambiguous claim decision.')
    const decision = decisions[0]
    const state = !decision ? 'opened' : same(decision.topics[0], paidTopic) ? 'paid' : 'rejected'
    if (decision && (decision.removed || !same(decision.topics[1], open.topics[1]) || BigInt(word(decision.data, 0)) !== BigInt(amount) ||
      (state === 'paid' && !same(address(decision.topics[2]), payee)))) throw new Error('Decision does not match claim.')
    const stored = await call<string>('eth_call', [{ to: DEMO_ESCROW, data: '0xa888c2cd' + id.toString(16).padStart(64, '0') }, block])
    if (!same(word(stored, 0), DEMO_PACK_HASH) || !same(address(word(stored, 1)), payee) || BigInt(word(stored, 2)) !== BigInt(amount) ||
      Number(BigInt(word(stored, 3))) !== ({ opened: 1, paid: 2, rejected: 3 }[state])) throw new Error('Events and contract state disagree.')
    // Validate that both event transactions were successfully mined at their recorded blocks.
    for (const event of [open, ...(decision ? [decision] : [])]) {
      const receipt = await call<Receipt | null>('eth_getTransactionReceipt', [event.transactionHash])
      if (!receipt || receipt.status !== '0x1' || !same(receipt.to, DEMO_ESCROW) || receipt.blockNumber !== event.blockNumber) throw new Error('Event receipt unavailable.')
    }
    claim = { claimId: id.toString(), packHash: DEMO_PACK_HASH, payee, amountUsdt, amountZar: DEMO_PACK.amountZar,
      state, openTxHash: open.transactionHash, decisionTxHash: decision?.transactionHash }
  }
  let transaction: TransactionLookup = { status: 'not-requested' }
  if (hash) {
    const [receipt, tx] = await Promise.all([
      call<Receipt | null>('eth_getTransactionReceipt', [hash]), call<Transaction | null>('eth_getTransactionByHash', [hash]),
    ])
    const matches = Boolean(claim && (same(hash, claim.openTxHash) || same(hash, claim.decisionTxHash ?? '')))
    // Pending/reverted operations are only contract-related. They are never evidence for the sample's state.
    transaction = { hash, status: !receipt && !tx ? 'unknown' : !same(receipt?.to ?? tx?.to, DEMO_ESCROW) ? 'unrelated' :
      !receipt ? tx?.blockNumber === null ? 'pending' : 'unavailable' : receipt.status === '0x0' ? 'reverted' : matches ? 'confirmed' : 'unrelated' }
  }
  return { claim, transaction, checkedAt: new Date().toISOString(), blockNumber: BigInt(block).toString() }
}
