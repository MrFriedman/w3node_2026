import { formatUnits, usdtBaseUnitsForZar } from './money.ts'
import { CHECKPOINT_ZAR_PER_USDT } from './network.ts'

export const CLAIM_TOKEN = '0xd077A400968890Eacc75cdc901F0356c943e4fDb'
export const DEMO_ESCROW = '0x59F1586F0A624CC8b13B7128420B0842aA1AB56d'
export const DEMO_PAYEE = '0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab'
export const CLAIM_SOURCE = 'an existing verified incident-alert feed for Cape Town small shops (partner)'

export const DEMO_PACK = {
  id: 'recovery-demo-1',
  shopAddress: DEMO_PAYEE,
  sourceLabel: CLAIM_SOURCE,
  incident: { time: '14:05', distance: '300 m', summary: 'Verified alert near the shop' },
  photos: ['photo-01', 'photo-02', 'photo-03'],
  invoices: ['invoice-01', 'invoice-02'],
  amountZar: '200.00',
  amountUsdt: formatUnits(usdtBaseUnitsForZar(200, CHECKPOINT_ZAR_PER_USDT), 6),
}

export type ClaimPack = typeof DEMO_PACK & { packHash: string }

export type OnChainClaim = {
  claimId: string
  packHash: string
  payee: string
  amountUsdt: string
  amountZar: string
  state: 'opened' | 'paid' | 'rejected'
  openTxHash: string
  decisionTxHash?: string
}

// This synthetic fixture has a fixed schema and field order. Any field change changes the digest.
export const canonicalDemoPack = () => JSON.stringify(DEMO_PACK)

export const DEMO_PACK_HASH = '0xdc34375fe09d3d54af3c029fbc82c58129f7d06f7ba905577561c0a1ee26a78c'
export const ESCROW_DEPLOY_TX = '0x1b40b91c40242e25ccae73aab458a93b91a670043b36ed80c4dfe26a2c728646'

export type TransactionLookup = {
  hash?: string
  status: 'not-requested' | 'unknown' | 'unavailable' | 'unrelated' | 'pending' | 'reverted' | 'confirmed'
}
export type ReceiptSnapshot = {
  claim: OnChainClaim | null
  transaction: TransactionLookup
  checkedAt: string
  blockNumber: string
}
export type ReceiptViewState = {
  snapshot: ReceiptSnapshot | null
  refresh: 'idle' | 'loading' | 'error'
  error?: string
}
export function receiptAfterFailure(previous: ReceiptViewState, error: string): ReceiptViewState {
  return { snapshot: previous.snapshot, refresh: 'error', error }
}
