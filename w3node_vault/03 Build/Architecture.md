---
tags:
  - build
  - architecture
status: active
date: 2026-11-13
---

# Architecture

Source of truth for the *v1 demo* is [[V1 Build Spec]]. The diagram and sequences below describe the earlier checkpoint (shop top-up and reward payout). V1 reuses the same wallets and five-step flow, but the live payment is **treasury → shop** after a human claim approval, not a service-credit top-up.


Source of truth: [docs/architecture.md](../../docs/architecture.md).

![HowlPay architecture](../../docs/architecture.png)

Shop phone (HowlPay plus Tether WDK) pays Sepolia USDT to a platform treasury for service credits. The partner verifies a data contribution and the treasury script pays the shop. The same transaction hash is re-checked after a dropped signal. Cash-out is a labelled simulation.

Live Sepolia addresses, balances, and the confirmed R20 top-up are in [[Testnet]]. Sequences for top-up and reward, including approve/cancel and the re-check, are in the architecture doc. Product steps: [[User Flows]].

The phone UI is still a shell. Signing today is `scripts/wallet.ts`. The next build step is the v1 claims walkthrough in [[V1 Build Spec]] and [[Tasks]], not a live shop top-up on the phone.
