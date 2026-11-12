# HowlPay

A USDT wallet and payments layer for platforms that serve informal traders. Shops pay for services and get paid for the data they contribute, from a phone, on Tether's Wallet Development Kit.

The working name is HowlPay. Change it in `shared/brand.ts`, then match `app/app.json` and these docs.

Built for the W3Node Node Engine hackathon in Cape Town (12–14 Nov 2026), Mobile Money and Peer-to-Peer track sponsored by Tether.

## Problem

Millions of informal traders across Africa, like South Africa's spaza shops, are unbanked. Digital services built for them (safety alerts, stock ordering, business tools) can't easily get paid by people without cards or bank accounts, and those traders generate valuable local data (incident reports, prices, foot traffic) without being rewarded for it.

## Target users

Unbanked and underbanked spaza owners and small traders, and the platforms that serve them.

## Solution

A USDT wallet and payments layer built on Tether WDK so shops can pay for services and get paid for the data they contribute, straight from their phone.

## Features

1. **A USDT wallet per shop.** A platform can open one for them. The address is shareable. The recovery phrase stays private and is never printed by the tools in this repo.
2. **Pay-as-you-go top-ups.** The shop sees the rand amount, the USDT amount, the fee, and the network, then approves or cancels. Service credits are recorded only after the transaction confirms. The demo catalog is R20 = 10, R40 = 20, R80 = 50, R150 = 100, and R300 = 220 credits. A partner can replace that catalog.
3. **Automatic USDT micro-rewards** when a shop's data is verified. Data can be an incident report, a price, or another contribution the partner checks.
4. **Bad-signal-proof payments.** A payment stays pending until it is confirmed. If the signal drops, the last-known status stays visible and the same transaction hash is checked again, so nobody pays twice.
5. **Mobile-money cash-out, simulated in this demo.** The cash-out screen is labelled as a simulation. It does not move USDT and it does not pay a mobile-money wallet.

## Why this is the Tether track

The track is mobile money and peer-to-peer payments. HowlPay is mobile-first: two-way stablecoin payments for people banks don't reach. It follows Tether's recommended payment flow. Testnet is enough for the checkpoint. Tether's workshop used Sepolia, and so does this repo.

1. Validate the address, the network, and the token.
2. Check the balance and quote the fee.
3. Show the recipient, the amount, the fee, and the network, then approve or cancel.
4. Sign and submit.
5. Check the receipt, and stay pending until it is confirmed.

Reconnect repeats step 5 on the same hash.

## Tech stack

- **Signing:** Node.js 22, `@tetherto/wdk`, `@tetherto/wdk-wallet-evm`, Ethereum Sepolia (chain id 11155111), testnet USDT with 6 decimals.
- **Shop UI:** Expo SDK 58 and React Native. On-device WDK signing is not connected yet.
- **Partner platform:** not in this repo. A safety-alert, stock-ordering, or business-tool service would keep its own backend and call this wallet for USDT.

