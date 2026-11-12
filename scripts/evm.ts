import { isEvmAddress } from '../shared/money.ts'
import { SEPOLIA_CHAIN_ID, SEPOLIA_NAME } from '../shared/network.ts'

type RpcResponse = {
  result?: unknown
  error?: { message?: string }
}

export async function rpc(url: string, method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'howlpay-checkpoint/0.1',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  if (!response.ok) {
    throw new Error(`RPC ${method} failed with HTTP ${response.status} from ${url}`)
  }
  const body = (await response.json()) as RpcResponse
  if (body.error) {
    throw new Error(body.error.message ?? `RPC ${method} returned an error`)
  }
  return body.result
}

export async function assertSepolia(url: string): Promise<void> {
  const result = await rpc(url, 'eth_chainId', [])
  if (typeof result !== 'string') {
    throw new Error('RPC eth_chainId did not return a chain id.')
  }
  const chainId = Number(BigInt(result))
  if (chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error(
      `RPC is chain id ${chainId}, not ${SEPOLIA_NAME} (${SEPOLIA_CHAIN_ID}). This checkpoint will not sign on another network.`,
    )
  }
}

export type TokenInfo = {
  address: string
  name: string
  symbol: string
  decimals: number
}

export async function readToken(url: string, address: string): Promise<TokenInfo> {
  if (!isEvmAddress(address)) {
    throw new Error('Token contract is not a valid EVM address.')
  }
  const code = await rpc(url, 'eth_getCode', [address, 'latest'])
  if (typeof code !== 'string' || code === '0x' || code === '0x0') {
    throw new Error(`No contract code at token address ${address} on ${SEPOLIA_NAME}.`)
  }
  const [name, symbol, decimalsHex] = await Promise.all([
    call(url, address, '0x06fdde03'),
    call(url, address, '0x95d89b41'),
    call(url, address, '0x313ce567'),
  ])
  return {
    address,
    name: decodeAbiString(name),
    symbol: decodeAbiString(symbol),
    decimals: Number(BigInt(decimalsHex)),
  }
}

async function call(url: string, to: string, data: string): Promise<string> {
  const result = await rpc(url, 'eth_call', [{ to, data }, 'latest'])
  if (typeof result !== 'string') {
    throw new Error(`Token call ${data} did not return hex.`)
  }
  return result
}

export function decodeAbiString(hex: string): string {
  if (!hex || hex === '0x') return ''
  const raw = Buffer.from(hex.slice(2), 'hex')
  if (raw.length === 32) {
    return raw.toString('utf8').replace(/\0+$/g, '').trim()
  }
  if (raw.length >= 64) {
    const length = Number(BigInt(`0x${raw.subarray(32, 64).toString('hex')}`))
    if (!Number.isFinite(length) || length < 0 || 64 + length > raw.length) {
      return raw.toString('utf8').replace(/\0/g, '').trim()
    }
    return raw.subarray(64, 64 + length).toString('utf8').trim()
  }
  return raw.toString('utf8').replace(/\0/g, '').trim()
}
