---
tags:
  - build
  - tasks
status: active
date: 2026-11-13
---

# Tasks

Ship the final BuilderBase packet by **Fri 13 Nov, 23:59 SAST**. Codex should follow [[V1 Build Spec]] in the order given there. Later items stay honest in the demo. Do not imply they work.

## Now — v1 claims-payout build (today)

- [ ] **Build v1** from [[V1 Build Spec]], in that task order: `ClaimEscrow` (tests, Sepolia deploy), scripts, Expo walkthrough, event-based receipt, labelled simulated rand. Sepolia only. Keep seeds out of git and off the screen. Do not open `.env.treasury`. Use the shop key from `.env` through the existing loader for deploy and contract calls, and never print it.
- [ ] **17:00 SAST gate:** if the contract is not deployed and callable, switch the demo payout to the direct treasury → shop transfer and still show the tested contract.
- [ ] Record a demo video, at most 3 minutes, from the v1 section of [[Demo Script]]. Label every simulated part. Cmd+Shift+5 is enough.
- [ ] Upload the video to YouTube or Drive, paste the URL into BuilderBase, and submit the final packet (title HowlPay, public repo, video) by **23:59 SAST**. Do not fake a receipt.

A confirmed shop→treasury R20 top-up already exists as *fallback* evidence if a new payout cannot be sent in time. Label it honestly as a top-up, not as this claim payout.

## Claims workspace verification (13 Nov)

- [x] Claims/operator-first navigation, inspectable fictional evidence and separate illustrative decision walkthrough.
- [x] Existing Sepolia escrow receipt verified in the browser; shared state survives tab navigation.
- [x] Explicit test-token settlement versus simulated rand; technical details and copy controls.
- [x] Receipt state/error tests and web/iOS/Android bundle checks.
- [ ] Final 320/390/430px visual pass after the spacing refinement.
- [ ] Native-device pass: large text, software keyboard, screen reader and safe areas. No simulator tooling available during implementation.

## Friday submission

- [x] Public GitHub repo: https://github.com/MrFriedman/w3node_2026. README is the HowlPay one. No secrets in git.
- [x] Live Sepolia evidence: funded shop wallet, funded treasury (0.02 ETH and 201.207446 USD₮ at the 12 Nov 22:16 SAST check), and a confirmed R20 top-up. See [[Testnet]]. Append the escrow address here once deployed.
- [x] [[Project Concept]] and [[Team Status]] saved on BuilderBase. Checkpoint forms closed Thu 21:00 SAST.
- [x] `docs/architecture.png` is in the repo if the form wants a diagram.
- [ ] 2–3 slides from [[Pitch Outline]] (v1 claims-payout outline).
- [ ] Final BuilderBase packet: title HowlPay, public repo, video link, by **Fri 13 Nov, 23:59 SAST**.

## Superseded as the lead build (12 Nov)

These were the Thursday plan. They are not the v1 demo path.

- [ ] ~~Wire the Expo UI as a live R20 *top-up* (shop → treasury) with on-device signing.~~ Out of scope for v1. Signing stays in scripts. The top-up script path is already proven.
- [ ] ~~Submit a demo video into Technical Foundation before Thu 21:00 SAST.~~ That checkpoint window has closed. The video is now part of the Friday 23:59 packet.

## Still open after the video

Real gaps. Mention them if asked. Do not build them into the Friday story as done.

- [ ] Persist the last transaction hash on the device.
- [ ] A real claims or partner backend. This repo does not decide claims.
- [ ] A live licensed off-ramp to rand. Today's rand leg is simulated.
- [ ] On-device WDK signing, Sepolia only.
- [ ] Recovery-fund or relief-pool payouts on the same rail (second channel, not v1).

## Approved theft UX and landing-page pass (13 Nov, later)

- [x] Responsive landing page with working entry CTAs and honest broker value hypothesis.
- [x] Shop-first Claim / Requests / Progress, contextual assistant, separate historical receipt.
- [x] Police-reference request/clarification/acceptance, readiness gates, immutable submission versions, edit invalidation, illustrative insurer decisions.
- [x] Session reset; fiction, submission, payment and fiat simulation boundaries.
- [x] Logic/contract tests, both typechecks, browser responsive workflow and assistant transport checks (see UI UX Audit).
- [ ] Physical native device, native keyboard/text scaling, VoiceOver/TalkBack checks.
- [ ] Real shopkeeper/broker usability sessions; validate repeated-request and handling-cost hypotheses.
- [ ] Record the revised three-minute demo using real read-only historical evidence, never browser test fixtures.
