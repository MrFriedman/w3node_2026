import { USDT_DECIMALS } from './network.ts'

export type AlertBundle = {
  id: string
  zar: number
  tokens: number
}

/** Shop prices already used by Howl. USDT is derived from the checkpoint FX rate. */
export const ALERT_BUNDLES: readonly AlertBundle[] = [
  { id: 'r20', zar: 20, tokens: 10 },
  { id: 'r40', zar: 40, tokens: 20 },
  { id: 'r80', zar: 80, tokens: 50 },
  { id: 'r150', zar: 150, tokens: 100 },
  { id: 'r300', zar: 300, tokens: 220 },
]

export function bundleById(id: string): AlertBundle | undefined {
  const key = id.trim().toLowerCase()
  return ALERT_BUNDLES.find((bundle) => bundle.id === key)
}

/**
 * Parse a non-negative decimal into integer base units.
 * "1.5" at 6 decimals is 1500000n. Extra fractional digits are rejected.
 */
export function parseTokenAmount(human: string, decimals: number): bigint {
  const text = human.trim()
  const match = text.match(/^(\d+)(?:\.(\d+))?$/)
  if (!match) {
    throw new Error(`Amount "${human}" is not a positive decimal.`)
  }
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) {
    throw new Error('Token decimals must be an integer from 0 to 18.')
  }
  const fraction = match[2] ?? ''
  if (fraction.length > decimals) {
    throw new Error(`Amount supports at most ${decimals} decimal places.`)
  }
  const whole = BigInt(match[1])
  const padded = fraction.padEnd(decimals, '0')
  const base = padded.length === 0 ? 0n : BigInt(padded)
  const amount = whole * 10n ** BigInt(decimals) + base
  if (amount <= 0n) {
    throw new Error('Amount must be greater than zero.')
  }
  return amount
}

/**
 * Rands to USDT base units, rounded up so a bundle is never quoted short.
 * zarPerUsdt is a decimal string such as "16.5639".
 */
export function usdtBaseUnitsForZar(
  zar: number,
  zarPerUsdt: string,
  decimals: number = USDT_DECIMALS,
): bigint {
  if (!Number.isInteger(zar) || zar <= 0) {
    throw new Error('Bundle price must be a positive whole number of rands.')
  }
  const match = zarPerUsdt.trim().match(/^(\d+)(?:\.(\d+))?$/)
  if (!match) {
    throw new Error('ZAR per USDT must be a positive decimal number.')
  }
  const fraction = match[2] ?? ''
  if (fraction.length > 6) {
    throw new Error('ZAR per USDT supports at most 6 decimal places.')
  }
  const scale = Math.max(fraction.length, 1)
  const rate = parseTokenAmount(`${match[1]}${fraction ? `.${fraction}` : ''}`, scale)
  const numerator = BigInt(zar) * 10n ** BigInt(decimals) * 10n ** BigInt(scale)
  return (numerator + rate - 1n) / rate
}

export function formatUnits(amount: bigint, decimals: number): string {
  const negative = amount < 0n
  const value = negative ? -amount : amount
  const base = 10n ** BigInt(decimals)
  const whole = value / base
  const fraction = (value % base).toString().padStart(decimals, '0').replace(/0+$/, '')
  const text = fraction.length > 0 ? `${whole}.${fraction}` : whole.toString()
  return negative ? `-${text}` : text
}

export function isEvmAddress(value: string): boolean {
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) return false
  return !/^0x0{40}$/i.test(value)
}

export function isTxHash(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value)
}
