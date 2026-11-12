---
tags:
  - build
  - tasks
status: active
date: 2026-11-12
---

# Tasks

Ship the final BuilderBase packet by **Fri 13 Nov, 23:59 SAST**. Checkpoint forms close **today, Thu 12 Nov, 21:00 SAST**. Later items stay honest in the demo. Do not imply they work.

## Now — Technical Foundation (today 21:00 SAST)

The form already has the title HowlPay and the public repo. The demo video URL is still empty.

- [ ] **Build first:** wire the Expo UI so the video is stronger: live shop balance, a real Approve that signs an R20 top-up through the five-step flow, pending and confirmed states, and a re-check of the same hash on reconnect. Sepolia only. Keep seeds out of git and off the screen. Token and treasury are in [[Testnet]].
- [ ] Record a demo video, at most 3 minutes, from [[Demo Script]]. One shop, one payment from review to a receipt, one failure and a recovery, simulated cash-out labelled. Cmd+Shift+5 is enough. Suggested shots: the architecture diagram, `npm test`, a live or re-checked transfer, and the Expo app.
- [ ] Upload the video to YouTube or Drive, paste the URL into [[Technical Foundation]] on BuilderBase, and submit before 21:00 SAST. Do not fake a receipt.

A confirmed hash already exists if the UI work overruns the clock and the video has to show the script path plus a re-check. Do not send a second transfer just for the camera unless you mean to.

## Friday submission

- [x] Public GitHub repo: https://github.com/MrFriedman/w3node_2026. README is the HowlPay one. No secrets in git.
- [x] Live Sepolia evidence: funded shop wallet and a confirmed R20 top-up. See [[Testnet]].
- [x] [[Project Concept]] and [[Team Status]] saved on BuilderBase.
- [x] `docs/architecture.png` is in the repo if the form wants a diagram.
- [ ] 2–3 slides from [[Pitch Outline]].
- [ ] Final BuilderBase packet: title HowlPay, public repo, video link, by **Fri 13 Nov, 23:59 SAST**.

## Still open after the video

These are real gaps. Mention them if asked. Do not build them into the Friday story as done.

- [ ] Persist the last transaction hash on the device. The script already re-checks a hash you pass. The Expo wiring above should at least re-check on reconnect while the app stays open.
- [ ] Record service credits in the partner backend only after a confirmed receipt.
- [ ] Run the treasury script when the partner marks a contribution verified. Do not open `.env.treasury` in an editor or log it.
- [ ] Replace the simulated cash-out with a mobile-money partner, still behind approve.
- [ ] Community relief pool: shops pool USDT and get an automatic payout on a verified incident, same five-step flow.
