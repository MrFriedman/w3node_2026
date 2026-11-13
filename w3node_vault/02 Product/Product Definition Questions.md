---
tags:
  - product
  - validation
date: 2026-11-13
---

# Product Definition Questions

A research brief for Codex: answer every question in place, grounded in [[Validation Findings 2026-11-13]] and cited public research. Do not treat the steering hypothesis as already proven. Leave no question blank once research is done.

Back to [[Validation Findings 2026-11-13]] · [[V1 Build Spec]] · [[Validation Plan]] · [[Claims Assistant Audit]].

These questions exist so HowlPay can be specified clearly enough to complement an underwriting manager's in-house broker app, be useful alongside an existing verified incident-alert feed for Cape Town small shops (partner), and be something users would actually pay for. After answering, use the answers to audit the current app, list the full post-hackathon system, and inform a landing page.

Stay neutral in this note and in any follow-on tracked files: no person or firm names, emails, or phone numbers. Never name the incident-alert partner; use the frozen public phrase "an existing verified incident-alert feed for Cape Town small shops (partner)". HowlPay is fine.

## Steering hypothesis (to test, not a frozen decision)

HowlPay turns a verified incident into a complete, client-approved claim pack on the insurer's own form, with proof of unrest attached, so the insurer gets the file right first time. Payout-on-approval escrow is the roadmap rail for embedded micro-insurers. It complements, not competes with, an insurer's broker app.

---

## 1. What the product is

**Questions**

- In one sentence, with no technical jargon: who uses HowlPay, what goes in, and what comes out?
- Is the core the incident record, the pre-filled claim pack, or the payout rail? Pick one to lead with, and say why the others are supporting rather than the lead.
- What does an existing verified incident-alert feed for Cape Town small shops (partner) uniquely add that others cannot easily copy? The working assumption is verified, timestamped area unrest alerts — the proof riot claims stall on. Confirm or revise this.

**Current evidence**

See [[Validation Findings 2026-11-13]]. Brokers require the insurer's own claim form plus supporting documents; the pack cannot replace that form. One broker named proof of political unrest in the area as the evidence most often queried or rejected on riot claims. Brokers typically do not hold client money, so escrow is not a broker product. Auto-fill and a complete, client-reviewed pack were the strongest repeated asks.

**Answer / recommendation**

<!-- Codex: answer here, with a clear recommendation and a confidence level, citing the validation findings and any public sources. -->

---

## 2. Users versus payer

**Questions**

- Who uses it day to day: the shop owner, the broker's admin, the insurer's claims handler, or some combination? Map each role to the steps they actually touch.
- Who pays, and why that party? Brokers said only "possibly" or that it would take some convincing. What value would an underwriting manager or insurer actually buy (cost per claim, incomplete-file rate, fraud, broker retention)?
- Which buyer segment should v1 and the post-hackathon product aim at: underwriting managers, embedded micro-insurers, or brokers?
- What is the pricing model: per claim, per policy per month, or a licence? What is a believable price in the South African short-term and micro-insurance market, with comparables?

**Current evidence**

