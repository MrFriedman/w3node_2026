---
tags:
  - build
  - log
status: active
date: 2026-11-12
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
