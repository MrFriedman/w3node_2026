---
tags:
  - product
  - decisions
status: active
date: 2026-11-13
---

# Decisions

## 2026-11-13

- **Pivot frozen for v1: verified claim pack plus tracked payout** for spaza micro-insurance. A human insurer (or embedded platform) approves a claim. HowlPay pays the approved amount from a pre-funded USDT treasury float on Sepolia. Both sides see the same receipt (tx hash, amount in rand, status). Rand cash-out stays a labelled simulation. Recovery-fund payouts are a second channel on the same rail, not in v1. Build source of truth: [[V1 Build Spec]]. Product research: [[Pivot Decision]]. Validation calls continue in parallel and may change Saturday pitch emphasis, not the v1 demo mid-build.
- **Public naming stays neutral.** Describe the incident source as "an existing verified incident-alert feed for Cape Town small shops (partner)". Do not name a specific partner product, website, bot handle, or township in code, docs, commits, the pitch, or the video. HowlPay is the public product name and may be used.

## 2026-11-12

- **Solo.** Dylan Friedman covers product, design, and the full stack. See [[Team Status]].
- **Tether track.** Mobile Money & Peer-to-Peer. The build follows WDK's validate, quote, approve, submit, and receipt flow. QVAC is not in this checkpoint.
- **Sepolia testnet.** Chain id `11155111` only. The script refuses anything else.
- **Token in the local `.env` is Pimlico USD₮** at `0xd077A400968890Eacc75cdc901F0356c943e4fDb` (6 decimals), because that is what the faucet issued. `.env.example` still defaults to Tether's wdk-examples Test Tether USD at `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`. The script reads name, symbol, and decimals on-chain and refuses a token that is not 6 decimals. See [[Testnet]].
- **Shop and treasury are separate testnet wallets.** The treasury address is `0xDB071a2410FCB0B4e0b498953139CF18E009388b`. Seeds stay in gitignored files and are never printed. Do not open `.env.treasury`.
- **A funded end-to-end R20 top-up has confirmed on Sepolia.** The script path is proven. Hashes are in [[Testnet]]. The treasury was later funded with 0.02 ETH and 200 USD₮ so it can pay a claim. That top-up is fallback evidence, not the v1 demo payment.
- **Signing stays in `scripts/wallet.ts` until on-device WDK.** The React Native starter is the reference and is not vendored, because it also configures mainnet networks. On-device signing is out of scope for v1. The Expo shell is the walkthrough UI.
- **Cash-out is simulated** and labelled. A live mobile-money or bank off-ramp is later work.
- **Working name HowlPay**, one constant in `shared/brand.ts`, so a rename is a string plus `app.json` and the docs.
- **Service credits, not a single platform's token.** Superseded as the *lead* v1 story (see 13 Nov). The earlier top-up and reward flows remain proven script work and may stay in the app.
- **FX is a snapshot**, 16.5639 ZAR per USD on 11 Nov 2026, not a live quote.
- **Public framing stays general.** Talk about platforms that serve informal traders and spaza shops. Do not name a specific partner product, website, bot handle, or township in code, docs, commits, the pitch, or the video. Tightened on 13 Nov to the frozen incident-source wording above.
- **Insurance claims payouts as a pitch pivot — under consideration, not decided.** Superseded 13 Nov: the pivot is now frozen. After a conversation with Alan (see [[2026-11-12 Alan - Insurance claims & payouts]]), claims payouts were considered alongside remittances, stokvel, spaza-wholesaler, and gig wages. Avalanche remains optional colour, not a required chain change.
