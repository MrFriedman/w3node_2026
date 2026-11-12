---
tags:
  - build
  - log
status: active
date: 2026-11-12
---

# Build log

## 2026-11-12

- Checkpoint foundation: Sepolia wallet script, Expo shell, architecture diagram, README.
- `npm test` and `npm run typecheck` pass in `scripts/`. The app typechecks, and Metro produced an Android bundle.
- Against Sepolia, the public BIP-39 test address `0x9858EfFD232B4033E47d90003D41EC34EcaEda94` has 0 ETH and 0 Test Tether USD. `quote` and `send` stop before a signature. No transaction was broadcast. `status` on an unknown hash reports "not seen" and does not send.
- Merged the Obsidian vault from main. Prism, Style Settings, and realclaudian were left as they were. `workspace.json` is no longer tracked.
- Public name is HowlPay. The previous partner-specific framing is gone from the repo. Display string: `shared/brand.ts`.
