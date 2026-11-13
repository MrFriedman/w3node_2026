# AGENTS.md

Context for anyone working in this repo, including Codex. Deeper working notes live in the Obsidian vault at `w3node_vault/`. Start at `w3node_vault/00 Home.md`. For the v1 build, follow `w3node_vault/02 Product/V1 Build Spec.md`.

## Project

HowlPay is a USDT wallet and payments layer on Tether WDK, built for the W3Node Node Engine hackathon (Cape Town, 12–14 Nov 2026), Mobile Money & Peer-to-Peer track sponsored by Tether.

**V1 is frozen (13 Nov 2026):** a verified claim pack plus a tracked payout for spaza micro-insurance. A shop has a claim pack after a riot, theft, or fire. A human insurer (or embedded insurance platform) approves the amount. HowlPay pays that amount from a pre-funded USDT treasury float on Sepolia. Both sides see the same receipt (tx hash, amount in rand, status). Rand cash-out is a labelled simulation. The incident source is described as "an existing verified incident-alert feed for Cape Town small shops (partner)".

Earlier checkpoint work (service-credit top-ups and data-contribution rewards) is still in the repo and is proven on Sepolia. It is not the v1 demo path.

The display name lives in `shared/brand.ts`. Public repo: https://github.com/MrFriedman/w3node_2026

Judging is 90 points: Product 30, Technical 30, Business 30. A local-only demo caps the technical score around 14, so keep Sepolia evidence in the demo. Final submission is **Fri 13 Nov 2026, 23:59 SAST**.

## Repo layout

```
app/                  Expo SDK 58 UI. Typechecks. On-device Approve is still disabled.
docs/architecture.md  Earlier architecture (top-up and reward sequences)
docs/architecture.png Diagram
scripts/wallet.ts     Sepolia WDK wallet CLI: address, balance, quote, send, status
scripts/fund-treasury.ts  Sepolia-only helper used to fund the treasury. Quote first; signs only with --approve.
scripts/test/         Five tests (`npm test` in scripts/)
shared/               Money helpers, address checks, approve/cancel, product name
w3node_vault/         Obsidian working notes. Read V1 Build Spec before changing product or pitch wording.
.env.example          Testnet env template. Real values stay in gitignored `.env`
AGENTS.md             This file
```

Do not touch `w3node_vault/.claudian/`, `w3node_vault/_private/`, or `w3node_vault/.obsidian/workspace*.json`. Do not read, edit, or commit the private folder. Tracked notes are enough.

## Setup

Node.js 22 or newer. On this machine, Homebrew `node@22` is keg-only; keep `/opt/homebrew/opt/node@22/bin` on PATH (already in `~/.zshrc`).

```bash
cd scripts && npm install && npm test && npm run typecheck
cd ../app && npm install && npm run typecheck
```

Copy `.env.example` to `.env` at the repo root if one is missing. `.env` and `.env.treasury` are gitignored and should stay mode 600. `dotenv` does not override variables already set in the environment.

This machine's `.env` is already pointed at:

- `EVM_TOKEN_CONTRACT=0xd077A400968890Eacc75cdc901F0356c943e4fDb` (Pimlico USD₮ on Sepolia, 6 decimals)
- `PLATFORM_TREASURY_ADDRESS=0xDB071a2410FCB0B4e0b498953139CF18E009388b`
- `ZAR_PER_USDT=16.5639`
- publicnode Sepolia RPC

Shop test wallet: `0x55306B77Fb0A34f1253F3c78Ac734a9dBC5FFfab`. Live addresses, balances, and transaction hashes: `w3node_vault/03 Build/Testnet.md`.

Treasury balances last checked on chain at 22:16 SAST, Thu 12 Nov 2026: **0.02 ETH** and **201.207446 USD₮**. Re-check before a live payout.

## Commands

From `scripts/`:

```bash
npm test
npm run typecheck
npm run wallet -- address
npm run wallet -- balance
npm run wallet -- quote --bundle r20
npm run wallet -- quote --to 0x... --usdt 1
npm run wallet -- send --to 0x... --usdt 1 --approve --wait
npm run wallet -- send --bundle r20 --cancel
npm run wallet -- status --hash 0x...
```

`--bundle` pays `PLATFORM_TREASURY_ADDRESS` unless `--to` is set. For the v1 claim payout, use `--to` with the shop address (treasury is the sender). `send` signs only with `--approve` (or the word `approve` typed in a terminal). Blank or `--cancel` writes nothing. `--wait` waits for confirmation. `status` only reads a hash; it never sends.

