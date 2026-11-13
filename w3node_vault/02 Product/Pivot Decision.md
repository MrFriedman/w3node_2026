---
tags:
  - product
  - decision
date: 2026-11-12
status: recommended, not yet frozen (freeze after Friday calls)
---

# Pivot Decision

Back to [[00 Home]] · [[Decisions]] · [[2026-11-12 Alan - Insurance claims & payouts]] · [[Validation Plan]]

Written Thu 12 Nov 2026, ~22:00 SAST. It picks up the Codex research thread and checks it against real sources. Every number below has a link. Where I had to make a judgement call, it says so. Partner and personal contact details are kept private; this public copy is redacted.

## Recommendation (one paragraph)

**Freeze this: "verified claim pack plus tracked payout" for spaza micro-insurance.** A shop owner (or the partner alert platform, for them) builds a claim pack after a riot, theft or fire. It has the time-stamped, human-verified incident record from a verified unrest-alert signal, photos, and stock invoices. The insurer or the embedded insurance platform decides on the claim, and a human approves it. HowlPay then pays the approved amount from a pre-funded USDT float to the shop. Both sides see the same receipt (tx hash, amount in rand, status). Rand goes out through a licensed off-ramp. The **first customer is the embedded micro-insurance distributors that already sell riot cover to spazas** (Vuleka/Hollard, Shop2Shop, Santam's emerging-business product, A2Pay). Commercial brokers come second. **Recovery-fund payouts to uninsured traders are the second channel on the same rail.**

## Where I agree with Codex, and where I'd change it

Agree:
- Lead with claims evidence and status, not "blockchain insurance".
- An approval-triggered release is **payout automation, not parametric insurance**. Alan's summary called it "parametric". Don't use that word on stage.
- Oracle problem: the ledger records *who attested what, and when*. It does not record what actually happened.
- Freeze the customer and the problem for 48h, then validate by phone.

Change:
1. **Codex's first customer, commercial brokers handling property claims for small shops, mostly serves the formal, insured minority.** Only 18% of SA MSMEs have business insurance ([FinScope MSME 2024](https://finmark.org.za/Publications/FS_MSME_2024_results_launch.pdf)). Earlier field interviews found shop owners with no insurance. The insurers that actually reach spazas are the **embedded micro-insurance platforms**, so they should be the first customer. Brokers are still worth calling on Friday: they're in Cape Town, they pick up, and they know the claims workflow.
2. **A strong competitor already exists and Codex didn't name it.** [Vuleka Insure](https://insure.vuleka.com/) (underwritten by Hollard) sells R199/month stock cover on WhatsApp. Owners photograph their invoices to set the cover, and approved claims are paid as a stock voucher "within 48h". The exception is **"SASRIA claims, where we cannot guarantee the 48 hour turnaround"**. So the evidence-upload part is not new. What could set this apart is **a verified unrest-alert signal: independent proof that a riot or unrest peril happened near this shop at this time**, which is exactly the claim type Vuleka says is slow. That's a hypothesis to test, not a fact.
3. **USDT is weaker than the pitch implies for domestic payouts** (see Risks). Position it as the settlement and receipt layer between licensed parties. The trader sees rand.

## The seminar case study (seminar9-blockchain), assessed

Source: `MrFriedman/seminar9-blockchain` (`cursor/INF4026F_Group9_Complete_Script.md`, `sem9-vault/02 - Thematic Notes/Blockchain in the Insurance Sector.md`).

The case is **"ABC Insurance"**, a SA short-term insurer's buildings-claims division (R150m claims spend by end-2015, cited as Cupido & Van Belle, 2017). The story is Nokwanda's burst geyser:
- 9 disconnected SMS and email updates;
- the supplier arrives without knowing what she was told;
- the supplier gets paid 48h after the job is done;
- suppliers sometimes fill in the customer's satisfaction rating themselves;
- the system is a JD Edwards batch-sync mainframe.

What carries over to the pivot:
- **Fragmented status and multi-party handoffs.** This is the same pain as "where is my claim?"
- **Who gets to write the record.** The policyholder submits the rating, and nobody can edit it afterwards. Same idea as a shop-submitted evidence pack whose hash is fixed at submission.
- **Design constraints the seminar got right:**
  - keep personal data off-chain and store only hashes (POPIA);
  - offer a human-review path for automated decisions (the seminar cites POPIA s71);
  - support USSD or WhatsApp and many languages;
  - plan for load-shedding.

What does **not** carry over, and shouldn't go in a pitch as evidence:
- **R22.5m/year "avoidable cost"** is an *assumed* 15% leakage on R150m, not a measured figure.
- **"48 hours to 2.5 minutes"** (Ganesan et al., 2025) is the speed of a permissioned-chain confirmation. It isn't end-to-end claim time, and assessment and repair still take days.
- **"98% fraud detection"** is an ML model accuracy figure from another paper (Bhamidipati et al., 2021), not something this design would deliver.
- The case is about **insurer-to-repair-supplier payments for formal buildings cover**. That's a different customer from an informal spaza owner.
- I haven't checked the seminar's citations against the original papers. Quote them as "literature reports…" if at all.

## Scored comparison

Scores are my judgement, 1 to 5, where 5 is best. The three judge columns stand for the Product/Technical/Business areas (30% each). Evidence = how much sourced proof exists today (from this note). Feasible = can be shown with the existing wallet code by Fri 13 Nov 23:59.

| Option | Product | Technical | Business | Evidence | Web3/USDT fit | Feasible by Fri | Partner fit | Total /35 |
|---|---|---|---|---|---|---|---|---|
| **A. Spaza micro-insurance claim pack + tracked payout** (recommended) | 4 | 3 | 4 | 4 | 3 | 4 | 5 | **27** |
| C. Recovery-fund payouts to uninsured traders | 4 | 3 | 2 | 4 | 4 | 4 | 4 | 25 |
| D. Cross-border remittances | 4 | 3 | 3 | 3* | 5 | 4 | 1 | 23 |
| B. Codex: claims evidence via commercial brokers | 3 | 2 | 3 | 3 | 2 | 4 | 3 | 20 |
| F. Spaza-to-wholesaler payments | 3 | 3 | 3 | 2* | 3 | 4 | 2 | 20 |
| G. Instant gig/day wages | 3 | 3 | 3 | 2* | 3 | 4 | 1 | 19 |
| E. Digital stokvel | 3 | 3 | 3 | 2* | 3 | 3 | 1 | 18 |

\* I didn't research these this turn, so their evidence score is low because nothing has been gathered yet, not because the idea is weak. If Dylan only cared about winning the Tether track, **D (remittances) is the cleanest USDT story**. It just has nothing to do with the existing alert-platform work.

Why A beats C as the *lead*: C has a strong inclusion story but a weak payer. Government relief is episodic and runs through PFMA procurement, as the DSBD itself notes ([PMG](https://pmg.org.za/committee-meeting/33458/)). A has a recurring payer, insurers paying per claim, and that matches the partner platform's existing "insurers pay too" model. C becomes slide-3 upside on the same rail.

## Evidence (sourced)

**Problem size and the insurance gap**
- 82% of SA MSMEs have no business insurance, and FinScope counts 1.70m informal MSMEs ([FinScope MSME 2024](https://finmark.org.za/Publications/FS_MSME_2024_results_launch.pdf)). Santam Broker Solutions quotes the same 18% figure ([FAnews](https://www.fanews.co.za/article/smmes/1399/general/1400/three-reasons-why-insurance-is-critical-to-small-business-survival-in-a-high-risk-economy/41747)).
- The same FAnews piece cites NPC BeyondCOVID research: over 60% of small businesses hit in the July 2021 unrest had no insurance. This is secondary; I haven't found the primary report.

**July 2021 unrest: scale and slow claims**
- Sasria received 14,051 claims worth R32bn. Most claims (12,050) were under R1m each, together worth about R2.26bn. Sasria also flagged fraud and inflated claims ([News24](https://www.news24.com/business/companies/sasria-claims-from-july-unrest-hit-r32-billion-20211116), [M&G](https://mg.co.za/business/2021-11-16-state-insurer-sasria-receives-r32bn-in-claims-relating-to-july-unrest/)).
- Sasria admitted delays, citing "overstretched Loss Adjusters; clients having difficulties in the formulation of claims" ([FAnews](https://www.fanews.co.za/article/non-life/15/general/1217/14-9-billion-reasons-to-pay-riot-claims/33390)). Total damage was estimated at about R50bn, including roughly R10bn uninsured (same source; [Sasria](https://sasria.co.za/2024/08/02/the-real-cost-of-the-riots/)).
- Sasria's process today: if required documents aren't received, the claim is closed as "Not Taken Up". Fast-track claims up to R500k usually take about 25 days, complex ones up to 50. Claims must come through the underlying insurer, the "agent", within 30 days ([Sasria FAQ](https://sasria.co.za/claims-and-underwriting/frequently-asked-questions/)).

**Uninsured traders get shut out of relief**
- DSBD's 2021 Informal Traders Support was a **R3,000 once-off grant**. It required **SA citizenship, a valid SA ID and a SA bank account** ([The Witness](https://witness.co.za/news/2021/08/13/once-off-grant-assistance-for-over-17-600-informal-traders-in-kwazulu-natal-20210813/), [DSBD](https://www.dsbd.gov.za/business-recovery-support-packages)). It reached 17,667 people ([PA](https://pa.org.za/speeches/questions/questions-asked-to-the-minister-of-small-business-/2021-w1943-29-october-2021)), against about 50,000 informal traders affected by DSBD's own estimate ([PMG](https://pmg.org.za/committee-meeting/33458/)).

**The market exists, so this is the competition**
- [Vuleka Insure](https://insure.vuleka.com/), underwritten by Hollard:
  - R199/month on WhatsApp, cover set by invoice photos;
  - pays a stock voucher within 48h, except SASRIA claims;
  - limits of R75k fire / R40k theft / R20k flood per claim.
- [Shop2Shop](https://www.shop2shop.co.za/how-to-get-insurance-for-your-spaza-shop/): R20/week Premium membership, up to R500k riot/strike cover and R30k fire/water.
- [Santam + MoyaApp](https://www.santam.co.za/about-us/media-centre/commercial-lines/santam-launches-sa-s-first-digital-insurance-solution-for-micro-and-informal-businesses/) (May 2023): R75–R195/month, including SASRIA cover up to R500k.
- [A2Pay A2Cover](https://www.a2pay.co.za/services/a2cover/): insurance for A2Pay POS merchants.
- [JMR Software](https://www.jmr.co.za/claims-fulfilment-system/): claims-fulfilment software for insurers and their suppliers (status, imaging, supplier workflow). That's the incumbent if we go upmarket (option B).

**Web3 precedent**
- UNHCR used USDC on Stellar to pay cash assistance straight to recipients' phone wallets in Ukraine (and later Argentina), with cash-out at MoneyGram, for **more than USD 4.6m since Dec 2022**. It describes "real-time traceability of funds… at zero cost" ([UNHCR 2024 cash report](https://www.unhcr.org/us/sites/en-us/files/2025-01/2024-annual-report-on-cash-assistance_13.pdf), [Stellar case study](https://stellar.org/case-studies/unhcr)). This is the best "funder can verify delivery" precedent, but it's USDC on Stellar, not USDT.

## Honest risks: where USDT adds nothing, or hurts

1. **Regulatory headwind for domestic USDT payments.** The SARB/FSCA Joint Communication of **28 May 2026** says: "The SARB is thus unlikely to consider foreign currency-pegged stablecoins as payment instruments for domestic transactions." Crypto payment-type intermediaries need FSCA FAIS licensing ([SARB PDF](https://www.resbank.co.za/content/dam/sarb/what-we-do/payments-and-settlements/regulation-oversight-and-supervision/designation-notices/280526%20Joint%20Communication_Crypto%20assets%20for%20domestic%20payment%20purposes.pdf)). **Mitigation:** the trader never needs to hold USDT. USDT is the settlement leg in a funder's float (insurer, reinsurer, donor), and rand goes out through a licensed CASP. The FSCA had approved 300 CASP licences by 12 Dec 2025 ([FSCA](https://www.fsca.co.za/_api/cr3ad_newses(cec3c818-bbdb-f011-8544-7ced8d771a24)/cr3ad_document/%24value)). Have this answer ready. A business-minded judge will ask.
2. **Rand rails already do instant payouts.** PayShap pays instantly up to R50k, for example free up to R5k at GoTyme ([GoTyme](https://gotyme.co.za/personal/move-money/payshap)), and Vuleka pays vouchers. *USDT doesn't make the payout faster.* What it can add is **one receipt that the insurer, platform, reinsurer and shop can all check without trusting each other's systems**, plus pre-funded per-event float that releases on approval. Ask the payout owner if that matters: "What does a shared settlement receipt let you verify that your bank or payment provider doesn't already handle?"
3. **The bottleneck is evidence and assessment, not payment speed.** The Sasria and Vuleka sources put the delay in documents and peril confirmation. If calls confirm that, the product is the claim pack, and HowlPay is a supporting feature.
4. **Oracle problem.** The alert feed is a human-verified attestation, not ground truth. Claim it as "independent, time-stamped corroboration", never as proof.
5. **POPIA.** Keep photos, IDs and invoices off-chain. Put only the evidence hash next to the payout tx. A human reviews every rejection.
6. **Off-ramp partners.** HoneyCoin's docs list **no SA payouts** (ZAR collections only) ([HoneyCoin](https://docs.honeycoin.app/docs/supported-countries-limits)). "Otonipay" in Alan's notes is probably **Kotani Pay** (my inference). Its API docs show ZAR bank-account off-ramp ([docs](https://documentation.kotanipay.com/v3/api-reference/offramp/create)), and its site claims FSCA FSP 53594 ([kotanipay.com](https://kotanipay.com/contact)). I haven't tested it or checked the licence on the FSCA register.
7. **Fewer than 48h left.** No real "yes" yet. The pitch has to say "validating" honestly, with the call log as evidence.

## Partner naming

The partner naming decision is kept private.

## Freeze for Friday (Fri 13 Nov 23:59 SAST)

**Customer (48h freeze):** embedded micro-insurance platforms and insurers selling cover to spazas. Brokers are a learning channel.
**Problem:** riot (SASRIA), theft and fire claims stall on evidence and peril confirmation, and the shop can't see where its payout is.
**Promise:** "Approved claim → rand in the shop's hands, with one receipt everyone can check."

**Demo scope (reuses the existing code, so no new chain work):**
1. Expo screen: **Claim pack** (fictional sample).
   - Incident card: "Verified alert, 14:05, 300 m from shop".
   - 3 photos and 2 stock invoices.
   - SHA-256 of the pack shown.
2. Role toggle: **Insurer approves R___** (human approval; keep the POPIA note on screen).
3. Payout: treasury (the insurer float) → shop wallet, using the existing `scripts/wallet.ts send --to <shop> --usdt <amt> --approve --wait`, run with the treasury seed exported as before. This is the reverse of the R20 top-up. Check the treasury has test USD₮ and gas first.
4. Receipt: tx hash, amount in rand at `ZAR_PER_USDT`, and `status --hash` re-check shown as "Paid ✓". The off-ramp to rand stays **SIMULATED**, labelled "via licensed partner".
5. Proof we already have: the confirmed R20 top-up tx `0x946a27d9…4a918` on Sepolia.

**Pitch: 3 slides**
1. **Problem.**
   - 82% of small businesses are uninsured (FinScope 2024).
   - Micro-insurers now sell riot cover to spazas for R75–R199/month, but riot claims are the slow ones (Vuleka's SASRIA caveat; Sasria NTU rule).
   - Uninsured traders were shut out of 2021 relief by bank-account and ID rules (DSBD).
2. **Product + live demo.** Claim pack → human approval → USDT float releases → shared receipt → rand. Mention the design principles from the seminar (off-chain PII, human override, WhatsApp/USSD).
3. **Business.**
   - Insurer/platform pays per completed claim pack plus a payout fee. Price is a **hypothesis to test**, anchored against R75–R199/month premiums.
   - The same rail serves recovery funds and donors (UNHCR precedent).
   - Validation log from Friday's calls.
   - Regulatory answer (licensed CASP, trader sees rand).

**Freeze rule after the calls (Fri ~16:00):**

| What the calls show | Freeze |
|---|---|
| Evidence / peril confirmation is a recurring pain (≥2 of 5 calls, with a real case) | **A as written**: claim-pack pilot paid by the platform |
| The pain is payout delay or reconciliation, not evidence | Lead with payout tracking + reconciliation, and compare the rand route vs USDT + rand |
| Shops mostly lack cover, insurers are lukewarm | Lead with **C**: sponsor-funded recovery payouts on the same rail |
| Only demo enthusiasm, no named case | Submit A as a clearly labelled hypothesis and keep discovering |
