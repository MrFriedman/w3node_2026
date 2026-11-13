---
tags:
  - product
  - build
  - spec
status: frozen
date: 2026-11-13
---

# V1 Build Spec

Frozen Fri 13 Nov 2026. Refined ~09:45 SAST with a claim-escrow contract and tighter positioning. This is the source of truth for the v1 build Codex should do today. Product decision: [[Pivot Decision]] · [[Decisions]]. Testnet facts: [[Testnet]]. Hard rules: `AGENTS.md`.

**Deadline:** demo video and final BuilderBase packet by **Fri 13 Nov 2026, 23:59 SAST**. Design the work so it is buildable today, leaving time to record the video from [[Demo Script]].

**Positioning.** HowlPay is the **single source of truth for the claims process**: a private incident record plus a recovery pack, with a Sepolia contract that records each step and holds then releases the USDT payout once a human approves. The buyers are **embedded micro-insurance platforms and insurers** selling to spazas and SMEs. **Spazas are the beachhead**; other SMEs and businesses in general are the expansion story. The main selling point is **less claims-handling overhead and admin**, plus faster, complete claims with one shared receipt. The overhead-saving claim is a **hypothesis to validate on today's calls**, not a measured fact.

**Public naming (frozen):** stay neutral. Describe the incident source as "an existing verified incident-alert feed for Cape Town small shops (partner)". Do not name a specific partner product, website, bot handle, or township. HowlPay is the public product name and may be used.

The **off-chain private record** (claim-pack JSON and photo/invoice placeholders, stored locally or mocked, plus its hash) is the single source of truth for what happened. The **contract** is the payment obligation and the on-chain audit trail. Only the pack hash goes on-chain, never personal data (POPIA). The contract does not decide the claim; a human does. The legal policy still governs.

## In scope

A fictional but complete claims-payout walkthrough on Sepolia:

1. A **private claim pack** for one shop (sample data is fine), with its hash shown in the UI.
2. A **minimal escrow contract** `contracts/ClaimEscrow.sol` on Sepolia, using the existing test USD₮ ERC-20. It records claim steps and holds then releases the payout after human approval. See the contract section below.
3. A **human insurer approval** of a rand amount, or a reject.
4. A **shared receipt** both sides can see, read from contract events plus an Etherscan link: pack hash, claim id, USDT, rand at `ZAR_PER_USDT`, status. Re-check the same tx; do not pay twice.
5. A **simulated rand payout**, clearly labelled (via licensed partner). No real off-ramp.

The Expo app is the walkthrough UI. Signing uses Tether WDK (`wdk-wallet-evm`) via scripts where possible. Do not spend the day wiring on-device WDK.

**Fallback, 17:00 SAST:** if the contract is not ready to demo (deployed on Sepolia and covered by tests), the video uses the existing direct treasury → shop transfer from `scripts/wallet.ts`. Still show the contract as written, tested, and (if it did deploy) verified on Etherscan. Do not fake a receipt.

## Out of scope

- A live partner alert feed or any named partner product.
- A real insurer or claims backend. This repo does not decide claims.
- On-device signing / WDK worklet.
- A live mobile-money or bank off-ramp.
- Persisting the hash across an app restart (nice if cheap; not required).
- Service-credit top-ups, micro-rewards, stokvel, remittances, or a relief pool as the demo path. Those screens may stay in the app as earlier checkpoint work.
- Mainnet, a new token, a new chain, or an Avalanche claims ledger.
- Opening, reading, or logging `.env.treasury`. Agents must not do this.

## Sample claim (use this unless Dylan changes the amount)

- Shop / payee: `0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab`
- Token: Pimlico USD₮ `0xd077A400968890Eacc75cdc901F0356c943e4fDb` on Sepolia `11155111`
- FX: `ZAR_PER_USDT=16.5639` (11 Nov 2026 snapshot). Convert rand → USDT with the existing rounding in `shared/`.
- Approved amount: **R200**. State both rand and USDT on the review and the receipt.
- Incident card (fictional): "Verified alert, 14:05, 300 m from shop", sourced from "an existing verified incident-alert feed for Cape Town small shops (partner)".
- Pack also has 3 photo placeholders and 2 stock-invoice placeholders, plus a SHA-256 of the pack shown on screen.
- Shop wallet gas (deployer): about **0.03 Sepolia ETH** after the 12 Nov treasury fund. Re-check on chain before deploy. See [[Testnet]].
- For the Friday contract demo, the shop wallet in `.env` is the deployer and owner, and may also be set as the insurer and the platform so **one key** can deploy, fund the float, open a claim, and release. Do not open `.env.treasury`. The separate treasury address remains useful for the 17:00 direct-transfer fallback.

## Claim escrow contract

