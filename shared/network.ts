/** Ethereum Sepolia. This checkpoint refuses every other chain id. */
export const SEPOLIA_CHAIN_ID = 11155111

export const SEPOLIA_NAME = 'Ethereum Sepolia'

/**
 * Public Sepolia endpoint used when EVM_RPC_URL is unset.
 * Tether's Node quickstart shows https://sepolia.drpc.org. That host returned
 * HTTP 403 from the checkpoint environment, so the default here is publicnode,
 * which is also the Sepolia URL in Tether's wdk-examples ERC-4337 section.
 */
export const DEFAULT_SEPOLIA_RPC = 'https://ethereum-sepolia-rpc.publicnode.com'

/**
 * Test Tether USD on Sepolia (symbol USDT, 6 decimals).
 * Source: https://github.com/tetherto/wdk-examples/blob/main/.env.example
 */
export const DEFAULT_SEPOLIA_USDT = '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'

export const USDT_DECIMALS = 6

/** Frankfurter rate for 11 Nov 2026. Not a live payment quote. */
export const CHECKPOINT_ZAR_PER_USDT = '16.5639'

export const CHECKPOINT_FX_NOTE =
  '1 USD = 16.5639 ZAR on 11 Nov 2026 (Frankfurter). This checkpoint treats 1 USDT as 1 USD. It is not a live quote at payment time.'
