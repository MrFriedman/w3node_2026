---
tags:
  - product
  - build
  - spec
status: frozen
date: 2026-11-13
---

# V1 Build Spec

Frozen Fri 13 Nov 2026, ~09:30 SAST. This is the source of truth for the v1 build Codex should do today. Product decision: [[Pivot Decision]] · [[Decisions]]. Testnet facts: [[Testnet]]. Hard rules: `AGENTS.md`.

**Deadline:** demo video and final BuilderBase packet by **Fri 13 Nov 2026, 23:59 SAST**. Design the work so it is buildable in about **8 hours**, leaving time to record the video from [[Demo Script]].

**Public naming (frozen):** stay neutral. Describe the incident source as "an existing verified incident-alert feed for Cape Town small shops (partner)". Do not name a specific partner product, website, bot handle, or township. HowlPay is the public product name and may be used.

## In scope

A fictional but complete claims-payout walkthrough on Sepolia, reusing Tether WDK and `scripts/wallet.ts`:

1. A **claim pack** for one shop (sample data is fine).
2. A **human insurer approval** of a rand amount (or a reject that writes nothing on-chain).
3. A **treasury → shop** USDT payout from the already-funded float, following the five-step payment flow.
4. A **shared receipt** both sides can see: tx hash, USDT, rand at `ZAR_PER_USDT`, status. Re-check the same hash; do not send again.
5. A **simulated rand payout**, clearly labelled (via licensed partner). No real off-ramp.

The Expo app is the walkthrough UI. Signing stays in `scripts/wallet.ts` unless a safe, Sepolia-only hook is already easy. Do not spend the 8 hours wiring on-device WDK.

## Out of scope

- A live partner alert feed or any named partner product.
- A real insurer or claims backend, and any on-chain claims ledger (including Avalanche).
- On-device signing / WDK worklet.
- A live mobile-money or bank off-ramp.
- Persisting the hash across an app restart (nice if cheap; not required).
- Service-credit top-ups, micro-rewards, stokvel, remittances, or a relief pool as the demo path. Those screens may stay in the app as earlier checkpoint work.
- Mainnet, new tokens, or a new chain.
- Opening, reading, or logging `.env.treasury`. Agents must not do this. The demo operator loads the treasury wallet if a live payout is signed.

## Sample claim (use this unless Dylan changes the amount)

- Shop: `0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab`
- Treasury (payer): `0xDB071a2410FCB0B4e0b498953139CF18E009388b`
- Token: Pimlico USD₮ `0xd077A400968890Eacc75cdc901F0356c943e4fDb` on Sepolia `11155111`
- FX: `ZAR_PER_USDT=16.5639` (11 Nov 2026 snapshot). Convert rand → USDT with the existing rounding in `shared/`.
- Approved amount: **R200**. State both rand and USDT on the review and the receipt.
- Incident card (fictional): "Verified alert, 14:05, 300 m from shop", sourced from "an existing verified incident-alert feed for Cape Town small shops (partner)".
- Pack also has 3 photo placeholders and 2 stock-invoice placeholders, plus a SHA-256 of the pack shown on screen.
- Treasury float (last checked 22:16 SAST, 12 Nov 2026): **0.02 ETH** and **201.207446 USD₮**. Re-check balances on chain before a live send. See [[Testnet]].

## User flows

Every USDT movement still uses Tether's five steps: (1) validate address, network, and token; (2) check the treasury balance and quote the fee; (3) show recipient, amount, fee, and network, then approve or cancel; (4) sign and submit; (5) read the receipt and stay pending until confirmed. Reconnect repeats step 5 on the **same** hash.

### 1. Claim pack

The shop (or the partner, for them) has a pack for one incident: the verified-alert card, photos, invoices, pack hash, and a requested amount. Nothing is signed yet.

### 2. Insurer approves or rejects

A human reviews the pack. Reject stops the flow and writes nothing on-chain. Approve confirms the rand amount (default R200) and moves to payment review. This is a claim decision, not a blockchain signature.

### 3. Pay (treasury → shop)

