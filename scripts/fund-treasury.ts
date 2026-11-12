/**
 * One-shot helper: fund the HowlPay treasury on Ethereum Sepolia from the shop wallet.
 * Sends 0.02 Sepolia ETH (gas) and 200 test USD₮.
 *
 * Usage (from scripts/):
 *   node ../path-or-local/fund-treasury.ts          # balances + fee quotes only
 *   node fund-treasury.ts --approve                 # quote, then sign and send
 *
 * Loads the shop seed from the repo-root .env inside this process only.
 * Never prints, logs, or echoes seeds or private keys.
 * Does not read .env.treasury. Does not modify .env.
 */
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import WDK from '@tetherto/wdk'
import WalletManagerEvm from '@tetherto/wdk-wallet-evm'
import { formatUnits, isEvmAddress, isTxHash } from '../shared/money.ts'
import {
  DEFAULT_SEPOLIA_RPC,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_NAME,
  USDT_DECIMALS,
} from '../shared/network.ts'
import { assertSepolia, readToken, rpc, type TokenInfo } from './evm.ts'

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
  quiet: true,
})

const EXPECTED_SHOP = '0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab'
const EXPECTED_TREASURY = '0xDB071a2410FCB0B4e0b498953139CF18E009388b'
const EXPECTED_TOKEN = '0xd077A400968890Eacc75cdc901F0356c943e4fDb'
const ETH_AMOUNT = 20_000_000_000_000_000n // 0.02 ETH
const USDT_AMOUNT = 200_000_000n // 200 USD₮, 6 decimals

type Receipt = {
  hash: string
  finality: 'pending' | 'confirmed' | 'final' | 'dropped'
  success?: boolean
  block?: number
  fee?: bigint
}

type Account = {
  getAddress(): Promise<string>
  getBalance(): Promise<bigint>
  getTokenBalance(tokenAddress: string): Promise<bigint>
  quoteTransfer(options: { token: string; recipient: string; amount: bigint }): Promise<{ fee: bigint }>
  transfer(options: { token: string; recipient: string; amount: bigint }): Promise<{ hash: string; fee: bigint }>
  quoteSendTransaction(options: { to: string; value: bigint }): Promise<{ fee: bigint }>
  sendTransaction(options: { to: string; value: bigint }): Promise<{ hash: string; fee: bigint }>
  getTransaction(hash: string): Promise<Receipt>
  waitForTransaction(hash: string, options?: { target?: 'confirmed' | 'final'; timeout?: number }): Promise<Receipt>
}

type Session = {
  wdk: { dispose(): void }
  account: Account
  rpcUrl: string
  token: TokenInfo
}

function readSeed(): string {
  const seed = process.env.WDK_SEED_PHRASE?.trim()
  if (!seed) {
    throw new Error('Set WDK_SEED_PHRASE in the repo-root .env. The script does not generate or print a seed.')
  }
  if (!WDK.isValidSeed(seed)) {
    throw new Error('WDK_SEED_PHRASE is not a valid BIP-39 seed. The value was not printed.')
  }
  return seed
}

function redact(error: unknown): string {
  const seed = process.env.WDK_SEED_PHRASE?.trim()
  let message = error instanceof Error ? error.message : 'Unknown error'
  if (seed && seed.length > 0) message = message.split(seed).join('[redacted]')
  return message
}

function sameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}