Path: `contracts/ClaimEscrow.sol`. Sepolia only. Token is the existing test USD₮ above, passed into the constructor. Do not ship a new token.

**Roles (keep them simple):**
- **Owner** (deployer) can set the insurer address.
- **Insurer** funds the USD₮ float (`approve` plus `deposit`) and is the only role that can `approveAndRelease` or `reject`.
- **Platform** opens claims with `openClaim`. For the demo, owner may set platform and insurer to the shop wallet.

**Functions and states:**
- `deposit(uint256 amount)` — insurer only. Pulls USD₮ from the insurer after a standard ERC-20 `approve`. Increases the float.
- `openClaim(bytes32 packHash, address payee, uint256 amount)` — platform (or owner) only. Records the claim as **Opened**. `packHash` is the hash of the private pack; never store photos, names, IDs, or invoice text on-chain. Reject zero payee, zero amount, or amount greater than the remaining float.
- `approveAndRelease(uint256 claimId)` — insurer only. Claim must be **Opened**. Moves it to **Approved**, transfers `amount` of USD₮ from the contract float to the payee, then marks it **Paid**. Do this in one call so there is no approved-but-unpaid gap in v1. Emit events for the approval and the payout (or one event with both).
- `reject(uint256 claimId)` — insurer only. Claim must be **Opened**. Moves it to **Rejected** and does not transfer tokens. The reserved amount returns to the available float if `openClaim` reserved it.
- States: **Opened**, **Approved/Paid**, **Rejected**.

**Guards:**
- No double pay: `approveAndRelease` reverts if the claim is not Opened.
- Amount at most the available float at open (and again at release if you do not reserve on open). Prefer reserving on open so two open claims cannot over-commit the float.
- Only the insurer can deposit, release, or reject.
- Only the platform or owner can open.
- Revert on a zero payee or a zero / unauthorised token transfer.

**Events** (the shared receipt reads these, plus the tx hash and Etherscan link): `Deposited`, `ClaimOpened` (claimId, packHash, payee, amount, opener), `ClaimApproved`, `ClaimPaid` (or a combined approved-and-paid event), `ClaimRejected`. Include claimId, amounts, and actor addresses.

**Tooling:** Foundry or Hardhat, whichever is quicker on this machine with Node 22. If Foundry is already available or installs cleanly, prefer it. Put tests next to the contract.

**Tests (required):**
1. Happy path: deposit, open, approveAndRelease, payee balance increased, claim Paid, float decreased.
2. Double pay: a second `approveAndRelease` on the same claim reverts.
3. Wrong caller: a non-insurer cannot release or reject; a non-platform cannot open.
4. Insufficient float: `openClaim` (or release, if not reserved) reverts when amount exceeds the available float.

**Deploy script:** deployer key comes from the repo-root `.env` through the **existing loader** already used by `scripts/wallet.ts` (the shop key). Never print, log, or echo the key or the seed. Refuse any chain id other than Sepolia `11155111`. After a successful deploy, **append the contract address and the deploy tx hash to `w3node_vault/03 Build/Testnet.md`**. Do not otherwise rewrite that file.

**Integration:**
- Scripts (and the app, if a hook is easy) call the contract with the Tether WDK `wdk-wallet-evm` signer where possible. If WDK cannot reasonably send these contract calls in time, a thin script that still uses the same `.env` loader and still never prints the key is acceptable; say so in the Build Log.
- The receipt screen reads the claim's events plus the Etherscan link. Re-check by reading the claim state and the tx, not by sending again.
- The rand cash-out stays **SIMULATED**.

## User flows

On-chain USD₮ movements still follow Tether's five steps: (1) validate address, network, and token; (2) check the float or wallet balance and quote the fee; (3) show recipient, amount, fee, and network, then approve or cancel; (4) sign and submit; (5) read the receipt and stay pending until confirmed. Reconnect repeats step 5 on the **same** hash.

### 1. Private claim pack

The shop (or the partner, for them) has a pack for one incident: the verified-alert card, photos, invoices, pack hash, and a requested amount. This off-chain record is the source of truth. Nothing is signed yet.

### 2. Open the claim on-chain

The platform calls `openClaim(packHash, shop, amount)`. Only the hash, payee, and amount go on-chain. The claim is Opened and the amount is reserved in the float. The insurer must already have deposited enough USD₮.

### 3. Insurer approves or rejects

A human reviews the private pack. This is a claim decision, not a robot or an oracle. Reject calls `reject(claimId)` and writes no payout. Approve confirms the rand amount (default R200) and, after a five-step review in the UI, calls `approveAndRelease(claimId)`. Cancel at the review step writes nothing.

### 4. Shared receipt and simulated rand