The UI shows the five-step review: shop address, USDT, rand, fee quote, Sepolia. Cancel writes nothing. Approve means the operator runs, from `scripts/`, with the treasury wallet loaded by the operator (not by an agent reading `.env.treasury`):

```bash
npm run wallet -- quote --to 0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab --usdt <amount>
npm run wallet -- send --to 0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab --usdt <amount> --approve --wait
```

Paste or record the returned hash in the app. A script-to-app hook is optional and must not become a blocker. A second `send` is a second payment.

### 4. Shared receipt and simulated rand

Both the insurer view and the shop view show the same receipt: hash, Etherscan link, USDT, rand, pending or confirmed, and a labelled **SIMULATED** rand payout (a `SIM-` reference is fine). Re-check uses `status --hash` on that hash only. The already-confirmed R20 top-up hash remains valid fallback evidence if a new payout cannot be sent in time; it is a shop→treasury top-up, so say so, and do not present it as this claim payout.

## Screens (Expo)

Keep the existing visual tokens. Add a clear v1 path; old Wallet / Top up / Rewards tabs may remain but must not be the demo.

1. **Role toggle** — Shop or Insurer (demo only).
2. **Claim pack** — incident card, placeholders, pack hash, requested R200 / USDT.
3. **Insurer decision** — approve or reject, with a short POPIA note (photos and invoices stay off-chain; only the pack hash sits next to the payout).
4. **Payment review** — five-step quote. Approve or cancel.
5. **Pending** — one hash, waiting for confirmation.
6. **Shared receipt** — hash, amounts, confirmed status, re-check control.
7. **Simulated rand payout** — labelled, no USDT movement from this step.

## Data model (in-app is enough)

No new backend. A single sample record is fine.

```ts
type ClaimPack = {
  id: string
  shopAddress: string
  sourceLabel: string // the frozen public phrase
  incident: { time: string; distance: string; summary: string }
  photos: string[]
  invoices: string[]
  packHash: string // sha-256 hex of a stable canonicalisation of the pack
  amountZar: string // "200.00"
  amountUsdt: string // from shared rounding
  decision: "none" | "approved" | "rejected"
}

type Payout = {
  from: string // treasury
  to: string // shop
  usdt: string
  zar: string
  feeEth?: string
  txHash?: string
  status: "none" | "quoted" | "pending" | "confirmed" | "failed"
  simulatedRandRef?: string // e.g. SIM-…
}
```

## Acceptance criteria

- [ ] Sepolia only. The script still refuses any other chain id. No mainnet RPC or token is added.
- [ ] The Expo walkthrough can show pack → approve → quote → pending → receipt → simulated rand, with reject and cancel as no-ops on chain.
- [ ] A live treasury → shop send can be completed with `scripts/wallet.ts` and the hash re-checked. If the live send is blocked, the UI still walks through on a pasted hash and the video can fall back to re-checking a known Sepolia hash, labelled honestly.
- [ ] Recipient, amount (rand and USDT), fee, and network are visible before payment approve.
- [ ] The same hash is re-checked. A second send is never used as a "retry".
- [ ] No seed, private key, or `.env` contents appear in the UI, logs, git, or screenshots.
- [ ] Simulated rand is labelled. The incident source uses the frozen public phrase, not a partner product name.
- [ ] `npm test` and both typechecks still pass.

## Task order (about 8 hours)

1. Read this spec, [[Testnet]], and `AGENTS.md`. Do not open `.env.treasury` or `w3node_vault/_private/`.
2. Add shared types, ZAR→USDT conversion via existing helpers, and a stable pack hash.
3. Add the fictional sample pack (placeholders are fine).
4. Build the Expo screens above, in order, on the existing design tokens.
5. Hook the receipt to a pasted (or returned) tx hash and `status` re-check. Only then consider a tighter script hook.
6. Run `npm test` and both typechecks. Fix what you broke.
7. Stop in time for a 3-minute video from [[Demo Script]]. Leave git changes uncommitted if the repo's standing rule is that Dylan reviews first; otherwise follow whatever `AGENTS.md` says at the time.

Existing `send --to` / `quote --to` / `status --hash` should be enough. Do not invent a new chain client.
