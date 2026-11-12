---
tags:
  - meetings
date: 2026-11-12
attendees:
  - Dylan Friedman
  - Alan
source: https://notes.granola.ai/d/f251ac47-882e-4cee-bddf-acf74842ecc8
granola_id: f251ac47-882e-4cee-bddf-acf74842ecc8
---

# Alan — Insurance claims & payouts

Thu 12 Nov 2026, 20:36 SAST. Source: [Granola](https://notes.granola.ai/d/f251ac47-882e-4cee-bddf-acf74842ecc8).

## Who Alan is

Unknown from the notes. He is named in the meeting title and the Granola summary. He was not on the calendar invite (`known_participants` lists only Dylan Friedman). No company, role, or affiliation is recorded.

## Summary

Conversation about using a blockchain rail, discussed in the context of Avalanche, for insurance claims automation, and how that could sit on a payments product for the Tether Mobile Money & Peer-to-Peer track.

The payment framing was: shops pay and receive in rand; USDT moves on-chain in the middle; a partner would pay out in local currency. Because the track requires a payment system, the on-chain transfer stays part of the story. Avalanche was discussed as a place to keep a tamper-resistant claims log. That is optional for a demo, not a decision to leave Sepolia or Tether WDK.

## Key advice

- **Claims ledger.** Record each step of a claim (registration, assessor approval, repair, payment) on an immutable ledger so there is one source of truth and a harder fraud path.
- **Parametric payouts.** When a claim is approved, a contract can release payment without a second human step.
- **Rand in and out, USDT on-chain.** Local currency at the edges; stablecoins for the on-chain process. An OTC-style partner could underwrite in crypto and pay out in rand.
- **AI agent in front.** An agent handles the workflow; the ledger sits behind it.
- **Judges are business-minded.** Lead with revenue, lives improved, and what is cheaper or better than today's options. Research comparables. Technical depth (persistency, security) is secondary for this panel.

## Action items

- [ ] Research Tether-backed payout partners, including Otonipay and HoneyCoin (spellings unverified).
- [ ] Reframe the pitch around business value and an AI agent workflow, not just the chain architecture.
- [ ] Catch up with Alan in the week of 16 Nov 2026.

## Pivot implications

Under consideration, not decided. See [[Decisions]].

Insurance claims payouts would be a fifth use of the existing USDT rail, alongside remittances, stokvel, spaza-wholesaler, and gig wages. The built stack (Sepolia, Tether WDK, HowlPay script and Expo shell) can still be the demo. Avalanche is optional colour for an immutable claims ledger, not a required chain change this weekend.

## Gaps

This note is based on Granola's AI summary only. The verbatim transcript is on a paid Granola plan and was not retrieved. Private notes were empty. There are no verbatim quotes. Alan's identity and affiliation are unknown from the notes.
