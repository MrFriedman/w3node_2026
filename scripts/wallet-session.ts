import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import WDK from '@tetherto/wdk'
import WalletManagerEvm from '@tetherto/wdk-wallet-evm'
import { DEFAULT_SEPOLIA_RPC, DEFAULT_SEPOLIA_USDT, SEPOLIA_CHAIN_ID, SEPOLIA_NAME, USDT_DECIMALS } from '../shared/network.ts'
import { assertSepolia, readToken, type TokenInfo } from './evm.ts'

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
  quiet: true,
})

export type Receipt = {
  hash: string
  finality: 'pending' | 'confirmed' | 'final' | 'dropped'
  success?: boolean
  block?: number
  fee?: bigint
}

export type WalletTransaction = { to?: string | null; data: string; value: bigint }

type Account = {
  quoteSendTransaction(tx: WalletTransaction): Promise<{ fee: bigint }>
  sendTransaction(tx: WalletTransaction): Promise<{ hash: string; fee: bigint }>
  getAddress(): Promise<string>
  getBalance(): Promise<bigint>
  getTokenBalance(tokenAddress: string): Promise<bigint>
  quoteTransfer(options: { token: string; recipient: string; amount: bigint }): Promise<{ fee: bigint }>
  transfer(options: { token: string; recipient: string; amount: bigint }): Promise<{ hash: string; fee: bigint }>
  getTransaction(hash: string): Promise<Receipt>
  waitForTransaction(hash: string, options?: { target?: 'confirmed' | 'final'; timeout?: number }): Promise<Receipt>
}

export type Session = {
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

export async function openSession(expectedToken?: string): Promise<Session> {
  const chainOverride = process.env.EVM_CHAIN_ID?.trim()
  if (chainOverride && chainOverride !== String(SEPOLIA_CHAIN_ID)) {
    throw new Error(`EVM_CHAIN_ID must be ${SEPOLIA_CHAIN_ID} (${SEPOLIA_NAME}).`)
  }
  const seed = readSeed()
  const rpcUrl = process.env.EVM_RPC_URL?.trim() || DEFAULT_SEPOLIA_RPC
  const tokenAddress = process.env.EVM_TOKEN_CONTRACT?.trim() || expectedToken || DEFAULT_SEPOLIA_USDT
  if (expectedToken && tokenAddress.toLowerCase() !== expectedToken.toLowerCase()) {
    throw new Error('Wallet token must match the configured escrow token.')
  }
  await assertSepolia(rpcUrl)
  const token = await readToken(rpcUrl, tokenAddress)
  if (token.decimals !== USDT_DECIMALS) {
    throw new Error(
      `Token ${token.address} reports ${token.decimals} decimals. This checkpoint expects 6-decimal testnet USDT.`,
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
