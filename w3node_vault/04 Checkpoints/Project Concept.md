---
tags:
  - checkpoint
status: ready
date: 2026-11-12
---

# Project concept

Paste into BuilderBase.

Millions of informal traders across Africa, like South Africa's spaza shops, are unbanked. Digital services built for them (safety alerts, stock ordering, business tools) can't easily get paid by people without cards or bank accounts, and those traders generate valuable local data (incident reports, prices, foot traffic) without being rewarded for it.

HowlPay is a USDT wallet and payments layer on Tether's WDK. A platform opens a wallet per shop. The shop pays for service credits in USDT, with rand, fee, and network shown before they approve, and credits land only after the transaction confirms. When the platform verifies data the shop contributed, a treasury wallet sends a small USDT reward. Payments stay pending until confirmed, and a reconnect re-checks the same transaction so nobody pays twice. Cash-out to mobile money is simulated in the demo.

It is mobile-first, two-way stablecoin payments for people banks don't reach. Next is a community relief pool with automatic payouts on verified incidents.
