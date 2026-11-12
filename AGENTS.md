# AGENTS.md

Context for anyone working in this repo, including Codex. Deeper working notes live in the Obsidian vault at `w3node_vault/`. Start at `w3node_vault/00 Home.md`.

## Project

HowlPay is a USDT wallet and payments layer on Tether WDK, built for the W3Node Node Engine hackathon (Cape Town, 12–14 Nov 2026), Mobile Money & Peer-to-Peer track sponsored by Tether.

A platform that serves informal traders can open a USDT wallet per shop. The shop pays for service credits (rand and USDT shown before approve). When the platform verifies data the shop contributed, a treasury wallet sends a small USDT reward. Payments stay pending until confirmed, and a reconnect re-checks the same hash so nobody pays twice. Mobile-money cash-out is a labelled simulation.

The display name lives in `shared/brand.ts`. Public repo: https://github.com/MrFriedman/w3node_2026

Judging is 90 points: Product 30, Technical 30, Business 30. A local-only demo caps the technical score around 14, so keep Sepolia evidence in the demo.

## Repo layout

```
app/                  Expo SDK 58 shop UI. Typechecks. Approve is still disabled.
docs/architecture.md  Architecture, top-up sequence, reward sequence
docs/architecture.png Diagram
scripts/wallet.ts     Sepolia WDK wallet CLI: address, balance, quote, send, status
scripts/test/         Five tests (`npm test` in scripts/)
shared/               Credit packs, USDT rounding, address checks, approve/cancel, product name
w3node_vault/         Obsidian working notes. Read these before changing product or pitch wording.
.env.example          Testnet env template. Real values stay in gitignored `.env`
AGENTS.md             This file
```

Do not touch `w3node_vault/.claudian/` or `w3node_vault/.obsidian/workspace*.json`.

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

## Commands

From `scripts/`:

```bash
npm test
npm run typecheck
npm run wallet -- address
npm run wallet -- balance
npm run wallet -- quote --bundle r20
npm run wallet -- quote --to 0x... --usdt 1
npm run wallet -- send --bundle r20 --approve --wait
npm run wallet -- send --bundle r20 --cancel
npm run wallet -- status --hash 0x...
```

`--bundle` pays `PLATFORM_TREASURY_ADDRESS` unless `--to` is set. Bundles: `r20`, `r40`, `r80`, `r150`, `r300`. `send` signs only with `--approve` (or the word `approve` typed in a terminal). Blank or `--cancel` writes nothing. `--wait` waits for confirmation. `status` only reads a hash; it never sends.

A confirmed R20 top-up already exists. Re-check it instead of sending again unless you mean to spend:

```bash
npm run wallet -- status --hash 0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918
```

From `app/`:

```bash
npm run typecheck
npx expo start
```

Approve in the Expo shell is disabled until on-device WDK is wired.

## Payment flow

Every USDT movement follows Tether's five steps:

1. Validate the address, the network, and the token.
2. Check the balance and quote the fee.
3. Show the recipient, the amount, the fee, and the network, then approve or cancel.
4. Sign and submit.
5. Read the receipt and stay pending until confirmed.

Reconnect repeats step 5 on the same hash. A second `send` is a second payment. Credits are recorded by a partner backend only after confirmation; that backend is not in this repo.

## Conventions

- TypeScript. Keep shared money, pack, and approval logic in `shared/` so the script and the app stay in sync.
- The script must keep refusing any chain id other than Sepolia `11155111`, and any token that is not 6 decimals.
- Cash-out stays labelled `SIMULATED` until a real mobile-money partner is wired.
- Rename the product only in `shared/brand.ts`, then match `app/app.json` and the docs.
- Disclose reused third-party code. Only work since 3 Nov 2026 counts for the hackathon. The README already names WDK, the React Native starter (not vendored), the Expo template, and the Frankfurter FX snapshot.
- Public framing stays general: platforms that serve informal traders and spaza shops. Do not name a specific partner product, website, bot handle, or township in code, docs, commits, the pitch, or the video.
- Prefer updating `w3node_vault/` notes when the build state changes, especially `03 Build/Build Log.md`, `03 Build/Tasks.md`, and `03 Build/Testnet.md`.

## Current state (Thu 12 Nov 2026, ~17:00 SAST)

- PR #1 is merged. The repo is public.
- Local setup is done: Node 22, installs, five tests, and both typechecks pass.
- A live R20 top-up confirmed on Sepolia in block 12118349: `0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`. The treasury received 1.207446 USD₮. The shop wallet held about 0.05 ETH and about 998.79 USD₮ at this snapshot.
- BuilderBase: Project Concept and Team Status are saved. Technical Foundation has the title and the repo. The demo video URL is still empty. Checkpoint forms close **today at 21:00 SAST**.
- Expo Approve is still disabled. Cash-out is still simulated.
- Final submission is **Fri 13 Nov 2026, 23:59 SAST**. Pitch is **Sat 14 Nov**, 5 minutes plus 3 minutes of Q&A, 2–3 slides.

## Prioritised next tasks

1. **Wire the Expo UI first.** Live shop balance from Sepolia. A real Approve that signs an R20 top-up through the five-step flow to the treasury. Pending and confirmed states. Re-check the same hash on reconnect. Keep this Sepolia-only, and keep seeds off the screen and out of git. Use the Pimlico USD₮ contract and treasury address above.
2. Record a demo video of at most 3 minutes (diagram, `npm test`, quote or send plus `status --hash`, Expo app). Paste the link into Technical Foundation and submit before 21:00 SAST today. If the UI work overruns, the video can show the script path and re-check the confirmed hash. Do not fake a receipt.
3. 2–3 slides from `w3node_vault/05 Pitch/Pitch Outline.md`.
4. Final BuilderBase packet by Fri 13 Nov 23:59 SAST: title, public repo, video.
5. Leave honest gaps for later: persist the hash across an app restart, partner ledger, treasury reward listener, real cash-out, community relief pool.

## Hard rules

- Sepolia testnet only. Do not add mainnet networks, mainnet RPCs, or mainnet token contracts. The wallet script must keep refusing any chain id other than `11155111`.
- Never commit, print, or log seed phrases, private keys, or the contents of `.env` or `.env.treasury`.
- Never read `.env.treasury`. Do not open it in an editor, `cat` it, or dump it into tool output.
- Do not commit `.env`, `.env.treasury`, or any file that contains a seed.
- Do not show a seed or a filled-in env file in the UI, the video, or a screenshot.
- Public framing stays neutral, as under Conventions above.
- Disclose reused code. Only work since 3 Nov 2026 counts.
