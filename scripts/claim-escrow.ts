import { Contract, Interface, JsonRpcProvider, ZeroAddress } from 'ethers'
import { parseArgs } from 'node:util'
import { openSession, type WalletTransaction } from './wallet-session.ts'
import { assertSepolia } from './evm.ts'
import { formatUnits, isEvmAddress, isTxHash, parseTokenAmount } from '../shared/money.ts'
import { DEFAULT_SEPOLIA_RPC } from '../shared/network.ts'

import { createHash } from 'node:crypto'
import { CLAIM_TOKEN as token, DEMO_ESCROW as defaultEscrow, DEMO_PACK, DEMO_PACK_HASH, canonicalDemoPack } from '../shared/claims.ts'

const escrowInterface = new Interface([
  'function token() view returns (address)',
  'function insurer() view returns (address)',
  'function availableFloat() view returns (uint256)',
  'function claims(uint256) view returns (bytes32 packHash,address payee,uint256 amount,uint8 state)',
  'function setInsurer(address)',
  'function setPlatform(address)',
  'function deposit(uint256)',
  'function openClaim(bytes32,address,uint256)',
  'function approveAndRelease(uint256)',
  'function reject(uint256)',
  'event ClaimOpened(uint256 indexed claimId,bytes32 indexed packHash,address indexed payee,uint256 amount,address opener)',
  'event ClaimPaid(uint256 indexed claimId,address indexed payee,uint256 amount,address indexed insurer)',
  'event ClaimRejected(uint256 indexed claimId,uint256 amount,address indexed insurer)',
])
const tokenInterface = new Interface(['function approve(address,uint256) returns (bool)'])

async function main() {
  const { positionals: [command], values } = parseArgs({
    allowPositionals: true,
    options: {
      escrow: { type: 'string', default: defaultEscrow },
      address: { type: 'string' }, usdt: { type: 'string' }, pack: { type: 'string' },
      claim: { type: 'string' }, hash: { type: 'string' },
      approve: { type: 'boolean' }, cancel: { type: 'boolean' },
    },
  })
  if (command === 'pack') {
    const hash = '0x' + createHash('sha256').update(canonicalDemoPack(), 'utf8').digest('hex')
    if (hash !== DEMO_PACK_HASH) throw new Error('Sample pack digest differs from the shared fixture.')
    console.log({ hash, payee: DEMO_PACK.shopAddress, amountZar: DEMO_PACK.amountZar, amountUsdt: DEMO_PACK.amountUsdt })
    return
  }
  const escrowAddress = values.escrow
  if (!isEvmAddress(escrowAddress)) throw new Error('Invalid escrow address.')
  const url = process.env.EVM_RPC_URL?.trim() || DEFAULT_SEPOLIA_RPC
  const provider = new JsonRpcProvider(url)
  try {
    await assertSepolia(url)
    const escrow = new Contract(escrowAddress, escrowInterface, provider)
    if ((await escrow.token()).toLowerCase() !== token.toLowerCase()) throw new Error('Unexpected escrow token.')
    if (command === 'read') {
      if (!values.hash || !isTxHash(values.hash)) throw new Error('Supply a transaction hash.')
      const receipt = await provider.getTransactionReceipt(values.hash)
      if (!receipt) { console.log('Pending or not yet visible', values.hash); return }
      if (receipt.to?.toLowerCase() !== escrowAddress.toLowerCase()) throw new Error('Wrong escrow.')
      console.log('Sepolia', receipt.hash, 'block', receipt.blockNumber, receipt.status === 1 ? 'Confirmed' : 'Reverted')
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== escrowAddress.toLowerCase()) continue
        const event = escrowInterface.parseLog(log)
        if (event) console.log(event.name, ...event.args.map(String))
      }
      return
    }

    let tx: WalletTransaction
    let details: Record<string, string> = {}
    const escrowTx = (method: string, args: unknown[]): WalletTransaction => ({
      to: escrowAddress, data: escrowInterface.encodeFunctionData(method, args), value: 0n,
    })
    if (command === 'set-insurer' || command === 'set-platform') {
      if (!values.address || !isEvmAddress(values.address)) throw new Error('Supply a valid role address.')
      tx = escrowTx(command === 'set-insurer' ? 'setInsurer' : 'setPlatform', [values.address])
      details = { address: values.address }
    } else if (command === 'allow' || command === 'deposit' || command === 'open') {
      const amount = parseTokenAmount(values.usdt ?? '', 6)
      details = { usdt: formatUnits(amount, 6) }
      if (command === 'allow') {
        tx = { to: token, data: tokenInterface.encodeFunctionData('approve', [escrowAddress, amount]), value: 0n }
      } else if (command === 'deposit') {
        tx = escrowTx('deposit', [amount])
      } else {
        if (!values.address || !isEvmAddress(values.address) || !values.pack || !isTxHash(values.pack)) {
          throw new Error('Supply the payee and pack hash.')
        }
        tx = escrowTx('openClaim', [values.pack, values.address, amount])
        details = { ...details, payee: values.address, packHash: values.pack }
      }
    } else if (command === 'release' || command === 'reject') {
      if (!values.claim || !/^[1-9][0-9]*$/.test(values.claim)) throw new Error('Supply a positive claim ID.')
      const claim = await escrow.claims(values.claim)
      if (claim.state !== 1n || claim.payee === ZeroAddress) throw new Error('Claim is not open.')
      tx = escrowTx(command === 'release' ? 'approveAndRelease' : 'reject', [values.claim])
      details = { claim: values.claim, payee: claim.payee, usdt: formatUnits(claim.amount, 6) }
      if (claim.packHash === DEMO_PACK_HASH && details.usdt === DEMO_PACK.amountUsdt) {
        details.zar = DEMO_PACK.amountZar
      }
    } else {
      throw new Error('Use set-insurer, set-platform, allow, deposit, open, release, reject, or read.')
    }

    const session = await openSession(token)
    try {
      if (session.rpcUrl !== url) throw new Error('RPC configuration changed.')
      const { fee } = await session.account.quoteSendTransaction(tx)
      if (fee > await session.account.getBalance()) throw new Error('Insufficient Sepolia ETH.')
      console.log('Sepolia', command, { escrow: escrowAddress, token, ...details, maxFeeEth: formatUnits(fee, 18) })
      if (!values.approve || values.cancel) { console.log('Quote only.'); return }
      const { hash } = await session.account.sendTransaction(tx)
      console.log('Submitted', hash)
      const receipt = await provider.waitForTransaction(hash, 1, 90000)
      if (receipt?.status !== 1) throw new Error('Check the submitted hash before taking further action.')
      console.log('Confirmed', hash, 'block', receipt.blockNumber)
    } finally {
      session.wdk.dispose()
    }
  } finally {
    provider.destroy()
  }
}
main().catch((error: unknown) => {
  const seed = process.env.WDK_SEED_PHRASE?.trim()
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(seed ? message.split(seed).join('[redacted]') : message)
  process.exitCode = 1
})
