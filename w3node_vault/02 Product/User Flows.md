---
tags:
  - product
  - flows
status: active
date: 2026-11-12
---

# User flows

Each USDT movement follows Tether's five steps: validate address, network, and token; check balance and quote the fee; show recipient, amount, fee, and network, then approve or cancel; sign and submit; read the receipt and stay pending until confirmed.

## Top-up

1. The shop picks a service-credit pack. The demo catalog is R20/10, R40/20, R80/50, R150/100, R300/220. Rand becomes USDT with the checkpoint FX snapshot, rounded up.
2. The screen shows credits, rand, USDT, and Sepolia. The fee is quoted by the script, not invented in the UI.
3. Cancel writes nothing. Approve is disabled in the app until the on-device worklet exists. The script signs only with `--approve`.
4. The partner records credits only after the receipt is confirmed. This repo does not call that backend.

## Reward payout

1. The shop submits a data contribution (an incident report, a price, or similar).
2. The partner verifies it and passes the shop's USDT address to the treasury.
3. The treasury script, opened with the treasury seed, runs the same five steps. The shop does not sign.
4. The hash is stored as pending. Credits or a "paid" flag wait for confirmation.

## Reconnect and re-check

After submit, the hash is the only handle. If the signal drops, show the last-known status. On reconnect, call `status --hash` on that same hash. A missing receipt means "not seen yet". Do not send a second transfer for the same payment. A reverted or dropped hash does not record credits.

The app remembers a hash only while it is open. The script re-checks any hash you pass. Persisting the hash on the device is still open. See [[Tasks]].

## Cash-out

Labelled simulation. The shop enters a mobile number and a USDT amount and gets a `SIM-` reference. No USDT moves and no mobile-money API is called. Say that on camera.
