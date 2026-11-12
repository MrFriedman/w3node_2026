---
tags:
  - pitch
  - qa
status: draft
date: 2026-11-12
---

# Q&A prep

**Who holds the key?** The shop. The script reads a seed from the environment for the demo and never prints it. On a phone, the WDK worklet and the device secure store are the next step. They are not wired, so the app cannot sign.

**Is this mainnet?** No. Sepolia only. The script checks the chain id and stops on anything else.

**Why is the phone not signing?** The Tether React Native starter also configures mainnet networks and a native worklet. This checkpoint keeps signing in the Node script so the demo cannot hit mainnet by mistake.

**What if the signal dies after they approve?** The hash is the payment. Reconnect calls `status` on that hash. A second `send` would be a second payment. The app does not store the hash across a restart yet.

**Did a transaction confirm?** Not in the checkpoint run. The public test address had no ETH and no test USDT, so the script refused to sign. Say that if they ask for a hash.

**Is the FX live?** No. 16.5639 ZAR per USD on 11 Nov 2026, Frankfurter, with 1 USDT treated as 1 USD. A partner would quote a live rate later.

**Where is M-Pesa?** Not integrated. Cash-out is a labelled simulation. The rubric wants mobile-network integration. We show the step and we do not pretend the payout happened.

**What gets verified?** Whatever the partner checks: an incident report, a price, foot traffic later. This repo does not verify data. It pays after the partner says the contribution is good.

**Who pays for gas?** The sender, in Sepolia ETH today. A shop with USDT and no ETH cannot send. Gas sponsorship is not built.

**Is the demo only local?** The UI can run locally. The script talks to Sepolia. A local-only demo caps the technical score near 14, so show the script's chain check and a real RPC response.

**What is the business?** A platform already serving these shops adds USDT so it can charge for credits and pay for data. The relief pool is the next product, not this weekend's build.

**Can the name change?** Yes. `shared/brand.ts`, then `app.json` and the docs.
