---
tags:
  - product
status: superseded as the lead story
date: 2026-11-13
---

# Concept

> **Superseded as the lead story, 13 Nov 2026.** V1 is a verified claim pack plus a tracked HowlPay payout for spaza micro-insurance. See [[V1 Build Spec]] and [[Pivot Decision]]. The text below is the 12 Nov credit-and-reward framing and is kept for history.


## Problem

Millions of informal traders across Africa, like South Africa's spaza shops, are unbanked. Digital services built for them (safety alerts, stock ordering, business tools) can't easily get paid by people without cards or bank accounts, and those traders generate valuable local data (incident reports, prices, foot traffic) without being rewarded for it.

## Target users

Unbanked and underbanked spaza owners and small traders, and the platforms that serve them.

## Solution

A USDT wallet and payments layer built on Tether WDK so shops can pay for services and get paid for the data they contribute, straight from their phone.

## Features

1. A USDT wallet per shop that a platform can open for them. The recovery phrase stays private.
2. Pay-as-you-go top-ups showing rand and USDT, the fee, and the network. The shop approves. Credits land after confirmation.
3. Automatic USDT micro-rewards when a shop's data is verified.
4. Bad-signal-proof payments: pending until confirmed, and the same transaction is re-checked on reconnect so nobody pays twice.
5. Mobile-money cash-out, simulated in the demo.

## Track fit

Mobile-first, two-way stablecoin payments for people banks don't reach, following Tether's recommended payment flow.

## Roadmap

A community relief pool with automatic payouts on verified incidents.

Working name: HowlPay, in `shared/brand.ts`. Flows: [[User Flows]].
