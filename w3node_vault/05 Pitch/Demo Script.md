---
tags:
  - pitch
  - demo
status: draft
date: 2026-11-12
---

# Demo script

Three minutes. One shop owner. One payment from review toward a receipt. One failure and a recovery. Label every simulated part.

## 0:00 — Who

"This is a spaza owner. A safety or stock app wants to charge them for credits, and to pay them when a price or an incident report checks out. They do not have a card."

## 0:25 — Review

Open HowlPay. Tap a credit pack. Read credits, rand, USDT, and Sepolia out loud. Tap Cancel. Nothing is signed.

## 0:55 — The payment, and the failure

Run the wallet script for that pack.

- **If the address has test USDT and Sepolia ETH:** quote, show recipient, amount, fee, and network, then `--approve`. Read the hash. Immediately run `status` and show pending or confirmed. That is the receipt.
- **If it is still empty:** the script stops because the balance is short and does not sign. Say that plainly. That stop is the failure. Do not cut in a fake success.

## 1:40 — Recovery

Take the hash from a submit, or any 32-byte hash if nothing was submitted. Turn the story to a dropped signal: the shop still has one hash. Run `status --hash` again. Say you are not sending a second payment. If the hash is unknown, the line is "not seen yet", which is the correct recovery, not an error to hide.

## 2:20 — Simulated cash-out

Open Cash out. The banner says simulated. Enter a mobile number and an amount. Show the `SIM-` reference. "No USDT moved. No mobile-money payout was sent."

## 2:45 — Close

"Credits are recorded by the partner only after confirmation. That ledger is not in this demo. Next is a relief pool that pays out on a verified incident."

Do not show a seed, a `.env` file, or a mainnet network.
