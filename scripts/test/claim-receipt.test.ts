import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readDemoClaim, rpc, openedTopic, paidTopic, rejectedTopic, type Rpc } from '../../app/src/claim-receipt.ts'
import { CLAIM_TOKEN, DEMO_ESCROW, DEMO_PACK_HASH, DEMO_PAYEE, ESCROW_DEPLOY_TX, receiptAfterFailure } from '../../shared/claims.ts'
const hex = (n: bigint | number) => BigInt(n).toString(16).padStart(64, '0')
const addr = (a: string) => a.slice(2).padStart(64, '0')
const openHash = '0x' + '1'.repeat(64), paidHash = '0x' + '2'.repeat(64), inputHash = '0x' + '3'.repeat(64)
const amount = 12074452
function fixture(state: 'opened' | 'paid' | 'rejected' | 'none' = 'paid', lookup = 'unknown', mismatch = '') {
  const open = { topics: [openedTopic, '0x' + hex(1), DEMO_PACK_HASH, '0x' + addr(DEMO_PAYEE)], data: '0x' + hex(amount) + addr(DEMO_PAYEE), transactionHash: openHash, blockNumber: '0x20' }
  const decision = { topics: state === 'paid' ? [paidTopic, '0x' + hex(1), '0x' + addr(DEMO_PAYEE), '0x' + addr(DEMO_PAYEE)] : [rejectedTopic, '0x' + hex(1), '0x' + addr(DEMO_PAYEE)], data: '0x' + hex(mismatch === 'amount' ? amount + 1 : amount), transactionHash: paidHash, blockNumber: '0x21' }
  const methods: string[] = []
  const call: Rpc = async <T,>(method: string, params: unknown[]): Promise<T> => {
    methods.push(method)
    let result: unknown
    if (method === 'eth_chainId') result = mismatch === 'chain' ? '0x1' : '0xaa36a7'
    else if (method === 'eth_blockNumber') result = '0x22'
    else if (method === 'eth_getLogs') result = JSON.stringify(params).includes(openedTopic) ? state === 'none' ? [] : [open] : state === 'opened' || state === 'none' ? [] : [decision]
    else if (method === 'eth_call') result = (params[0] as { data: string }).data === '0xfc0c546a' ? '0x' + addr(CLAIM_TOKEN) : DEMO_PACK_HASH + addr(DEMO_PAYEE) + hex(amount) + hex(mismatch === 'state' ? 1 : ({ opened: 1, paid: 2, rejected: 3, none: 0 }[state]))
    else if (method === 'eth_getTransactionReceipt') {
      const hash = params[0]
      result = hash === ESCROW_DEPLOY_TX ? { status: '0x1', contractAddress: DEMO_ESCROW, blockNumber: '0x10' } :
        hash === openHash || hash === paidHash ? { status: '0x1', to: DEMO_ESCROW, blockNumber: hash === openHash ? '0x20' : '0x21' } :
          lookup === 'reverted' || lookup === 'unrelated' ? { status: lookup === 'reverted' ? '0x0' : '0x1', to: DEMO_ESCROW, blockNumber: '0x22' } : null
    } else if (method === 'eth_getTransactionByHash') result = lookup === 'unknown' ? null : { to: DEMO_ESCROW, input: '0x', blockNumber: lookup === 'pending' ? null : '0x22' }
    else throw new Error('Unexpected RPC ' + method)
    return result as T
  }
  return { call, methods }
}
for (const state of ['opened', 'paid', 'rejected', 'none'] as const) test(`reads ${state} from consistent events and state`, async () => {
  const { call, methods } = fixture(state)
  const result = await readDemoClaim('', call)
  assert.equal(result.claim?.state ?? 'none', state)
  assert.equal(result.blockNumber, '34')
  assert.ok(methods.every(m => !/send|sign/i.test(m)))
})
for (const status of ['unknown', 'pending', 'unavailable', 'reverted', 'unrelated']) test(`${status} lookup cannot change the verified sample`, async () => {
  const result = await readDemoClaim(inputHash, fixture('paid', status).call)
  assert.equal(result.transaction.status, status)
  assert.equal(result.claim?.state, 'paid')
})
test('matches an existing successful transaction to the claim', async () => {
  assert.equal((await readDemoClaim(paidHash, fixture().call)).transaction.status, 'confirmed')
})
test('rejects malformed hashes before network access', async () => {
  const { call, methods } = fixture()
  await assert.rejects(readDemoClaim('0x123', call))
  assert.equal(methods.length, 0)
})
for (const mismatch of ['state', 'amount', 'chain']) test(`rejects inconsistent ${mismatch}`, async () => {
  await assert.rejects(readDemoClaim('', fixture('paid', 'unknown', mismatch).call))
})
test('failed refresh keeps the timestamped verified snapshot and explicitly marks error', async () => {
  const snapshot = await readDemoClaim('', fixture().call)
  const next = receiptAfterFailure({ snapshot, refresh: 'loading' }, 'Offline')
  assert.equal(next.snapshot, snapshot)
  assert.equal(next.refresh, 'error')
  assert.equal(next.error, 'Offline')
})
test('RPC aborts a stalled request within its timeout', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  globalThis.fetch = ((_url: unknown, init: RequestInit) => new Promise((_resolve, reject) => {
    init.signal?.addEventListener('abort', () => reject(new Error('aborted')))
  })) as typeof fetch
  await assert.rejects(rpc('eth_chainId', []), /aborted/)
})
