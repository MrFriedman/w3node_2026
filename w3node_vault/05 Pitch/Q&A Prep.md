---
tags:
  - pitch
  - qa
status: draft
date: 2026-11-12
---

# Q&A prep

**Who holds the key?** The shop. The script reads a seed from the environment for the demo and never prints it. On a phone, the WDK worklet and the device secure store are the next step. They are not wired yet, so the app cannot sign.

**Is this mainnet?** No. Sepolia only. The script checks the chain id and stops on anything else.

**Why is the phone not signing?** The Tether React Native starter also configures mainnet networks and a native worklet. This checkpoint keeps signing in the Node script so the demo cannot hit mainnet by mistake. Wiring Sepolia-only on-device signing is the next build task.

**What if the signal dies after they approve?** The hash is the payment. Reconnect calls `status` on that hash. A second `send` would be a second payment. The app does not store the hash across a restart yet.

**Did a transaction confirm?** Yes. A live R20 top-up from the shop wallet to the platform treasury confirmed on Sepolia in block 12118349: `0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`. Etherscan: https://sepolia.etherscan.io/tx/0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918. More hashes in [[Testnet]].

**Is the FX live?** No. 16.5639 ZAR per USD on 11 Nov 2026, Frankfurter, with 1 USDT treated as 1 USD. A partner would quote a live rate later.

**Where is M-Pesa?** Not integrated. Cash-out is a labelled simulation. The rubric wants mobile-network integration. We show the step and we do not pretend the payout happened.

**What gets verified?** Whatever the partner checks: an incident report, a price, foot traffic later. This repo does not verify data. It pays after the partner says the contribution is good.

**Who pays for gas?** The sender, in Sepolia ETH today. The shop test wallet is funded with a little Sepolia ETH. A shop with USDT and no ETH cannot send. Gas sponsorship is not built.

**Is the demo only local?** No. The script talks to Sepolia and a transfer has confirmed. The UI can still run locally, and a local-only demo caps the technical score near 14, so show the chain check, the confirmed hash, or a live RPC response. Do not describe the Expo shell as a deployed wallet.

**What is the business?** A platform already serving these shops adds USDT so it can charge for credits and pay for data. The relief pool is the next product, not this weekend's build.

**Can the name change?** Yes. `shared/brand.ts`, then `app.json` and the docs.
