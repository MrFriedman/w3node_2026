---
tags:
  - pitch
  - qa
status: draft
date: 2026-11-13
---

# Q&A prep

Answers below match the frozen v1: claim pack plus tracked payout. Older credit-and-reward answers are noted only where they still apply as checkpoint evidence.

**Who holds the key?** For a claim payout, the treasury signs. The shop does not sign to get paid. The script reads a seed from the environment for the demo and never prints it. On-device WDK is not wired and is out of scope for v1.

**Is this mainnet?** No. Sepolia only. The script checks the chain id and stops on anything else.

**Is this parametric insurance?** No. A human approves the claim. The transfer is payout automation with a shared receipt.

**Where does the incident data come from?** "An existing verified incident-alert feed for Cape Town small shops (partner)." It is corroboration, not ground truth. Do not name a specific partner product.

**Why USDT if PayShap is already instant?** USDT is not faster rand. What it can add is one receipt the insurer, platform, and shop can all check, plus a pre-funded float that releases on approval. The trader sees rand through a licensed partner. The rand leg in this demo is simulated.

**Is this legal for domestic payments?** The May 2026 SARB/FSCA communication is sceptical of foreign-pegged stablecoins as domestic payment instruments. The mitigation is: the trader does not have to hold USDT; settlement sits between licensed parties; rand goes out through a licensed CASP. Have that answer ready.

**What if the signal dies after they approve?** The hash is the payment. Reconnect calls `status` on that hash. A second `send` would be a second payment. The app does not store the hash across a restart yet.

**Did a transaction confirm?** Yes, a live R20 top-up from the shop to the treasury confirmed on Sepolia in block 12118349: `0x946a27d941c971b01ff40951b4c7f30f57c650c556a8e0786c1b41f36db4a918`. The treasury was then funded with gas and test USD₮ so it can pay a claim. If a new treasury → shop payout confirms today, use that hash in the pitch. More hashes in [[Testnet]].

**Is the FX live?** No. 16.5639 ZAR per USD on 11 Nov 2026, Frankfurter, with 1 USDT treated as 1 USD.

**Where is the real rand payout?** Not integrated. It is a labelled simulation. We show the step and we do not pretend the off-ramp happened.

**Who pays for gas?** The sender. For v1 that is the treasury, which holds Sepolia ETH for the demo. Gas sponsorship is not built.

**Is the demo only local?** No. The script talks to Sepolia and a transfer has confirmed. A local-only demo caps the technical score near 14, so show the chain check, a confirmed hash, or a live RPC response. Do not describe the Expo shell as a deployed wallet.

**What is the business?** Embedded micro-insurers that already sell riot cover to spazas. Price is a hypothesis: a fee per completed claim pack plus payout. Recovery funds are a second channel on the same rail. Validation calls are in progress; quote only what those calls actually confirm.

**Can the name change?** Yes. `shared/brand.ts`, then `app.json` and the docs.
