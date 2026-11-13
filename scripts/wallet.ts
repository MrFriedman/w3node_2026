import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { resolveApproval } from '../shared/approval.ts'
import { PRODUCT_NAME } from '../shared/brand.ts'
import {
  bundleById,
  formatUnits,
  isEvmAddress,
  isTxHash,
  parseTokenAmount,
  usdtBaseUnitsForZar,
  type CreditPack,
} from '../shared/money.ts'
import {
  CHECKPOINT_FX_NOTE,
  CHECKPOINT_ZAR_PER_USDT,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_NAME,
  USDT_DECIMALS,
} from '../shared/network.ts'
import { openSession, type Session, type Receipt } from './wallet-session.ts'

type Args = {
  command?: string
  to?: string
  usdt?: string
  bundle?: string
  hash?: string
  approve: boolean
  cancel: boolean
  wait: boolean
  help: boolean
}

const HELP = `${PRODUCT_NAME} — Sepolia testnet USDT

Uses @tetherto/wdk and @tetherto/wdk-wallet-evm.
The seed is read from WDK_SEED_PHRASE and is never printed.

  npm run wallet -- address
  npm run wallet -- balance
  npm run wallet -- quote --to 0x... --usdt 1
  npm run wallet -- quote --bundle r20
  npm run wallet -- send --to 0x... --usdt 1 --approve
  npm run wallet -- send --bundle r20 --cancel
  npm run wallet -- status --hash 0x...

Bundles: r20 (R20 / 10 credits), r40, r80, r150, r300.
--bundle pays PLATFORM_TREASURY_ADDRESS unless --to is set.
send signs only with --approve, or after you type "approve" at a terminal.
With no choice, send cancels. status re-checks one hash and does not send.

Service credits are not recorded here. The partner platform should credit a pack
only after status shows finality confirmed and success true.
`

function parseArgs(argv: string[]): Args {
  const args: Args = { approve: false, cancel: false, wait: false, help: false }
  const rest = argv.slice(2)
  if (rest[0] && !rest[0].startsWith('--')) args.command = rest[0]
  for (let index = args.command ? 1 : 0; index < rest.length; index += 1) {
    const token = rest[index]
    if (token === '--approve') args.approve = true
    else if (token === '--cancel') args.cancel = true
    else if (token === '--wait') args.wait = true
    else if (token === '--help' || token === '-h') args.help = true
    else if (token === '--to' || token === '--usdt' || token === '--bundle' || token === '--hash') {
      const value = rest[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`${token} needs a value`)
      index += 1
      if (token === '--to') args.to = value
      if (token === '--usdt') args.usdt = value
      if (token === '--bundle') args.bundle = value
      if (token === '--hash') args.hash = value
    } else {
      throw new Error(`Unknown argument ${token}`)
    }
  }
  return args
}

function fxRate(): { rate: string; note: string } {
  const fromEnv = process.env.ZAR_PER_USDT?.trim()
  if (fromEnv) {
    return {
      rate: fromEnv,
      note: fromEnv === CHECKPOINT_ZAR_PER_USDT
        ? CHECKPOINT_FX_NOTE
        : 'ZAR_PER_USDT is set in the environment. It is not a live quote.',
    }
  }
  return { rate: CHECKPOINT_ZAR_PER_USDT, note: CHECKPOINT_FX_NOTE }
}

function paymentFromArgs(args: Args): { bundle?: CreditPack; amount: bigint; recipient: string; rateNote: string } {
  if (args.bundle && args.usdt) throw new Error('Pass either --bundle or --usdt, not both.')
  const fx = fxRate()
  if (args.bundle) {
    const bundle = bundleById(args.bundle)
    if (!bundle) throw new Error(`Unknown bundle "${args.bundle}". Use r20, r40, r80, r150, or r300.`)
    const recipient = args.to ?? process.env.PLATFORM_TREASURY_ADDRESS?.trim()
    if (!recipient) throw new Error('Set PLATFORM_TREASURY_ADDRESS or pass --to for a credit-pack top-up.')
    return {
      bundle,
      amount: usdtBaseUnitsForZar(bundle.zar, fx.rate),
      recipient,
      rateNote: fx.note,
    }
  }
  if (!args.usdt) throw new Error('Pass --usdt or --bundle.')
  if (!args.to) throw new Error('Pass --to for a USDT amount.')
  return {
    amount: parseTokenAmount(args.usdt, USDT_DECIMALS),
    recipient: args.to,
    rateNote: fx.note,
  }
}

