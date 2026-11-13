---
tags:
  - home
status: active
date: 2026-11-13
---

# HowlPay

Working name for the hackathon. The string the app and the wallet script print lives in `shared/brand.ts`.

HowlPay is the **single source of truth for the claims process**: a private incident record plus a recovery pack, and a Sepolia escrow contract that records each step and holds then releases the USDT payout after a human approves. Buyers are embedded micro-insurance platforms and insurers. Spazas are the beachhead; SMEs and businesses in general are the expansion story. The main selling point is less claims-handling overhead and admin (a hypothesis to validate today), plus faster, complete claims with one shared receipt. The rand leg is a labelled simulation.

## Map

- Brief: [[Event & Track]] · [[Judging Rubric]] · [[Deadlines]] · [[Rules]]
- Product: [[V1 Build Spec]] · [[Pivot Decision]] · [[Validation Plan]] · [[Decisions]] · [[Concept]] (superseded as the lead story) · [[User Flows]]
- Build: [[Architecture]] · [[Build Log]] · [[Tasks]] · [[Testnet]]
- Checkpoints: [[Project Concept]] · [[Technical Foundation]] · [[Team Status]]
- Pitch: [[Pitch Outline]] · [[Demo Script]] · [[Q&A Prep]]
- Submission: [[Checklist]]
- Meetings: [[2026-11-12 Alan - Insurance claims & payouts]]

## Deadlines

- Checkpoint forms closed **Thu 12 Nov 2026, 21:00 SAST**.
- Final submission **Fri 13 Nov 2026, 23:59 SAST** on BuilderBase (title, public repo, demo video).
- Contract demo gate **Fri 13 Nov, ~17:00 SAST**: if `ClaimEscrow` is not deployed and callable, use the direct-transfer fallback.
- Pitch **Sat 14 Nov**, in person. Demos 09:20–12:55. Awards 14:40.

## Status

As of ~09:45 SAST, Fri 13 Nov 2026.

The v1 build is frozen and then refined: private claim pack → open on the escrow contract → human approval → `approveAndRelease` → shared receipt from events → simulated rand. Source of truth for Codex: [[V1 Build Spec]]. Public naming stays neutral (see [[Decisions]]). Dylan is making validation calls in parallel ([[Validation Plan]]); those calls may change Saturday pitch emphasis, not the v1 demo mid-build.

PR #1 is merged and the repo is public: https://github.com/MrFriedman/w3node_2026

Local setup is done. A live R20 top-up on Sepolia has confirmed, and the shop and treasury wallets are funded. Addresses and hashes: [[Testnet]]. The Expo app is still a shell; signing is the terminal script. Next: Codex builds v1 from the spec, then record the video from [[Demo Script]] and submit by 23:59 SAST.