Both the insurer view and the shop view show the same receipt, built from the contract events and the tx hash: claim id, pack hash, USDT, rand, Paid or Rejected, Etherscan link. Re-check reads that claim and tx only. The rand leg is a labelled simulation (`SIM-` reference is fine).

If the 17:00 fallback is used, the payout is a direct `scripts/wallet.ts` treasury → shop send instead of `approveAndRelease`. Label it as the fallback, not as an escrow release.

## Screens (Expo)

Keep the existing visual tokens. Add a clear v1 path; old Wallet / Top up / Rewards tabs may remain but must not be the demo.

1. **Role toggle** — Shop, Platform, or Insurer (demo only).
2. **Claim pack** — incident card, placeholders, pack hash, requested R200 / USDT. Short note: the private pack is the source of truth; only the hash goes on-chain.
3. **Open claim** — shows pack hash, payee, amount; then the open tx.
4. **Insurer decision** — approve or reject, with a short POPIA note.
5. **Payment review** — five-step quote for `approveAndRelease`. Approve or cancel.
6. **Pending** — one tx hash / claim id, waiting for confirmation.
7. **Shared receipt** — events, amounts, status, Etherscan, re-check control.
8. **Simulated rand payout** — labelled, no USDT movement from this step.
9. **Missing-documents checklist** — required documents for the incident type (riot, theft, or fire), shown before submission.
10. **Pre-filled insurer claim form** — the generic template filled from the R200 sample pack, plus an indexed supporting-documents bundle.

## Data model

No new backend. A single sample pack, plus the on-chain claim, is enough.

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
}

