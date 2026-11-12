/**
 * On-device signing is intentionally not wired in this checkpoint.
 *
 * The Tether WDK React Native starter runs the wallet inside a BareKit
 * worklet (`@tetherto/wdk-react-native-core`). That starter also configures
 * mainnet Arbitrum and Polygon. This hackathon build stays on Sepolia and
 * signs in `scripts/wallet.ts`.
 *
 * TODO: Add the starter's worklet for Sepolia only, store the seed in the
 * device secure store, and replace this flag with the real wallet hooks.
 * Do not copy the starter's mainnet network entries into the demo.
 */
export const ON_DEVICE_SIGNING = false
