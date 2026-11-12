---
tags:
  - build
  - tasks
status: active
date: 2026-11-12
---

# Tasks

Ship by **Fri 13 Nov, 23:59 SAST**. Later items stay honest in the demo. Do not imply they work.

## Friday

- [ ] Public README is the HowlPay one. No secrets in git.
- [ ] Record the 3-minute video from [[Demo Script]]. One shop, one payment from review toward a receipt, one failure and a recovery, simulated cash-out labelled.
- [ ] If a faucet funds the test wallet before the video, show `send --approve` and then `status` on that hash. If it does not, show the balance stop and a hash re-check. Do not fake a receipt.
- [ ] 2–3 slides from [[Pitch Outline]].
- [ ] BuilderBase: title HowlPay, public repo, video link. Paste [[Project Concept]], [[Technical Foundation]], and [[Team Status]] if those fields are still open.
- [ ] Upload `docs/architecture.png` if the checkpoint form asks for a diagram.

## Still open after the video

These are real gaps. Mention them if asked. Do not build them into the Friday story as done.

- [ ] Wire `@tetherto/wdk-react-native-core` for Sepolia only. Keep the seed on the device. Leave mainnet networks out.
- [ ] Persist the last transaction hash on the device. The script already re-checks a hash you pass.
- [ ] Record service credits in the partner backend only after a confirmed receipt.
- [ ] Run the treasury script when the partner marks a contribution verified.
- [ ] Replace the simulated cash-out with a mobile-money partner, still behind approve.
- [ ] Community relief pool: shops pool USDT and get an automatic payout on a verified incident, same five-step flow.