async function openSession(): Promise<Session> {
  const chainOverride = process.env.EVM_CHAIN_ID?.trim()
  if (chainOverride && chainOverride !== String(SEPOLIA_CHAIN_ID)) {
    throw new Error(`EVM_CHAIN_ID must be ${SEPOLIA_CHAIN_ID} (${SEPOLIA_NAME}).`)
  }
  const seed = readSeed()
  const rpcUrl = process.env.EVM_RPC_URL?.trim() || DEFAULT_SEPOLIA_RPC
  const tokenAddress = process.env.EVM_TOKEN_CONTRACT?.trim() || EXPECTED_TOKEN
  if (!sameAddress(tokenAddress, EXPECTED_TOKEN)) {
    throw new Error(
      `Refusing to run: token ${tokenAddress} is not the Pimlico Sepolia USD₮ used by this treasury (${EXPECTED_TOKEN}).`,
    )
  }
  await assertSepolia(rpcUrl)
  const token = await readToken(rpcUrl, tokenAddress)
  if (token.decimals !== USDT_DECIMALS) {
    throw new Error(
      `Token ${token.address} reports ${token.decimals} decimals. This helper expects 6-decimal testnet USDT.`,
    )
  }
  const wdk = new WDK(seed).registerWallet('ethereum', WalletManagerEvm, {
    provider: rpcUrl,
    chainId: SEPOLIA_CHAIN_ID,
  })
  try {
    const account = await wdk.getAccount('ethereum', 0)
    return { wdk, account: account as Account, rpcUrl, token }
  } catch (error) {
    wdk.dispose()
    throw error
  }
}

async function readNative(rpcUrl: string, address: string): Promise<bigint> {
  const result = await rpc(rpcUrl, 'eth_getBalance', [address, 'latest'])
  if (typeof result !== 'string') throw new Error('eth_getBalance did not return hex.')
  return BigInt(result)
}

async function readTokenBalance(rpcUrl: string, token: string, holder: string): Promise<bigint> {
  const data = `0x70a08231${holder.slice(2).toLowerCase().padStart(64, '0')}`
  const result = await rpc(rpcUrl, 'eth_call', [{ to: token, data }, 'latest'])
  if (typeof result !== 'string') throw new Error('balanceOf did not return hex.')
  return BigInt(result)
}

function printReceipt(label: string, receipt: Receipt): void {
  console.log(`${label} hash: ${receipt.hash}`)
  console.log(`${label} Etherscan: https://sepolia.etherscan.io/tx/${receipt.hash}`)
  console.log(`${label} finality: ${receipt.finality}`)
  console.log(`${label} success: ${receipt.success === undefined ? 'not settled yet' : String(receipt.success)}`)
  console.log(`${label} block: ${receipt.block === undefined ? 'none yet' : receipt.block}`)
  if (receipt.fee !== undefined) {
    console.log(`${label} fee paid: ${formatUnits(receipt.fee, 18)} ETH (${receipt.fee} wei)`)
  }
}

async function waitFor(session: Session, hash: string, label: string): Promise<Receipt> {
  if (!isTxHash(hash)) throw new Error(`${label}: submitted hash was not a 32-byte transaction hash.`)
  const receipt = await session.account.waitForTransaction(hash, {
    target: 'confirmed',
    timeout: 120_000,
  })
  printReceipt(label, receipt)
  if (receipt.success !== true) {
    throw new Error(`${label} did not succeed (finality=${receipt.finality}, success=${String(receipt.success)}).`)
  }
  return receipt
}

async function printBalances(session: Session, shop: string, headline: string): Promise<void> {
  const [shopEth, shopUsdt, treEth, treUsdt] = await Promise.all([
    session.account.getBalance(),
    session.account.getTokenBalance(session.token.address),
    readNative(session.rpcUrl, EXPECTED_TREASURY),
    readTokenBalance(session.rpcUrl, session.token.address, EXPECTED_TREASURY),
  ])
  console.log(headline)
  console.log(`Shop ${shop}`)
  console.log(`  ETH: ${formatUnits(shopEth, 18)} ETH`)
  console.log(`  USD₮: ${formatUnits(shopUsdt, session.token.decimals)} ${session.token.symbol}`)
  console.log(`Treasury ${EXPECTED_TREASURY}`)
  console.log(`  ETH: ${formatUnits(treEth, 18)} ETH`)
  console.log(`  USD₮: ${formatUnits(treUsdt, session.token.decimals)} ${session.token.symbol}`)
}