type OnChainClaim = {
  claimId?: string
  packHash: string
  payee: string
  amountUsdt: string
  amountZar: string
  state: "none" | "opened" | "paid" | "rejected"
  openTxHash?: string
  releaseTxHash?: string
  simulatedRandRef?: string
}
```

`packHash` on-chain is `bytes32`. Derive it from the UTF-8 SHA-256 of a stable canonical JSON of the pack fields that are not raw binary files, plus fixed placeholder ids for photos and invoices.

## Insurer claim-form compatibility (validation feedback, 13 Nov)

One Cape Town broker, in a qualitative interview on 13 Nov, reported insurer-specific forms and supporting documents, about four follow-ups per file and about five days to pay after approval in their experience. These are interview observations, not industry averages, HowlPay results or service commitments. Riot-related claims require evidence for human assessment of the applicable peril and cover.

HowlPay's intended direction is to help prepare information for the receiving insurer's form. The current milestone demonstrates preparation; it does not establish insurer acceptance or provide a production system of record.

Today's redacted validation notes: [[Validation Findings 2026-11-13]].

**Today's scope:**
1. A shared typed **Generic claim preparation form — demonstration**, with claimant, policy reference, incident type/date/location, description, rand amount and unresolved banking details. Use a separate fictional R200 fixture; preserve the historical settlement pack.
2. In-app form and indexed supporting-fixture bundle previews, with serialisable JSON. Confirmed assistant and form edits share one session draft and field provenance.
3. Versioned riot/theft/fire checklists, with published source links or explicit generic assumptions, conditional requirements, and missing/placeholder/supplied/reviewed states. A placeholder is incomplete. The receiving insurer determines final requirements.
4. Automatically include a fictional timestamped area record labelled "an existing verified incident-alert feed for Cape Town small shops (partner)". No live feed is connected; corroboration alone does not establish coverage.
5. A deterministic SHA-256 **off-chain preparation digest** over template/checklist versions, canonical form, stable attachment manifest, fixture content hashes and incomplete states. The existing transaction does not anchor this digest.
6. Claimant capture and broker file preparation through a persistent Claims / Activity / Assistant shell. Broker follow-ups are drafts for manual review/copy only.

Keep DEMO_PACK, DEMO_PACK_HASH and receipt inputs unchanged. Do not open or pay a new claim, redeploy the contract or submit to an insurer for this milestone. Preserve the 17:00 contract gate and fallback procedure; investigate read-only verification failures before suggesting fallback. Never fake a receipt.

**Roadmap:** real insurer-specific templates and PDF filling, uploads, secure case storage, authentication, free-form case Q&A and general document understanding. Insurer decision support and platform administration remain beyond existing demo functions. See [[Claims Assistant Audit]] for evidence, prioritisation and validation.

## Acceptance criteria

- [ ] Sepolia only. Scripts still refuse any other chain id. No mainnet RPC or token is added.
- [ ] `ClaimEscrow` tests pass for happy path, double pay, wrong caller, and insufficient float.
- [ ] The contract is deployed on Sepolia and the address is in [[Testnet]], **or** it is tested locally and the 17:00 fallback is used, with that choice labelled in the demo.
- [ ] The Expo walkthrough can show pack → open → approve → pending → event-based receipt → simulated rand, with reject and cancel as no-payout paths.
- [ ] Recipient, amount (rand and USDT), fee, and network are visible before the release is signed.
- [ ] The same claim cannot be paid twice. A second send is never used as a "retry".
- [ ] No seed, private key, or `.env` contents appear in the UI, logs, git, or screenshots. Only the pack hash, not the pack contents, is on-chain.
- [ ] Simulated rand is labelled. The incident source uses the frozen public phrase, not a partner product name.
- [ ] Existing `scripts/` tests and both app/script typechecks still pass.
- [ ] A clearly labelled generic demonstration form maps claimant, policy, incident type/date/location, description and amount; banking remains unresolved.
- [ ] A separate fictional R200 preparation fixture produces a form and indexed fixture bundle, including a fictional incident record with the frozen source phrase.
- [ ] The Expo walkthrough shows the incident checklist before Prepare demo pack; no live submission is implied.
- [ ] The off-chain preparation digest covers form data, versions and fixture content/membership/state. It is explicitly unanchored; the existing Sepolia receipt and historical hash remain unchanged.

## Task order

Work in this order. Aim to have the contract tested, and deployed if at all possible, **before 17:00 SAST**. Leave time after that for the UI polish and the 3-minute video.

1. Read this spec, [[Testnet]], and `AGENTS.md`. Do not open `.env.treasury` or `w3node_vault/_private/`.
2. Write `contracts/ClaimEscrow.sol` and the four tests above (Foundry or Hardhat, whichever is quicker on Node 22).
3. Write the deploy script (shop key from `.env` via the existing loader, never printed, Sepolia only). Deploy, then append the address and tx hash to [[Testnet]].
4. Add scripts to deposit, openClaim, approveAndRelease, reject, and read events, using the WDK signer where possible.
5. Add shared types, ZAR→USDT conversion via existing helpers, a stable pack hash, and the fictional sample pack (placeholders are fine).
6. Build the Expo screens above, in order, on the existing design tokens. Hook the receipt to contract events and the tx hash.
6a. Add insurer claim-form compatibility (today's scope in the section above), including the Expo checklist screen. Do not start this until the contract path in steps 2–4 is in place, and do not let it slip the 17:00 gate in step 8. If 17:00 is at risk, finish or switch to the fallback first, then return to this work.
7. Run contract tests, `npm test` in `scripts/`, and both typechecks. Include tests for the form-field mapping and the missing-documents checklist. Fix what you broke.
8. **17:00 SAST gate:** if the contract is not deployed and callable for the demo, switch the payout path to the direct treasury transfer fallback and still show the tested contract in the video.
9. Stop in time for a 3-minute video from [[Demo Script]]. Leave git changes uncommitted if the repo's standing rule is that Dylan reviews first; otherwise follow `AGENTS.md`.

Do not invent a new chain client or a new token. Do not edit this spec to weaken the guards or to put personal data on-chain.

## Approved UI refinement — theft preparation and landing page (13 Nov, later)

This section supersedes the earlier screen/navigation and signing walkthrough for the current UI milestone. No new payment, contract deployment, real insurer submission or payment integration is authorised. The historical contract, DEMO_PACK, DEMO_PACK_HASH and receipt reader remain unchanged.

- Landing page introduces shopkeepers working with their existing brokers, broker preparation value and insurer decision authority. CTAs enter the local demo; no signup, backend or publication. Repeated-request reduction remains a hypothesis.
- Default Shop view, fictional theft preparation PREP–THEFT–001, Claim / Requests / Progress. Role switching is explicitly a demo control. Contextual assistant confirmation and conversation persist within the session.
- Shared workflow stages: Draft, Broker review, Needs information, Ready for insurer, Submitted for insurer review. Required demo fields, supplied synthetic evidence and accepted required requests gate readiness. Real insurer requirements and acceptance remain unresolved.
- Seeded police-reference request supports answer, clarification and broker acceptance. Synthetic policy/photo records are explicitly added to complete the demonstration; placeholders do not count as complete.
- Ready freezes a preparation snapshot. Material form, evidence, option or request changes invalidate readiness. Simulated submissions retain numbered immutable versions. Insurer decisions are illustrative; requested loss and illustrative approved amount are separate.
- The current theft claim never becomes Paid or Rand received. An expandable historical testnet payment card retains independent verification/stale/unavailable/pending/failed handling. On-ramp and off-ramp are labelled SIMULATED, and the pre-funded pool is explained separately.
- Session-local only, explicit reset and reload notice. No authentication, real uploads, secure storage, insurer integration or native signing added. Contract amount/payee freeze-at-open and duplicate pack guard remain unchanged limitations.