function printNetwork(session: Session, from: string): void {
  console.log(PRODUCT_NAME)
  console.log(`Network: ${SEPOLIA_NAME} (chain id ${SEPOLIA_CHAIN_ID}), verified at the RPC`)
  console.log(`RPC: ${session.rpcUrl}`)
  console.log(`Token: ${session.token.name} (${session.token.symbol}), ${session.token.decimals} decimals`)
  console.log(`Token contract: ${session.token.address}`)
  console.log(`From: ${from}`)
}

function printReceipt(receipt: Receipt): void {
  console.log(`Hash: ${receipt.hash}`)
  console.log(`Finality: ${receipt.finality}`)
  console.log(`Success: ${receipt.success === undefined ? 'not settled yet' : String(receipt.success)}`)
  console.log(`Block: ${receipt.block === undefined ? 'none yet' : receipt.block}`)
  if (receipt.fee !== undefined) {
    console.log(`Fee paid: ${formatUnits(receipt.fee, 18)} ETH (${receipt.fee} wei)`)
  }
  if (receipt.finality === 'pending') {
    console.log('Still pending. Credit nothing yet. Re-check this same hash. Do not send it again.')
  } else if (receipt.finality === 'dropped') {
    console.log('Dropped. This hash will not settle. A replacement would be a new hash, not a second copy of this one.')
  } else if (receipt.success === false) {
    console.log('The transfer reverted. Do not record service credits for this hash.')
  } else if (receipt.success === true) {
    console.log('Confirmed. The partner platform may record service credits for this hash. This script does not write to that backend.')
  }
}

async function askApproval(args: Args): Promise<'approve' | 'cancel'> {
  if (args.approve || args.cancel || !input.isTTY || !output.isTTY) {
    return resolveApproval({ approve: args.approve, cancel: args.cancel })
  }
  const rl = readline.createInterface({ input, output })
  try {
    const typed = await rl.question('Approve this USDT transfer? Type approve or cancel: ')
    return resolveApproval({ approve: false, cancel: false, typed })
  } finally {
    rl.close()
  }
}

async function showAddress(session: Session): Promise<void> {
  const from = await session.account.getAddress()
  printNetwork(session, from)
}

async function showBalance(session: Session): Promise<void> {
  const from = await session.account.getAddress()
  printNetwork(session, from)
  const [native, token] = await Promise.all([
    session.account.getBalance(),
    session.account.getTokenBalance(session.token.address),
  ])
  console.log(`ETH balance: ${formatUnits(native, 18)} ETH`)
  console.log(`USDT balance: ${formatUnits(token, session.token.decimals)} ${session.token.symbol}`)
}

