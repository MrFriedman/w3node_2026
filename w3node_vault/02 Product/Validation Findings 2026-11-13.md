---
tags:
  - product
  - validation
date: 2026-11-13
---

# Validation Findings: Friday 13 Nov

Public, redacted notes from today's validation conversations. No person names, firm names, or contact details. Back to [[Validation Plan]] · [[V1 Build Spec]] · [[Pivot Decision]].

These are interview observations, not industry averages, HowlPay results, or service commitments. Partner and personal contacts stay in the local private vault.

## Broker A (two calls)

A Cape Town short-term brokerage, spoken to twice on 13 Nov.

- Brokers handle intake and are client-facing. They do not own the timeline, assessment, or payout.
- Many brokers never hold client money. Debit orders go straight to the insurer, so escrow is not a broker product.
- Claims at this brokerage are fairly streamlined.
- The biggest pain is new-client proposal packs: about 10 pages, plus debit-order and subsidence forms. Clients leave fields blank. It takes about an hour per pack to print, fill, and scan.
- Strong interest ("100%") in auto-filling the insurer's own forms from the policy and data already on file, with the client only signing.
- A WhatsApp-like flow would feel familiar.
- They might pay for this, with convincing.
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

- Auto-fill the insurer's own forms and add a per-cause document checklist. Do this for claims now. Proposal and onboarding forms were the stronger pain at Broker A, and belong on the roadmap after the claims-form work.
- Attach proof of unrest from an existing verified incident-alert feed for Cape Town small shops (partner).
- Offer a WhatsApp-style assistant for first-time claimants, and for missing-field follow-up.
- Escrow sits with insurers and embedded micro-insurance platforms, not with brokers. Do not lead with escrow when talking to this kind of broker.
- Still unvalidated: claims-handling cost at an insurer, riot proof at the claims owner, payout timing, whether there is an SME or commercial book, and a pilot.
