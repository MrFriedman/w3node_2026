---
tags:
  - build
  - architecture
status: active
date: 2026-11-13
---

# Architecture

Source of truth for the *v1 demo* is [[V1 Build Spec]]. HowlPay keeps the private claim pack off-chain and puts only its hash on a Sepolia escrow contract, `ClaimEscrow`, which records each step and holds then releases the USD₮ payout after a human approval. The diagram and sequences below describe the earlier checkpoint (shop top-up and reward payout). V1 reuses the same wallets, token, and five-step flow, but the preferred live payment is **escrow release to the shop**, with a 17:00 SAST direct treasury → shop fallback.

Source of truth for the older diagram: [docs/architecture.md](../../docs/architecture.md).

![HowlPay architecture](../../docs/architecture.png)

Shop phone (HowlPay plus Tether WDK) and a platform or insurer call Sepolia. The same transaction hash is re-checked after a dropped signal. Cash-out is a labelled simulation.

Live Sepolia addresses, balances, and confirmed transactions are in [[Testnet]]. Append the escrow address there after deploy. Product steps: [[User Flows]].

The phone UI is still a shell. Signing today is in scripts, using Tether WDK where possible. The next build step is the v1 walkthrough in [[V1 Build Spec]] and [[Tasks]].
