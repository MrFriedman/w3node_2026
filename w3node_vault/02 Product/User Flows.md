---
tags:
  - product
  - flows
status: active
date: 2026-11-13
---

# User flows

Each USDT movement follows Tether's five steps: validate address, network, and token; check balance and quote the fee; show recipient, amount, fee, and network, then approve or cancel; sign and submit; read the receipt and stay pending until confirmed.

**V1 lead flow (frozen 13 Nov):** [[V1 Build Spec]]. The top-up and reward sections below are earlier checkpoint work. They remain accurate for the script path and are superseded as the Friday demo.

## V1 — Claim pack, approve, pay, receipt

1. A shop has a claim pack after a riot, theft, or fire: a verified-alert card from "an existing verified incident-alert feed for Cape Town small shops (partner)", photos, invoices, a pack hash, and a requested amount (sample: R200).
2. A human insurer reviews the pack. Reject writes nothing on-chain. Approve confirms the rand amount and moves to payment review.
3. Payment review shows shop address, USDT, rand, fee, and Sepolia. Cancel writes nothing. Approve means the treasury sends USDT to the shop through `scripts/wallet.ts` (`quote` / `send --to <shop> --usdt <amount> --approve --wait`). The shop does not sign. Do not open or print `.env.treasury`.
4. Both sides see the same receipt: tx hash, USDT, rand at `ZAR_PER_USDT`, pending then confirmed. Re-check that same hash. The rand leg is a labelled simulation.

## Top-up (superseded as the lead demo)

1. The shop picks a service-credit pack. The demo catalog is R20/10, R40/20, R80/50, R150/100, R300/220. Rand becomes USDT with the checkpoint FX snapshot, rounded up.
2. The screen shows credits, rand, USDT, and Sepolia. The fee is quoted by the script, not invented in the UI.
3. Cancel writes nothing. Approve is still disabled in the app until the on-device worklet exists. The script signs only with `--approve`.
4. The partner records credits only after the receipt is confirmed. This repo does not call that backend.

The script path is proven live: an R20 pack was sent to the treasury and confirmed. See [[Testnet]]. That hash is fallback evidence, not the v1 claim payout.

## Reward payout (superseded as the lead demo)

1. The shop submits a data contribution (an incident report, a price, or similar).
2. The partner verifies it and passes the shop's USDT address to the treasury.
3. The treasury script, opened with the treasury seed, runs the same five steps. The shop does not sign. Do not open or print `.env.treasury` while doing this.
4. The hash is stored as pending. Credits or a "paid" flag wait for confirmation.

The v1 claim payout reuses this treasury → shop direction, triggered by an insurer approval of a claim pack rather than a data-contribution reward.

## Reconnect and re-check

After submit, the hash is the only handle. If the signal drops, show the last-known status. On reconnect, call `status --hash` on that same hash. A missing receipt means "not seen yet". Do not send a second transfer for the same payment. A reverted or dropped hash does not record a paid claim.

The app remembers a hash only while it is open. The script re-checks any hash you pass. Persisting the hash on the device is still open. See [[Tasks]].

The confirmed R20 top-up hash can be re-checked without sending again (fallback evidence only):

`npm run wallet -- status --hash 0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`

## Simulated rand payout

Labelled simulation. After a confirmed USDT payout, the shop sees a `SIM-` reference for the rand leg, "via licensed partner". No USDT moves in this step and no off-ramp API is called. Say that on camera.
