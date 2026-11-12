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
- **Sepolia testnet.** Chain id `11155111` only. The script refuses anything else. Default token is Test Tether USD from Tether's wdk-examples.
- **Signing stays in `scripts/wallet.ts` until on-device WDK.** The React Native starter is the reference and is not vendored, because it also configures mainnet networks. The Expo Approve button stays disabled.
- **Cash-out is simulated** and labelled. A live mobile-money partner is later work.
- **Working name HowlPay**, one constant in `shared/brand.ts`, so a rename is a string plus `app.json` and the docs.
- **Service credits, not a single platform's token.** Verified data means contributions such as incident reports or prices. The partner backend is outside this repo.
- **FX is a snapshot**, 16.5639 ZAR per USD on 11 Nov 2026, not a live quote.