A confirmed R20 top-up (shop → treasury) already exists as fallback evidence. Re-check it instead of sending again unless you mean to spend. Do not present it as the v1 claim payout.

```bash
npm run wallet -- status --hash 0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918
```

From `app/`:

```bash
npm run typecheck
npx expo start
```

On-device Approve is disabled until on-device WDK is wired. That wiring is out of scope for v1.

## Payment flow

Every USDT movement follows Tether's five steps:

1. Validate the address, the network, and the token.
2. Check the balance and quote the fee.
3. Show the recipient, the amount, the fee, and the network, then approve or cancel.
4. Sign and submit.
5. Read the receipt and stay pending until confirmed.

Reconnect repeats step 5 on the same hash. A second `send` is a second payment.

## Conventions

- TypeScript. Keep shared money, pack, and approval logic in `shared/` so the script and the app stay in sync.
- The script must keep refusing any chain id other than Sepolia `11155111`, and any token that is not 6 decimals.
- The v1 rand leg stays labelled `SIMULATED` until a real licensed off-ramp is wired.
- Rename the product only in `shared/brand.ts`, then match `app/app.json` and the docs.
- Disclose reused third-party code. Only work since 3 Nov 2026 counts for the hackathon.
- **Public naming stays neutral.** Describe the incident source as "an existing verified incident-alert feed for Cape Town small shops (partner)". Do not name a specific partner product, website, bot handle, or township in code, docs, commits, the pitch, or the video. HowlPay is fine.
- Prefer updating `w3node_vault/` notes when the build state changes, especially `03 Build/Build Log.md`, `03 Build/Tasks.md`, and `03 Build/Testnet.md`.

## Current state (Fri 13 Nov 2026, ~09:30 SAST)

- PR #1 is merged. The repo is public. V1 product direction is frozen; see `w3node_vault/02 Product/V1 Build Spec.md`.
- Local setup is done: Node 22, installs, five tests, and both typechecks pass.
- A live R20 top-up confirmed on Sepolia in block 12118349: `0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`.
- Treasury funded on Sepolia at 22:16 SAST, 12 Nov: 0.02 ETH (`0xd06514d9944eae05e2583099f27957394ceb802efb8ec8584d8c2b13f31801bd`) and 200 USD₮ (`0x8e60bd1716f6b7aee107fac8584218bacbd49f12025a0622ebcff124247c46f6`). After that fund it held 0.02 ETH and 201.207446 USD₮.
- Expo on-device Approve is still disabled. Cash-out / rand payout is still simulated.
- Final submission is **Fri 13 Nov 2026, 23:59 SAST**. Pitch is **Sat 14 Nov**, 5 minutes plus 3 minutes of Q&A, 2–3 slides.

## Prioritised next tasks

1. **Build v1 from `w3node_vault/02 Product/V1 Build Spec.md`.** Claim pack, insurer approve, five-step treasury → shop payout, shared receipt, simulated rand. About 8 hours. Sepolia only. Seeds stay off the screen and out of git.
2. Record a demo video of at most 3 minutes from `w3node_vault/05 Pitch/Demo Script.md` (the v1 section). Do not fake a receipt.
3. 2–3 slides from `w3node_vault/05 Pitch/Pitch Outline.md`.
4. Final BuilderBase packet by Fri 13 Nov 23:59 SAST: title, public repo, video.
5. Leave honest gaps for later: on-device signing, a real claims backend, a live off-ramp, persist the hash across an app restart, recovery-fund payouts.

## Hard rules

- Sepolia testnet only. Do not add mainnet networks, mainnet RPCs, or mainnet token contracts. The wallet script must keep refusing any chain id other than `11155111`.
- Never commit, print, or log seed phrases, private keys, or the contents of `.env` or `.env.treasury`.
- Never read `.env.treasury`. Do not open it in an editor, `cat` it, or dump it into tool output. If a live treasury payout needs that wallet, stop and ask Dylan to load it.
- Do not commit `.env`, `.env.treasury`, or any file that contains a seed.
- Do not show a seed or a filled-in env file in the UI, the video, or a screenshot.
- Do not read, edit, or commit `w3node_vault/_private/` or touch `w3node_vault/.claudian/`.
- Public naming stays neutral, as under Conventions above.
- Disclose reused code. Only work since 3 Nov 2026 counts.