async function main(): Promise<number> {
  const approve = process.argv.includes('--approve')
  const session = await openSession()
  try {
    const from = await session.account.getAddress()
    if (!isEvmAddress(from) || !sameAddress(from, EXPECTED_SHOP)) {
      throw new Error(
        `Refusing to run: opened address ${from} is not the shop wallet ${EXPECTED_SHOP}. Nothing was signed.`,
      )
    }
    if (!sameAddress(session.token.address, EXPECTED_TOKEN)) {
      throw new Error(`Refusing to run: unexpected token ${session.token.address}.`)
    }

    console.log('HowlPay treasury fund — Ethereum Sepolia only')
    console.log(`Network: ${SEPOLIA_NAME} (chain id ${SEPOLIA_CHAIN_ID}), verified at the RPC`)
    console.log(`RPC: ${session.rpcUrl}`)
    console.log(`Token: ${session.token.name} (${session.token.symbol}), ${session.token.decimals} decimals`)
    console.log(`Token contract: ${session.token.address}`)
    console.log(`From (shop): ${from}`)
    console.log(`To (treasury): ${EXPECTED_TREASURY}`)
    console.log(`ETH amount: ${formatUnits(ETH_AMOUNT, 18)} ETH`)
    console.log(`USD₮ amount: ${formatUnits(USDT_AMOUNT, session.token.decimals)} ${session.token.symbol}`)
    console.log('')

    await printBalances(session, from, 'Step 1 — current balances')
    console.log('')

    const [native, tokenBalance] = await Promise.all([
      session.account.getBalance(),
      session.account.getTokenBalance(session.token.address),
    ])
    if (tokenBalance < USDT_AMOUNT) {
      console.log('Stopped: shop USD₮ balance is below 200. Nothing was signed.')
      return 1
    }

    console.log('Step 2 — fee quotes')
    const ethQuote = await session.account.quoteSendTransaction({
      to: EXPECTED_TREASURY,
      value: ETH_AMOUNT,
    })
    const usdtQuote = await session.account.quoteTransfer({
      token: session.token.address,
      recipient: EXPECTED_TREASURY,
      amount: USDT_AMOUNT,
    })
    const ethFee = ethQuote.fee
    const usdtFee = usdtQuote.fee
    const totalEthNeeded = ETH_AMOUNT + ethFee + usdtFee
    console.log(`ETH send fee quote: ${formatUnits(ethFee, 18)} ETH (${ethFee} wei)`)
    console.log(`USD₮ transfer fee quote: ${formatUnits(usdtFee, 18)} ETH (${usdtFee} wei)`)
    console.log(`Total ETH needed (0.02 + both fee quotes): ${formatUnits(totalEthNeeded, 18)} ETH`)

    if (native < totalEthNeeded) {
      console.log('Stopped: shop ETH is below 0.02 plus the quoted fees. Nothing was signed.')
      return 1
    }

    if (!approve) {
      console.log('')
      console.log('Quote only. Re-run with --approve to sign and send both transfers on Sepolia.')
      return 0
    }

    console.log('')
    console.log('Step 3 — send 0.02 ETH')
    const ethResult = await session.account.sendTransaction({
      to: EXPECTED_TREASURY,
      value: ETH_AMOUNT,
    })
    console.log(`ETH submitted: ${ethResult.hash}`)
    await waitFor(session, ethResult.hash, 'ETH')

    console.log('')
    console.log('Step 4 — send 200 USD₮')
    const usdtResult = await session.account.transfer({
      token: session.token.address,
      recipient: EXPECTED_TREASURY,
      amount: USDT_AMOUNT,
    })
    console.log(`USD₮ submitted: ${usdtResult.hash}`)
    await waitFor(session, usdtResult.hash, 'USD₮')

    console.log('')
    await printBalances(session, from, 'Step 5 — balances after both transfers')
    console.log('')
    console.log('Done. Both transfers confirmed on Sepolia.')
    console.log(`ETH hash: ${ethResult.hash}`)
    console.log(`USD₮ hash: ${usdtResult.hash}`)
    return 0
  } finally {
    session.wdk.dispose()
  }
}

main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((error: unknown) => {
    console.error(redact(error))
    process.exitCode = 1
  })
