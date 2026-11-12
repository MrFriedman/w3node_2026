---
tags:
  - build
  - architecture
status: active
date: 2026-11-12
---

# Architecture

Source of truth: [docs/architecture.md](../../docs/architecture.md).

![HowlPay architecture](../../docs/architecture.png)

Shop phone (HowlPay plus Tether WDK) pays Sepolia USDT to a platform treasury for service credits. The partner verifies a data contribution and the treasury script pays the shop. The same transaction hash is re-checked after a dropped signal. Cash-out is a labelled simulation.

Sequences for top-up and reward, including approve/cancel and the re-check, are in the architecture doc. Product steps: [[User Flows]].
