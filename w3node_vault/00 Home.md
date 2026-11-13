---
tags:
  - home
status: active
date: 2026-11-13
---

# HowlPay

Working name for the hackathon. The string the app and the wallet script print lives in `shared/brand.ts`.

USDT wallet and payments layer on Tether WDK. **V1 (frozen 13 Nov 2026):** a verified claim pack plus a tracked payout for spaza micro-insurance. An insurer approves a claim; HowlPay pays from a pre-funded USDT treasury float on Sepolia; both sides see the same rand receipt. Rand cash-out is a labelled simulation.

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
- Pitch **Sat 14 Nov**, in person. Demos 09:20–12:55. Awards 14:40.

## Status

As of ~09:30 SAST, Fri 13 Nov 2026.

The v1 build is frozen: claim pack → human approval → treasury USDT payout → shared receipt → simulated rand. Source of truth for Codex: [[V1 Build Spec]]. Public naming stays neutral (see [[Decisions]]). Dylan is making validation calls in parallel ([[Validation Plan]]); those calls may change Saturday pitch emphasis, not the v1 demo mid-build.

PR #1 is merged and the repo is public: https://github.com/MrFriedman/w3node_2026

Local setup is done. A live R20 top-up on Sepolia has confirmed, and the treasury holds gas plus test USD₮ for a payout demo. Addresses and hashes: [[Testnet]]. The Expo app is still a shell; signing is the terminal script. Next: build v1, then record the video from [[Demo Script]] and submit by 23:59 SAST.
