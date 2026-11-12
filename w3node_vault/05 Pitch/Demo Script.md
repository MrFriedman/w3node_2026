---
tags:
  - pitch
  - demo
status: draft
date: 2026-11-12
---

# Demo script

Three minutes, preferably 1–2. One shop owner. One payment from review to a receipt. One failure and a recovery. Label every simulated part.

The shop wallet is funded and an R20 top-up has already confirmed. See [[Testnet]]. Prefer a fresh send only if you mean to spend again. Otherwise quote a pack, then re-check the existing hash. Do not show a seed, a `.env` file, or a mainnet network.

Suggested recording (Cmd+Shift+5): the architecture diagram, `npm test` in `scripts/`, a quote or send plus `status --hash`, then the Expo app.

## 0:00 — Who

"This is a spaza owner. A safety or stock app wants to charge them for credits, and to pay them when a price or an incident report checks out. They do not have a card."

## 0:20 — Review

Open HowlPay. Tap a credit pack. Read credits, rand, USDT, and Sepolia out loud. Tap Cancel. Nothing is signed. If the wired UI is not ready, say Approve on the phone is still disabled and switch to the script.

## 0:50 — The payment

From `scripts/`:

```bash
npm test
npm run wallet -- quote --bundle r20
```

Then either:

- a new send, only if you want a second payment: `npm run wallet -- send --bundle r20 --approve --wait`
- or re-check the confirmed R20 hash: `npm run wallet -- status --hash 0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`

Read recipient, amount, fee, and network, then the hash and confirmed. That is the receipt. Etherscan: https://sepolia.etherscan.io/tx/0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918

If the Expo UI has been wired, show the live balance and the same flow on the phone instead, including pending then confirmed.

## 1:40 — Recovery

Take that hash. Turn the story to a dropped signal: the shop still has one hash. Run `status --hash` again, or trigger reconnect in the app. Say you are not sending a second payment. Pending stays pending. Confirmed stays confirmed. "Not seen yet" is the correct answer for an unknown hash, not an error to hide.

## 2:20 — Simulated cash-out

Open Cash out. The banner says simulated. Enter a mobile number and an amount. Show the `SIM-` reference. "No USDT moved. No mobile-money payout was sent."

## 2:45 — Close

"Credits are recorded by the partner only after confirmation. That ledger is not in this demo. Next is a relief pool that pays out on a verified incident."
