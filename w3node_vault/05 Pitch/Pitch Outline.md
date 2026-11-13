---
tags:
  - pitch
status: draft
date: 2026-11-13
---

# Pitch outline

5 minutes. 2–3 slides. Then 3 minutes of questions ([[Q&A Prep]]). Score against [[Judging Rubric]]. Product freeze: [[Pivot Decision]] · [[V1 Build Spec]].

## 0:00 — Problem (about 60s)

Claims on small shops are slow and messy: evidence is scattered, admin is heavy, and the shop cannot see where a payout is. 82% of small businesses in South Africa have no business insurance (FinScope 2024). Micro-insurers now sell riot cover to spazas, but riot claims are the slow ones. Uninsured traders were also shut out of 2021 relief by bank-account and ID rules.

## 1:00 — Product (about 45s)

HowlPay is the single source of truth for the claims process. A private incident record plus recovery pack stays off-chain. A contract records each step and holds then releases the USDT payout after a human approves. Both sides see the same receipt. The shop sees rand and does not have to hold USDT. The incident source is "an existing verified incident-alert feed for Cape Town small shops (partner)". This is payout automation, not parametric insurance.

## 1:45 — Show the payment (about 90s)

Walk the video: private pack → open claim (hash only on-chain) → human approve → escrow release → event-based receipt → re-check → simulated rand, labelled. Point at Sepolia evidence in [[Testnet]]. If the 17:00 fallback was used, say so. Do not pretend the phone signed if it did not.

## 3:15 — How it is built (about 60s)

Tether WDK. Sepolia. A small escrow contract plus five-step payments, then the same receipt on reconnect. Personal data stays off-chain; only the pack hash sits next to the payout. Testnet, not a local mock of a chain.

## 4:15 — Why it can be a business (about 45s)

First customer: embedded micro-insurance platforms and insurers selling to spazas and SMEs. Spazas are the beachhead; other businesses are the expansion story. The main selling point is less claims-handling overhead and admin, plus faster, complete claims — a **hypothesis we are validating on calls**, not a measured saving yet. Regulatory answer: licensed CASP, the trader sees rand. Stop at 5:00.

## Superseded: 12 Nov credit-and-reward outline

The earlier outline led with service credits and data-contribution rewards, and closed on a community relief pool. It is kept for history and is not the Saturday lead.