See [[Validation Findings 2026-11-13]]. Daily work sits with brokers (intake, chasing documents, liaison) and clients (completing the insurer's form and gathering documents). Insurers and underwriting managers own assessment, special-risk cover, and payout. One brokerage handles about 30+ claims a month. Two brokerages are open to reviewing a first version; willingness to pay is unproven. The frozen v1 buyer in [[V1 Build Spec]] is embedded micro-insurance platforms and insurers selling to spazas and SMEs.

**Answer / recommendation**

<!-- Codex: answer here, with a clear recommendation and a confidence level, citing the validation findings and any public sources. -->

---

## 3. Fit around an underwriting manager's in-house AI broker app

**Questions**

- An underwriting manager is already building a broker-facing AI app and portal (features unknown; a few brokers are testing it). They deal only with brokers, not clients, and are not licensed to advise clients directly. Should HowlPay be a client-side front door that feeds that app, a plugin inside it, or both over time?
- What should be handed over: a pre-filled insurer form, a document bundle, an evidence hash, an API, or a combination?
- What should HowlPay never build because the broker app or insurer portal probably already does it, or because those parties do not want a replacement (for example policy admin, quotes, a new client portal, or a competing broker portal)?

**Current evidence**

See [[Validation Findings 2026-11-13]], underwriting-manager section, and implications. Do not pitch a competing broker portal. Client-facing pre-fill must sit with the broker and the client, not as a direct underwriting-manager-to-client channel. Keep the insurer's own form and the broker-only portal.

**Answer / recommendation**

<!-- Codex: answer here, with a clear recommendation and a confidence level, citing the validation findings and any public sources. -->

---

## 4. Feature evidence

For each feature: is it v1, roadmap, or out? Who is it for? What would make it paid-for? Fill the recommendation column in place.

| Feature | Current evidence (see [[Validation Findings 2026-11-13]]) | Answer / recommendation |
| --- | --- | --- |
| Client-reviewed, pre-filled insurer claim form | Three brokers: the insurer's own form is required. At one brokerage the broker may help but is not allowed to complete the form for the client. Some forms are not fillable PDFs. | |
| Missing-documents checklist, by cause of loss | One brokerage cut time to a complete submitted file from about three weeks to about two days by refusing to submit until every required document was present. | |
| Policy-matched forms | A proposal form has space for only two vehicles, while about 90% of that book have more; clients also wade through irrelevant sections (boat, trailer, caravan). Strongest ask: upload the policy, generate a form that matches it, and alert on empty fields. Proposal packs are the bigger pain at that office; claims-form work is first, proposals are later. | |
| WhatsApp-style assistant with mandatory human handoff | Familiar channel; a chatbot with no live handoff to a person at the brokerage is a no-go. Small brokerages sell personal touch. | |
| Proof of unrest from an existing verified incident-alert feed for Cape Town small shops (partner) | One broker: this is the proof most often queried or rejected on riot claims. Unconfirmed by a claims owner. Brokers are one step removed; the insurer deals with the special-risk scheme. | |
| Escrow payout release on approval | Not validated with brokers: they do not hold client money. Roadmap rail for insurers and embedded micro-insurers? Do not lead broker conversations with it. | |
| Data security and POPIA | Raised unprompted by one broker, and matters as much as speed. Pack stays off-chain; only a hash is intended to go on-chain. | |

**Answer / recommendation (cross-cutting)**

<!-- Codex: recommend v1 vs roadmap vs out for the set, with confidence levels. -->

---

## 5. Proof and the ask

**Questions**

- What is the one metric HowlPay can defend today? The cleanest figures so far are about 4 back-and-forths per file, and about 5 days to pay after approval (both from one broker, and depending on the claim). Another brokerage's "about two days" is time to a complete submitted file, not time to payment. Can HowlPay credibly claim to cut either figure, and how would a pilot measure that?
- What is the smallest believable pilot (for example 10 claims, one broker, 4 weeks)? Who has to be in the room (broker, client, underwriting manager or insurer claims)?
- What should be asked of an insurer or underwriting-manager CEO: 15 minutes, a claims-operations introduction, anonymised incomplete-file and payout stats, or a sandbox against their form?

**Current evidence**

See [[Validation Findings 2026-11-13]], Broker B figures, Broker A complete-file timing, and the underwriting-manager path to a decision-maker. Anonymised stats and a claims walkthrough from that underwriting manager are gated on CEO approval. No paid pilot yet. Claims-handling cost, riot proof at the claims owner, and payout-rail failure modes remain unvalidated.

**Answer / recommendation**

<!-- Codex: answer here, with a clear recommendation and a confidence level, citing the validation findings and any public sources. -->

---

## 6. Data and trust

**Questions**

- Where does client data live, and how does the design comply with POPIA? What is stored, for how long, who is the responsible party, and what does the client consent to?
- The working design is an off-chain pack (form plus attachments) and an on-chain hash only. Is that sufficient, and what must the pitch say about it?
- What does the insurer see, what does the broker see, and what does the shop or client see? Define role-based views.

**Current evidence**

See [[Validation Findings 2026-11-13]] (data security raised unprompted) and [[V1 Build Spec]] (private incident record and pack stay off-chain; only the hash is recorded on-chain).

**Answer / recommendation**

<!-- Codex: answer here, with a clear recommendation and a confidence level, citing the validation findings and any public sources. -->

---

## 7. Partner value

**Questions**

- How does an existing verified incident-alert feed for Cape Town small shops (partner) benefit or monetise this? Does it sell verified incident evidence to insurers, or do shops get better cover or faster payouts because they contribute to or receive that feed?
- Is HowlPay a feature of that partner, or a separate product that the partner feed supplies? What does that imply for branding, data rights, and who owns the customer?

**Current evidence**

See [[Validation Findings 2026-11-13]] and the frozen public wording in [[V1 Build Spec]]: the incident source is "an existing verified incident-alert feed for Cape Town small shops (partner)". Proof of unrest is the leading unique-value hypothesis and is not yet confirmed by a claims owner.

**Answer / recommendation**

<!-- Codex: answer here, with a clear recommendation and a confidence level, citing the validation findings and any public sources. -->
