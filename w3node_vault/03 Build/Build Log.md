---
tags:
  - build
  - log
status: active
date: 2026-11-13
---

# Build log

## 2026-11-12, morning

- Checkpoint foundation: Sepolia wallet script, Expo shell, architecture diagram, README.
- `npm test` and `npm run typecheck` pass in `scripts/`. The app typechecks, and Metro produced an Android bundle.
- Against Sepolia, the public BIP-39 test address `0x9858EfFD232B4033E47d90003D41EC34EcaEda94` has 0 ETH and 0 Test Tether USD. `quote` and `send` stop before a signature. No transaction was broadcast from that address. `status` on an unknown hash reports "not seen" and does not send.
- Merged the Obsidian vault from main. Prism, Style Settings, and realclaudian were left as they were. `workspace.json` is no longer tracked.
- Public name is HowlPay. The previous partner-specific framing is gone from the repo. Display string: `shared/brand.ts`.

## 2026-11-12, afternoon (~17:00 SAST)

- PR #1 merged. The repo is public: https://github.com/MrFriedman/w3node_2026
- Local clone at `~/Documents/w3node_2026`, on `main`, up to date with origin. Node 22.23.5 installed with Homebrew (`node@22`, keg-only) and added to PATH in `~/.zshrc` (`/opt/homebrew/opt/node@22/bin`). `npm install` in `scripts/` and `app/`. Five tests and both typechecks pass.
- Local `.env` (gitignored, mode 600) points at Pimlico USD₮ `0xd077A400968890Eacc75cdc901F0356c943e4fDb`, treasury `0xDB071a2410FCB0B4e0b498953139CF18E009388b`, publicnode Sepolia, and `ZAR_PER_USDT=16.5639`. A separate gitignored `.env.treasury` holds the treasury seed. Do not open, print, or log either file. An earlier unquoted treasury file was deleted before it held funds and a fresh quoted seed was generated.
- Shop test wallet `0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab` was funded from the Google Sepolia ETH faucet and the Pimlico USD₮ faucet. After funding and the top-up it held about 0.05 ETH and about 998.79 USD₮. Hashes are in [[Testnet]].
- End-to-end R20 top-up ran through the script (`npm run wallet -- send --bundle r20 --approve --wait`) and confirmed in block 12118349: `0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`. The treasury received 1.207446 USD₮.
- BuilderBase: [[Project Concept]] and [[Team Status]] saved. [[Technical Foundation]] has the title and the public repo; the demo video URL is still empty. Forms close 21:00 SAST today.
- Expo Approve is still disabled. Next build work is wiring the phone UI so a judge can see a live balance, a real approve, pending and confirmed states, and a reconnect re-check. Then record the video from [[Demo Script]].

## 2026-11-12, evening (~20:36 SAST)

- Conversation with Alan on insurance claims automation and payouts. Notes in [[2026-11-12 Alan - Insurance claims & payouts]]. This is not a build decision.
- Pivot options now on the table, all as uses of the existing USDT rail, not a rewrite: remittances; stokvel; spaza-wholesaler; gig wages; **insurance claims payouts** (new fifth option). Avalanche could appear in a demo for an immutable claims ledger, but Sepolia and Tether WDK remain the built stack unless that changes.

## 2026-11-13, morning (~09:30 SAST)

- Public naming frozen: stay neutral. Describe the incident source as "an existing verified incident-alert feed for Cape Town small shops (partner)".
- Product pivot frozen for v1: verified claim pack plus tracked treasury payout on Sepolia, with a labelled simulated rand leg. Source of truth: [[V1 Build Spec]]. [[Concept]] and the old top-up lead in [[User Flows]], [[Demo Script]], and [[Pitch Outline]] are marked superseded as the Friday demo path.
- [[AGENTS.md]] now points Codex at the v1 spec and restates hard rules (testnet only, no secrets, do not read `.env.treasury`, do not touch `.claudian/` or `_private/`).
- Validation calls continue in parallel ([[Validation Plan]]). They may change Saturday pitch emphasis, not the v1 demo mid-build.

## 2026-11-13, later morning (~09:45 SAST)

- Positioning refined: HowlPay is the single source of truth for the claims process (private pack off-chain, escrow contract on-chain). Buyers are embedded micro-insurance platforms and insurers. Spazas are the beachhead; SMEs and businesses in general are the expansion story. Overhead reduction is a hypothesis to validate on today's calls.
- V1 now includes `contracts/ClaimEscrow.sol` on Sepolia: insurer deposits a USD₮ float, platform opens a claim with only the pack hash, insurer `approveAndRelease` or `reject`. Shared receipt reads events. 17:00 SAST fallback remains a direct treasury transfer. Details in [[V1 Build Spec]].

## 2026-11-13 — Claim escrow

The shop test wallet deployed ClaimEscrow on Sepolia through Tether WDK and acted as owner, claim opener, insurer, and sample payee. The fictional R200 pack reserved 12.074452 test USD₮. The approval released that exact amount back to the shop. See [[Testnet]] for deployment, open, and payout hashes.

The Expo Claim tab loads the sample's events directly from Sepolia. It shows the same receipt for all three demo roles and allows rechecking a submitted hash. Quotes and signing run in the WDK CLI. The demo has no insurer backend and the rand leg is labelled simulated.


## 2026-11-13 — Claims workspace redesign

- Replaced the six-tab wallet shell with Claims and Activity, led by the insurer/claims operator. Platform and Shop remain explicitly labelled demo roles in secondary controls. Earlier checkpoint screens remain in source but are no longer primary navigation.
- Added a fictional case overview, six inspectable evidence entries, an illustrative review/cancel/rejection/signing-handoff walkthrough, and separate test-token settlement and simulated rand delivery. Placeholder attachments are never presented as verified documents. Real signing remains in the WDK CLI.
- Receipt reads now reconcile events, successful event receipts and contract state at a single block, validate the escrow token, distinguish transaction lookup from claim state, and abort stalled RPC calls after 10 seconds per request. Failed refreshes preserve timestamped receipts with an explicit stale notice. Mined evidence is not labelled finalised.
- State survives Claims/Activity navigation in memory. Hashes, FX snapshot and token details are expandable; copy controls use Expo Clipboard. This adds no backend, authentication, private storage, new payment or contract change.
- Verification: app/script typechecks, five existing payment tests, four escrow tests and focused receipt-reader tests. Web/iOS/Android exports succeeded. Browser checks verified live Sepolia settlement, evidence expansion, illustrative cancellation, copy controls, invalid input, rand simulation and state retention across tabs. Inspected 390px and 320px layouts; a final spacing refinement followed.
- Outstanding visual acceptance: final 430px inspection, final spacing recheck, native-device rendering, large system text, software keyboard, VoiceOver/TalkBack and native safe areas. Browser tools became unavailable before final visual sign-off; iOS simulator tooling (`simctl`) was unavailable. Native bundle success is not native visual verification.
- Changes remain uncommitted for review. No private vault directories or wallet secrets were read.

## Ask HowlPay prototype

Shop view opens a dedicated, case-scoped chat. Confirmed fictional intake drafts and sample invoice review are visible in the case. The insurer view generates a brief from those records. The assistant reads settlement status through the existing app and distinguishes test-token settlement from simulated rand. Voice supports an editable sample transcript offline and recording with a configured transcription endpoint. The local assistant service accepts optional model and transcription configuration. Drafts and chat are session-local. Device accessibility checks and claimant usability sessions remain open.
