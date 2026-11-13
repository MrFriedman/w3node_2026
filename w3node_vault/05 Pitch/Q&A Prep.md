---
tags:
  - pitch
  - qa
status: draft
date: 2026-11-13
---

# Q&A prep

Answers below match the frozen v1: private claim pack plus escrowed payout after a human approval.

**Who is the customer?** Embedded micro-insurance platforms and insurers that already sell cover to spazas and SMEs. Spazas are the beachhead. Other SMEs and businesses in general are the expansion story, because they also carry claims admin.

**What do you actually sell?** A single source of truth for the claims process: a private recovery pack, a contract that records each step and holds the payout, and one shared receipt. The main selling point is less claims-handling overhead and admin, plus faster, complete claims. **That overhead saving is a hypothesis we are validating on today's calls**, not a number we have measured yet.

**Does the contract decide the claim?** No. A human insurer approves or rejects. The contract only records the step and, on approval, enforces payment from the pre-funded float. It cannot pay twice. The legal policy still governs.

**Is this parametric insurance?** No. Same reason: a human decides; the chain pays after that decision.

**Where does the incident data come from?** "An existing verified incident-alert feed for Cape Town small shops (partner)." It is corroboration, not ground truth. The private pack is the source of truth. Only its hash goes on-chain. Do not name a specific partner product.

**Does the shop have to hold or use USDT?** No. The trader sees rand. USDT is the settlement leg in a funder's float. The rand leg in this demo is simulated, via a licensed partner in the real design. That is also how we answer the May 2026 SARB/FSCA scepticism of foreign-pegged stablecoins as domestic payment instruments: the trader does not have to hold USDT; settlement sits between licensed parties; rand goes out through a licensed CASP.

**Why USDT if PayShap is already instant?** USDT is not faster rand. What it can add is a pre-funded obligation that releases on approval, an audit trail of each claim step, and one receipt the insurer, platform, and shop can all check.

**Who holds the key?** The insurer / float signs `approveAndRelease` (in the demo, the shop wallet may play that role). The claimant does not sign to get paid. The script reads a seed from the environment and never prints it. On-device WDK is not wired and is out of scope for v1.

**Is this mainnet?** No. Sepolia only. Scripts check the chain id and stop on anything else.

**What if the signal dies after they approve?** The claim id and tx hash are the receipt. Reconnect re-reads that claim and those events. A second release would be a second payment; the contract reverts a double pay.

**Did a transaction confirm?** A live R20 top-up from the shop to the treasury confirmed on Sepolia in block 12118349: `0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`. Use the escrow deploy and release hashes once they exist ([[Testnet]]). If the 17:00 fallback was used, say so.

**Is the FX live?** No. 16.5639 ZAR per USD on 11 Nov 2026, Frankfurter, with 1 USDT treated as 1 USD.

**Where is the real rand payout?** Not integrated. It is a labelled simulation. We show the step and we do not pretend the off-ramp happened.

**Is the demo only local?** No. The script talks to Sepolia and a transfer has confirmed. A local-only demo caps the technical score near 14, so show the chain check, the contract on Etherscan, or a live RPC response. Do not describe the Expo shell as a deployed wallet.

**Can the name change?** Yes. `shared/brand.ts`, then `app.json` and the docs.
