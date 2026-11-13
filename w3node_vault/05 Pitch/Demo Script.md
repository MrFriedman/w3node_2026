---
tags:
  - pitch
  - demo
status: draft
date: 2026-11-13
---

# Demo script

Three minutes, preferably 1–2. One shop, one private claim pack, one escrowed payout from human approval to a shared receipt, one re-check. Label every simulated part.

Build against [[V1 Build Spec]]. Wallets and hashes: [[Testnet]]. Do not show a seed, a `.env` file, or a mainnet network. Do not name a specific partner product; say "an existing verified incident-alert feed for Cape Town small shops (partner)".

Suggested recording (Cmd+Shift+5): the private pack and pack hash in Expo, `openClaim`, insurer approve, `approveAndRelease`, the receipt read from contract events plus Etherscan, the labelled simulated rand payout. If the 17:00 fallback is in force, show the tested contract first, then a direct treasury → shop send, and say so.

## 0:00 — Who

"This is a spaza owner, and behind them an insurer that sells cover to small shops. After a riot, theft, or fire they need a complete claim, less admin, and one receipt both sides can check."

## 0:20 — The private pack

Open HowlPay. Show the pack: the verified-alert card, photos, invoices, the pack hash, and R200 / USDT. Say the private pack is the source of truth, and only the hash goes on-chain. Read the source as "an existing verified incident-alert feed for Cape Town small shops (partner)".

## 0:45 — Open and approve

Show `openClaim`. Switch to the insurer role. A human reviews the pack and approves (or show reject first: no payout). Then the five-step payment review: payee, USDT, rand, fee, Sepolia.

## 1:15 — Release and receipt

Show `approveAndRelease`. Read the events: opened, approved, paid. That is the shared receipt, with the Etherscan link. The contract released a pre-funded float; it did not decide the claim.

If the contract path is not live, say you are using the fallback: a direct treasury transfer, and show the tested contract separately.

## 1:50 — Recovery

Take that tx / claim id. Turn the story to a dropped signal: both sides still have one receipt. Re-read the claim state or `status --hash`. Say you are not paying again. The contract will not double-pay.

## 2:20 — Simulated rand payout

Show the labelled simulation and the `SIM-` reference, "via licensed partner". "The shop sees rand. They did not have to hold USDT. No bank or mobile-money payout was sent in this demo."

## 2:45 — Close

"The pack is private. The contract holds the obligation. A human approved, then the float paid, and both sides can re-check the same receipt."

## Superseded: 12 Nov credit-and-reward script

Kept as fallback shots only (architecture diagram, an R20 top-up re-check). Do not lead the Friday video with a service-credit top-up.

To re-check the confirmed shop → treasury top-up:

`npm run wallet -- status --hash 0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`

Etherscan: https://sepolia.etherscan.io/tx/0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918
