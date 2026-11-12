# Howl Wallet

A self-custodial USDT wallet for Howl shops, so a spaza can buy alert tokens and receive a small reward when a report is verified.

Howl ([howlza.co.za](https://howlza.co.za)) already warns Cape Town small shops and township spaza shops about riots and unrest. Shops buy alert-token bundles and spend one token per alert. People report incidents within 100 metres. Howl Wallet is the payments add-on for that product, built for the W3Node Node Engine hackathon in Cape Town (12–14 Nov 2026), Mobile Money and Peer-to-Peer track sponsored by Tether.

## Problem

Shops already pay for alerts in rand. During unrest, cash and card checkout are a poor fit for a small cross-border-capable balance the shop actually holds. A shop needs a wallet it controls, a clear USDT price for the bundles it already understands, a reward when its report checks out, and a screen that does not ask it to pay twice after the signal drops.

## Who it is for

Owners and staff of Cape Town small shops and township spaza shops who already use Howl. The shop account in Howl is the account this wallet is linked to. The recovery phrase stays with the shop. The address can be shared.

## Features

1. **Shop wallet.** Each shop gets a self-custodial USDT wallet built with Tether's Wallet Development Kit, linked to its Howl account. The address is shareable. The recovery phrase is private and is never printed by the tools in this repo.
2. **Top up alert tokens in USDT.** The shop sees the bundle, the rand price, the USDT amount, the fee, and the network, then approves or cancels. Tokens are credited only after the transaction confirms. Bundles match Howl: R20 = 10, R40 = 20, R80 = 50, R150 = 100, R300 = 220 tokens.
3. **Verified-report rewards.** A Howl treasury wallet sends a USDT micro-reward to a shop whose incident report is verified.
4. **Pending until confirmed, including reconnect.** The payment stays pending until the receipt is confirmed. If the signal drops, the last-known status stays on screen and the same transaction hash is checked again. The same payment is not submitted twice.
5. **Cash-out to mobile money, simulated.** The demo cash-out is labelled as a simulation. It does not move USDT and it does not pay a mobile-money wallet.

## Why this is the Tether track

The track is mobile money and peer-to-peer payments, sponsored by Tether. Howl Wallet uses Tether's WDK for a self-custodial USDT wallet, follows Tether's payment flow, and treats mobile-money cash-out as the off-ramp (simulated in this demo). Rewards are peer payments from a Howl treasury wallet to a shop wallet. Testnet is enough for the checkpoint. Tether's workshop used Sepolia, and so does this repo.

Tether's flow, used for both top-up and rewards:

1. Validate the address, the network, and the token.
2. Check the balance and quote the fee.
3. Show the recipient, the amount, the fee, and the network, then approve or cancel.
4. Sign and submit.
5. Check the receipt, and stay pending until it is confirmed.

Reconnect repeats step 5 on the same hash.

## Tech stack

- **This repo, signing:** Node.js 22, `@tetherto/wdk`, `@tetherto/wdk-wallet-evm`, Ethereum Sepolia (chain id 11155111), testnet USDT with 6 decimals.
- **This repo, shop UI:** Expo SDK 58 and React Native. The screen flow is the Howl Wallet shell. On-device WDK signing is not connected yet.
- **Howl, already in production, not in this repo:** Supabase (Postgres, auth, backend), a web app on Vercel, Telegram bot `@HowlZaBot`, Resend for email, PostHog analytics, SnapScan for rand checkout.

The default Sepolia token is Test Tether USD at `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`, the contract in [Tether's WDK examples](https://github.com/tetherto/wdk-examples/blob/main/.env.example). The React Native starter documents a different Sepolia contract, `0xd077A400968890Eacc75cdc901F0356c943e4fDb`. Both are 6-decimal Sepolia tokens. The script reads the name, symbol, and decimals from the chain and refuses a token that is not 6 decimals.

USDT amounts for bundles use a checkpoint FX snapshot, not a live quote: 1 USD = 16.5639 ZAR on 11 Nov 2026 (Frankfurter), with 1 USDT treated as 1 USD. Override it with `ZAR_PER_USDT` if you want a different demo rate.

## Repo structure

```
app/                  Expo shop UI (typecheckable; signing is not wired)
docs/architecture.md  Architecture, top-up sequence, reward sequence
docs/architecture.png Diagram for the checkpoint
scripts/wallet.ts     Sepolia WDK wallet: address, balance, quote, send, status
shared/               Bundle prices, USDT rounding, address checks, approve/cancel
.env.example          Testnet env template. Real values stay in .env
```

Howl's private app is not a folder in this repository.

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

A bundle quote also needs the treasury address:

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

`npm run typecheck` is the check this checkpoint runs headless. `expo start` opens the shell in Expo Go. The Top up screen uses the same bundle maths as the script. Approve stays disabled there until the on-device WDK worklet exists. Use the script to sign.

Sepolia ETH and test USDT come from a faucet. Tether's docs point at the Pimlico and Candide faucets. An empty wallet is a normal result for a new address.

## Roadmap

Next is an unrest relief pool. Member shops would pool USDT and receive an automatic payout when Howl verifies an incident near them. The pool wallet would use the same five-step flow, and a reconnect would re-check the payout hash instead of paying it again.

Before that, the open work is:

- Wire `@tetherto/wdk-react-native-core` for Sepolia only, using the [React Native starter](https://github.com/tetherto/wdk-starter-react-native) as the reference, and keep the seed in the device secure store.
- Persist the last transaction hash on the device so a killed app can re-check it. The script already re-checks any hash you pass to `status`.
- Credit Howl alert tokens from Supabase only after a confirmed receipt. This repo does not call Supabase.
- Run the treasury script when Howl marks a report verified.
- Replace the simulated cash-out with a real mobile-money partner, still behind an approve step.

## Disclosure

This repo was built during the hackathon from 3 Nov 2026. Howl is a pre-existing project by Dylan's team. This repository is a new integration. It does not contain Howl's app, database, or bot.

Third-party code and references:

- [Tether WDK](https://docs.wdk.tether.io) packages `@tetherto/wdk` and `@tetherto/wdk-wallet-evm` (Apache-2.0). The wallet script follows the [Node.js and Bare quickstart](https://docs.wdk.tether.io/start-building/nodejs-bare-quickstart/) and the [ERC-20 transfer guide](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-evm/guides/transfer-tokens/). It is not a copy of that quickstart's multi-chain sample.
- [Tether WDK React Native starter](https://github.com/tetherto/wdk-starter-react-native) (Apache-2.0) and its [setup guide](https://docs.wdk.tether.io/examples-and-starters/react-native-starter/). That starter is not vendored. It configures mainnet Arbitrum and Polygon as well as Sepolia, and it needs a BareKit worklet this checkpoint does not run. The Expo app is an original Howl shell. The starter is the intended base for on-device signing.
- [Tether wdk-examples `.env.example`](https://github.com/tetherto/wdk-examples/blob/main/.env.example) for the default Sepolia RPC pattern and the Test Tether USD contract.
- Expo `blank-typescript` template from `create-expo-app` (SDK 58), including the default icon assets. The Expo template is MIT, copyright 2015–present 650 Industries, Inc.
- Frankfurter (European Central Bank reference rates) for the 11 Nov 2026 USD/ZAR snapshot used as the demo FX rate.

Security: testnet only. The script refuses a chain id other than Sepolia 11155111. Never commit seeds, private keys, or a filled-in `.env`. `.env` is gitignored. The wallet script will not generate a phrase and will not print the one you set. Do not fund the public BIP-39 test mnemonic, and do not use any test phrase on mainnet.