async function quoteOrSend(session: Session, args: Args, send: boolean): Promise<number> {
  const payment = paymentFromArgs(args)
  if (!isEvmAddress(payment.recipient)) {
    throw new Error('Recipient is not a valid EVM address.')
  }
  if (payment.recipient.toLowerCase() === session.token.address.toLowerCase()) {
    throw new Error('Refusing to send USDT to the token contract.')
  }
  const from = await session.account.getAddress()
  printNetwork(session, from)
  console.log('')
  console.log('Step 1 — validate address, network, and token: ok')
  if (payment.bundle) {
    console.log(
      `Bundle: ${payment.bundle.id} — R${payment.bundle.zar} for ${payment.bundle.credits} service credits`,
    )
  }
  console.log(`To: ${payment.recipient}`)
  console.log(
    `Amount: ${formatUnits(payment.amount, session.token.decimals)} ${session.token.symbol} (${payment.amount} base units)`,
  )
  if (payment.bundle) console.log(`FX: ${payment.rateNote}`)
  if (payment.recipient.toLowerCase() === from.toLowerCase()) {
    console.log('Recipient is this same wallet.')
  }

  const [native, tokenBalance] = await Promise.all([
    session.account.getBalance(),
    session.account.getTokenBalance(session.token.address),
  ])
  console.log('')
  console.log('Step 2 — balance and fee quote')
  console.log(`ETH balance: ${formatUnits(native, 18)} ETH`)
  console.log(`USDT balance: ${formatUnits(tokenBalance, session.token.decimals)} ${session.token.symbol}`)
  if (tokenBalance < payment.amount) {
    console.log('Stopped: USDT balance is below the amount. No fee was quoted and nothing was signed.')
    return 1
  }
  if (native === 0n) {
    console.log('Stopped: this address has no Sepolia ETH for gas. No fee was quoted and nothing was signed.')
    return 1
  }

  const quote = await session.account.quoteTransfer({
    token: session.token.address,
    recipient: payment.recipient,
    amount: payment.amount,
  })
  console.log(`Fee quote: ${formatUnits(quote.fee, 18)} ETH (${quote.fee} wei)`)
  console.log('')
  console.log('Step 3 — review')
  console.log(`Recipient: ${payment.recipient}`)
  console.log(`Amount: ${formatUnits(payment.amount, session.token.decimals)} ${session.token.symbol}`)
  console.log(`Fee: ${formatUnits(quote.fee, 18)} ETH`)
  console.log(`Network: ${SEPOLIA_NAME}`)

  if (!send) {
    console.log('Quote only. Nothing was signed or submitted.')
    return 0
  }

  const decision = await askApproval(args)
  if (decision === 'cancel') {
    console.log('Cancelled. Nothing was signed or submitted.')
    return 0
  }

  console.log('')
  console.log('Step 4 — sign and submit')
  const result = await session.account.transfer({
    token: session.token.address,
    recipient: payment.recipient,
    amount: payment.amount,
  })
  console.log(`Submitted hash: ${result.hash}`)
  console.log(`Quoted fee returned with the submission: ${formatUnits(result.fee, 18)} ETH`)
  console.log('')
  console.log('Step 5 — receipt. Pending until confirmed.')
  console.log('Reconnect re-checks this same hash. It does not create another transfer.')
  if (args.wait) {
    const waited = await session.account.waitForTransaction(result.hash, {
      target: 'confirmed',
      timeout: 90_000,
    })
    printReceipt(waited)
  } else {
    try {
      printReceipt(await session.account.getTransaction(result.hash))
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchElementError') {
        console.log(`Hash: ${result.hash}`)
        console.log('Finality: not visible yet')
        console.log('Keep this hash and run status again. Do not send a second transfer for the same payment.')
      } else {
        throw error
      }
    }
  }
  console.log(`Re-check: npm run wallet -- status --hash ${result.hash}`)
  return 0
}

async function showStatus(session: Session, hash: string): Promise<number> {
  if (!isTxHash(hash)) throw new Error('Pass a 32-byte transaction hash: --hash 0x…')
  const from = await session.account.getAddress()
  printNetwork(session, from)
  console.log('')
  console.log('Reconnect check. This command only reads the hash. It does not sign or submit.')
  console.log(`Hash: ${hash}`)
  try {
    printReceipt(await session.account.getTransaction(hash))
    return 0
  } catch (error) {
    if (error instanceof Error && error.name === 'NoSuchElementError') {
      console.log('No transaction is visible for this hash yet.')
      console.log('Last-known status: not seen on Sepolia.')
      console.log('Run status again with the same hash after reconnect. Do not submit another transfer for the same payment.')
      return 2
    }
    throw error
  }
}

async function main(): Promise<number> {
  const args = parseArgs(process.argv)
  if (args.help || !args.command) {
    console.log(HELP)
    return args.help ? 0 : 1
  }
  const session = await openSession()
  try {
    switch (args.command) {
      case 'address':
        await showAddress(session)
        return 0
      case 'balance':
        await showBalance(session)
        return 0
      case 'quote':
        return await quoteOrSend(session, args, false)
      case 'send':
        return await quoteOrSend(session, args, true)
      case 'status':
        if (!args.hash) throw new Error('status needs --hash')
        return await showStatus(session, args.hash)
      default:
        throw new Error(`Unknown command "${args.command}". Run with --help.`)
    }
  } finally {
    session.wdk.dispose()
  }
}

main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((error: unknown) => {
    const seed = process.env.WDK_SEED_PHRASE?.trim()
    let message = error instanceof Error ? error.message : 'Unknown error'
    if (seed && seed.length > 0) message = message.split(seed).join('[redacted]')
    console.error(message)
    process.exitCode = 1
  })