The default Sepolia token is Test Tether USD at `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`, the contract in [Tether's WDK examples](https://github.com/tetherto/wdk-examples/blob/main/.env.example). The React Native starter documents a different Sepolia contract, `0xd077A400968890Eacc75cdc901F0356c943e4fDb`. Both are 6-decimal Sepolia tokens. The script reads the name, symbol, and decimals from the chain and refuses a token that is not 6 decimals.

USDT amounts for credit packs use a checkpoint FX snapshot, not a live quote: 1 USD = 16.5639 ZAR on 11 Nov 2026 (Frankfurter), with 1 USDT treated as 1 USD. Override it with `ZAR_PER_USDT`.

## Repo structure

```
app/                  Expo shop UI (typecheckable; signing is not wired)
docs/architecture.md  Architecture, top-up sequence, reward sequence
docs/architecture.png Diagram for the checkpoint
scripts/wallet.ts     Sepolia WDK wallet: address, balance, quote, send, status
shared/               Credit packs, USDT rounding, address checks, approve/cancel, product name
w3node_vault/         Obsidian working notes and build log
.env.example          Testnet env template. Real values stay in .env
```

## How to run

Node.js 22 or newer. From the repo root:

```bash
cd scripts
npm install
npm test
npm run typecheck
cp ../.env.example ../.env
# Put a Sepolia test seed in ../.env. Do not commit that file.
npm run wallet -- address
npm run wallet -- balance
npm run wallet -- quote --to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --usdt 1
npm run wallet -- status --hash 0x0000000000000000000000000000000000000000000000000000000000000001
```

`quote` and `send` stop before a signature when the wallet has no testnet USDT or no Sepolia ETH for gas. `send` still requires `--approve` (or the word `approve` typed in a terminal) after a successful quote. Leaving the choice blank cancels. `status` only reads a hash.

A credit-pack quote also needs the treasury address:

```bash
npm run wallet -- quote --bundle r20 --to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

The shop UI:

```bash
cd app
npm install
npm run typecheck
npx expo start
```

`npm run typecheck` is the check this checkpoint runs headless. `expo start` opens the shell in Expo Go. The top-up screen uses the same credit-pack maths as the script. Approve stays disabled there until the on-device WDK worklet exists. Use the script to sign.

Sepolia ETH and test USDT come from a faucet. Tether's docs point at the Pimlico and Candide faucets. An empty wallet is a normal result for a new address.

## Roadmap

Next is a community relief pool. Member shops would pool USDT and receive an automatic payout when a nearby incident is verified. The pool wallet would use the same five-step flow, and a reconnect would re-check the payout hash instead of paying it again.

Before that, the open work is:

- Wire `@tetherto/wdk-react-native-core` for Sepolia only, using the [React Native starter](https://github.com/tetherto/wdk-starter-react-native) as the reference, and keep the seed in the device secure store.
- Persist the last transaction hash on the device so a killed app can re-check it. The script already re-checks any hash you pass to `status`.
- Record service credits in the partner backend only after a confirmed receipt. This repo does not call that backend.
- Run the treasury script when the partner marks a data contribution verified.
- Replace the simulated cash-out with a real mobile-money partner, still behind an approve step.

## Disclosure

This repo was built during the hackathon from 3 Nov 2026.

Third-party code and references:

- [Tether WDK](https://docs.wdk.tether.io) packages `@tetherto/wdk` and `@tetherto/wdk-wallet-evm` (Apache-2.0). The wallet script follows the [Node.js and Bare quickstart](https://docs.wdk.tether.io/start-building/nodejs-bare-quickstart/) and the [ERC-20 transfer guide](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-evm/guides/transfer-tokens/). It is not a copy of that quickstart's multi-chain sample.
- [Tether WDK React Native starter](https://github.com/tetherto/wdk-starter-react-native) (Apache-2.0) and its [setup guide](https://docs.wdk.tether.io/examples-and-starters/react-native-starter/). That starter is not vendored. It configures mainnet Arbitrum and Polygon as well as Sepolia, and it needs a BareKit worklet this checkpoint does not run. The Expo app is an original shell. The starter is the intended base for on-device signing.
- [Tether wdk-examples `.env.example`](https://github.com/tetherto/wdk-examples/blob/main/.env.example) for the default Sepolia RPC pattern and the Test Tether USD contract.
- Expo `blank-typescript` template from `create-expo-app` (SDK 58), including the default icon assets. The Expo template is MIT, copyright 2015–present 650 Industries, Inc.
- The author’s existing design system supplied the visual tokens and mobile component specifications. Inter and Space Grotesk are distributed under the SIL Open Font License through Expo Google Fonts.
- Frankfurter (European Central Bank reference rates) for the 11 Nov 2026 USD/ZAR snapshot used as the demo FX rate.

Security: testnet only. The script refuses a chain id other than Sepolia 11155111. Never commit seeds, private keys, or a filled-in `.env`. `.env` is gitignored. The wallet script will not generate a phrase and will not print the one you set. Do not fund the public BIP-39 test mnemonic, and do not use any test phrase on mainnet.
