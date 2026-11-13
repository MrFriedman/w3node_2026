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

## Underwriting manager

A short callback on 13 Nov.

- Offered anonymised stats by email, and to check for a shareable workflow.
- Firm line: no personal data can be released.
- No walk-through of a claim yet, and no process or cost figures yet.

## Other outreach

Outreach is out to the riot-cover state insurer and the brokers' association. No replies yet.

## Implications for HowlPay

- Auto-fill the insurer's own forms and add a per-cause document checklist. Do this for claims now. Make the form match the policy (the right number of vehicles, hide irrelevant sections) and flag missing fields and documents before submission. That missing-document check is what cut this brokerage's claims delays. Proposal and onboarding forms were the stronger pain at Broker A, and belong on the roadmap after the claims-form work.
- Keep the insurer's own form and the broker-only portal. Do not replace them with a new client portal those insurers do not want. Information gathering, not typing, is the bottleneck on proposal packs; email remains the client channel.
- Attach proof of unrest from an existing verified incident-alert feed for Cape Town small shops (partner).
- Offer a WhatsApp-style assistant for first-time claimants, and for missing-field follow-up, with a human still able to treat frequent and first-time claimants differently.
- Escrow sits with insurers and embedded micro-insurance platforms, not with brokers. Do not lead with escrow when talking to this kind of broker. Lead with complete files, a policy-specific form, and a familiar business chat line. Sell to the claims and operations side, not by asking the old-school broker to change how he works.
- Paper-file digitisation is a related pain at this kind of office, not V1.
- Still unvalidated: claims-handling cost at an insurer, riot proof at the claims owner, payout timing, whether there is an SME or commercial book, and a pilot.
