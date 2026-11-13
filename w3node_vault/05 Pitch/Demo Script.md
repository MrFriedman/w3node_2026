---
tags:
  - pitch
  - demo
status: draft
date: 2026-11-13
---

# Demo script

Three minutes, preferably 1–2. One shop, one approved claim, one treasury payout from review to a shared receipt, one re-check after a dropped signal. Label every simulated part.

Build against [[V1 Build Spec]]. Wallets and hashes: [[Testnet]]. Do not show a seed, a `.env` file, or a mainnet network. Do not name a specific partner product; say "an existing verified incident-alert feed for Cape Town small shops (partner)".

Suggested recording (Cmd+Shift+5): the claim pack and insurer approve in Expo, `npm test` in `scripts/`, a treasury → shop `quote` or `send` plus `status --hash`, the shared receipt, the labelled simulated rand payout.

## 0:00 — Who

"This is a spaza owner. After a riot, theft, or fire they need a claim paid, and they need one receipt they and the insurer can both check. They may not have a card or a smooth claims process."

## 0:20 — The claim pack

Open HowlPay. Show the pack: the verified-alert card, photos, invoices, the pack hash, and R200 / USDT. Read the source as "an existing verified incident-alert feed for Cape Town small shops (partner)".

## 0:45 — Insurer approves

Switch to the insurer role. Approve the amount (or show Cancel/Reject first: nothing is signed). A human makes this decision. Then show the payment review: shop address, USDT, rand, fee, Sepolia.

## 1:10 — The payout

From `scripts/`, with the treasury wallet already loaded by the operator:

```bash
npm test
npm run wallet -- quote --to 0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab --usdt <amount>
npm run wallet -- send --to 0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab --usdt <amount> --approve --wait
```

Read recipient, amount, fee, and network, then the hash and confirmed. That is the shared receipt. If a new send is not possible in time, re-check a known Sepolia hash and say clearly whether it is this payout or the earlier R20 top-up.

## 1:50 — Recovery

Take that hash. Turn the story to a dropped signal: both sides still have one hash. Run `status --hash` again, or trigger reconnect in the app. Say you are not sending a second payment. Pending stays pending. Confirmed stays confirmed.

## 2:20 — Simulated rand payout

Show the labelled simulation and the `SIM-` reference, "via licensed partner". "No extra USDT moved. No bank or mobile-money payout was sent."

## 2:45 — Close

"The insurer decided. The float paid. Both sides can re-check the same receipt. A live off-ramp and a real claims backend are not in this demo."

## Superseded: 12 Nov credit-and-reward script

Kept as fallback shots only (architecture diagram, an R20 top-up re-check). Do not lead the Friday video with a service-credit top-up.

To re-check the confirmed shop → treasury top-up:

`npm run wallet -- status --hash 0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`

Etherscan: https://sepolia.etherscan.io/tx/0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918
