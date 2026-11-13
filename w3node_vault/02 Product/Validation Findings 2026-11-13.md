---
tags:
  - product
  - validation
date: 2026-11-13
---

# Validation Findings: Friday 13 Nov

Public, redacted notes from today's validation conversations. No person names, firm names, or contact details. Back to [[Validation Plan]] · [[V1 Build Spec]] · [[Pivot Decision]].

These are interview observations, not industry averages, HowlPay results, or service commitments. Partner and personal contacts stay in the local private vault.

## Broker A (three conversations)

A Cape Town short-term brokerage, spoken to three times on 13 Nov, including a callback with the claims manager.

- Brokers handle intake and are client-facing. They do not own the timeline, assessment, or payout.
- Many brokers never hold client money. Debit orders go straight to the insurer, so escrow is not a broker product.
- Claims at this brokerage are fairly streamlined, because the claims manager will not submit a file until every required document is present. Submitting without a supporting document (for example a driver's licence on a motor claim) used to come back about a week later. A claim that should be sorted in about two days was taking about three weeks a year or two ago; they are now around two days. That figure is time to a complete, submitted file, not time to payment after approval.
- The biggest pain is still new-client proposal packs: about 10 pages, plus debit-order and subsidence forms. Clients leave fields blank. It takes about an hour per pack to print, fill, and scan. The slow part is gathering information the client, and often the broker, does not have, not the typing. They pre-fill what they can, email the insurer's form to the client, and the client emails it back. There is no client portal.
- Proposal forms are a poor fit for the actual book. The vehicle section only has space for two vehicles, but most clients have more than two. Clients also have to go through irrelevant sections (for example boat, trailer and caravan pages when they are only insuring a home). The strongest ask is: upload the policy or quote, generate a form that matches that policy, and alert on the fields that still need filling.
- For broker-only insurers, only the broker works on the insurer's portal. Those insurers do not want a client portal.
- Strong interest ("100%") in auto-filling the insurer's own forms from the policy and data already on file, with the client only signing.
- A WhatsApp-like flow would feel familiar. They do client work on email and some on WhatsApp, but do not have a business WhatsApp line. Interest in a chat or live-chat front door for intake and simple policy questions, as long as it stays personal and does not force every client through the same path. Frequent claimants often only need the completed claim form.
- The decision-maker likes it when clients praise fast claims, and would likely like a business WhatsApp line, but would not use a new tool himself. The claims manager and a family colleague are the ones who want to modernise, including turning paper client files into a searchable database. The blocker has been who captures the existing files.
- They might pay for this, with convincing. They will discuss it internally at the start of the week, and are open to reviewing a first version. No paid pilot yet.
- Document requirements vary by cause of loss.
- Volume is about 30+ claims per month.

## Broker B

A Cape Town short-term broker, written answers on 13 Nov.

- The insurer's own claim form plus supporting documents is required. The pack cannot replace the insurer's form.
- About 4 rounds per file, depending on severity and circumstance.
- About 5 days to pay after approval, depending on the claim.
- Riot claims need proof of political unrest in the area. This is the proof that gets queried or rejected most often.

## Broker C

A Cape Town short-term brokerage, one phone call on 13 Nov, with a principal who handles claims and client work.

- They use the insurer's own claim forms, not a broker form. Some are fillable PDFs; others are not. They keep copies of every insurer's form and send the client the form that matches that insurer.
- The client fills in the form and gathers the supporting documents, then sends the pack to the broker. The broker can help, but is not allowed to complete the form on the client's behalf. The broker double-checks the pack and sends it on to the insurer, then liaises until repairs are authorised or, on a write-off, the payment is made.
- Straightforward claims are normally done within a couple of days, depending on the value. If an assessor is required, timing depends on the assessor and the client, and on whether a vehicle is driveable. Assessment can be on site or desktop from photographs. Insurers have cost thresholds above which an assessor has to go out. This is process time, not a clean "days after approval" figure.
- Form errors happen, but not often, because clients usually phone when they get stuck and the broker talks them through the form. No back-and-forth count or hours-per-file figure was given.
- They do not run debit orders or hold client money. The insurer collects; the broker handles the correspondence.
- At renewal they do a market exercise. A policy may sit with one insurer, or be split where specialist cover is needed.
- Interest in a system that helps fill the insurer's form and track the claim is cautious: it could be useful if it frees up capacity in a small brokerage, but they think that kind of automation probably helps a bigger corporate brokerage more, they are "of the older generation," and the partner who decides will need to see it. Personal connection with the client is a core selling point.
- A WhatsApp-easy flow fits, because a lot of their clients already use WhatsApp. A chatbot-only path does not: they want to be able to reach an actual person at the brokerage if needed. Combining the assistant with a live handoff is what they said a lot of brokers would actually be interested in.
- Data security, in line with legislation, was raised unprompted and matters as much as speed.
- They have had the odd riot or special-risk claim, but they do not deal with that scheme themselves; the insurer does. No comment on proof of unrest, and no confirmed delay.
- Open to reading a short overview and to looking at a free first version. Willingness to pay was only "possibly," and that "some brokers would definitely pay." No paid pilot. The partner is due back at the start of next week. No SME or spaza book was confirmed.

## Underwriting manager

A short callback on 13 Nov.

- Offered anonymised stats by email, and to check for a shareable workflow.
- Firm line: no personal data can be released.
- No walk-through of a claim yet, and no process or cost figures yet.

## Other outreach

Outreach is out to the riot-cover state insurer and the brokers' association. No replies yet.

## Implications for HowlPay

- Auto-fill the insurer's own forms and add a per-cause document checklist. Do this for claims now. Make the form match the policy (the right number of vehicles, hide irrelevant sections) and flag missing fields and documents before submission. That missing-document check is what cut Broker A's claims delays. Proposal and onboarding forms were the stronger pain at Broker A, and belong on the roadmap after the claims-form work.
- The client, not the broker, may have to complete the insurer's claim form. At Broker C the broker can help, but is not allowed to fill it in on the client's behalf. Some of those forms are not fillable PDFs. So auto-fill should be a client-facing pre-fill the client reviews and submits, not a broker-completes-and-sends shortcut that some insurers would reject. Real PDF form-filling stays on the roadmap.
- Keep the insurer's own form and the broker-only portal. Do not replace them with a new client portal those insurers do not want. Information gathering, not typing, is the bottleneck on proposal packs; email remains the client channel.
- Attach proof of unrest from an existing verified incident-alert feed for Cape Town small shops (partner). Brokers are one step removed from that scheme: the insurer deals with it. Test the evidence gap with the claims owner, not another broker.
- Offer a WhatsApp-style assistant for first-time claimants, and for missing-field follow-up, with a human still able to treat frequent and first-time claimants differently. A live handoff to a person at the brokerage is a requirement, not a nice-to-have. Small brokerages sell personal touch and will reject a chatbot-only front door. Position this as freeing up capacity, not as big-corporate automation.
- Data security, in line with legislation, should be visible in the pitch. Do not lead broker conversations with the payout rail or with the underlying settlement technology.
- Escrow sits with insurers and embedded micro-insurance platforms, not with brokers. Do not lead with escrow when talking to this kind of broker. Lead with complete files, a policy-specific form, and a familiar business chat line. Sell to the claims and operations side, not by asking the old-school broker to change how he works.
- Paper-file digitisation is a related pain at this kind of office, not V1.
- Two brokerages are now open to reviewing a first version once their decision-makers have been briefed at the start of next week. That is still not a paid pilot.
- Still unvalidated: claims-handling cost at an insurer, riot proof at the claims owner, payout rails and failed payouts, whether there is an SME or commercial book, and a paid pilot. The only clean post-approval payout figure remains about five days (Broker B). Broker C's "couple of days" is for a straightforward claim through the process, and lengthens when an assessor is required.
