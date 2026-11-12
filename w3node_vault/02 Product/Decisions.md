---
tags:
  - product
  - decisions
status: active
date: 2026-11-12
---

# Decisions

## 2026-11-12

- **Solo.** Dylan Friedman covers product, design, and the full stack. See [[Team Status]].
- **Tether track.** Mobile Money & Peer-to-Peer. The build follows WDK's validate, quote, approve, submit, and receipt flow. QVAC is not in this checkpoint.
- **Sepolia testnet.** Chain id `11155111` only. The script refuses anything else.
- **Token in the local `.env` is Pimlico USD₮** at `0xd077A400968890Eacc75cdc901F0356c943e4fDb` (6 decimals), because that is what the faucet issued. `.env.example` still defaults to Tether's wdk-examples Test Tether USD at `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`. The script reads name, symbol, and decimals on-chain and refuses a token that is not 6 decimals. See [[Testnet]].
- **Shop and treasury are separate testnet wallets.** The treasury address is `0xDB071a2410FCB0B4e0b498953139CF18E009388b`. Seeds stay in gitignored files and are never printed. Do not open `.env.treasury`.
- **A funded end-to-end R20 top-up has confirmed on Sepolia.** The script path is proven. Hashes are in [[Testnet]].
- **Signing stays in `scripts/wallet.ts` until on-device WDK.** The React Native starter is the reference and is not vendored, because it also configures mainnet networks. The Expo Approve button is still disabled. Wiring the phone UI (live balance, real approve, pending and confirmed states, re-check on reconnect) is the next build priority. See [[Tasks]].
- **Cash-out is simulated** and labelled. A live mobile-money partner is later work.
- **Working name HowlPay**, one constant in `shared/brand.ts`, so a rename is a string plus `app.json` and the docs.
- **Service credits, not a single platform's token.** Verified data means contributions such as incident reports or prices. The partner backend is outside this repo.
- **FX is a snapshot**, 16.5639 ZAR per USD on 11 Nov 2026, not a live quote.
- **Public framing stays general.** Talk about platforms that serve informal traders and spaza shops. Do not name a specific partner product, website, bot handle, or township in code, docs, commits, the pitch, or the video.
- **Insurance claims payouts as a pitch pivot — under consideration, not decided.** After a conversation with Alan (see [[2026-11-12 Alan - Insurance claims & payouts]]), a fifth use-case option is insurance claims payouts on the existing USDT rail, alongside remittances, stokvel, spaza-wholesaler, and gig wages. Avalanche is optional for a demo, not a required chain change. No product decision yet.
