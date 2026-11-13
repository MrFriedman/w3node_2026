# Claims Assistant Audit

Audit date: 2026-11-13. Milestone: fictional claim preparation, claimant capture and broker file preparation. This is a prototype, not an accepted insurer form, claims backend or autonomous claims handler.

## Evidence and business rationale

The frozen buyer remains embedded micro-insurance platforms and insurers; brokers may be users, distribution partners or an additional buyer hypothesis. Revenue per completed pack plus a payout fee remains unvalidated. Preparing a complete file is the main value hypothesis. Blockchain records settlement; it cannot establish incident truth, cover, document authenticity or preparation quality.

**One qualitative interview:** the broker feedback recorded in [[V1 Build Spec]] reports about four follow-ups per file and about five days to payment after approval in that broker's experience. Neither number is an industry average, service commitment or measured HowlPay outcome. Do not multiply those figures into an unsupported market-size or savings claim.

**Published process evidence (accessed 2026-11-13):**
- [Sasria Claims Hub](https://sasria.co.za/claims-hub/): contact the insurer or broker first; they help determine whether the claim falls under Sasria cover. This supports the broker handoff, not automatic eligibility.
- [Sasria Claims FAQ](https://sasria.co.za/claims-and-underwriting/frequently-asked-questions/): missing information can prevent processing and lead to closure as Not Taken Up; premium evidence is required alongside cover documents. The FAQ's five working days concerns liability communication after receipt of required documents, not the interview's post-approval payment estimate.
- [Sasria Agent Claims Procedure Manual, 2023](https://sasria.co.za/wp-content/uploads/2023/08/Sasria-Agent-Procedure-Manual.pdf), sections 5–6: form, schedule, coupon and premium evidence support registration. Media/police evidence may help establish the alleged peril; an affidavit alone is insufficient peril verification. Repair quotations are conditional. This older manual is guidance, not confirmation of requirements for every policy or claim.

The riot demo checklist links these official sources. Theft/fire reporting, photos, stock-value evidence and some conditional items are explicitly generic assumptions requiring insurer confirmation. This milestone does not implement an exhaustive insurer checklist. A fictional area alert cannot substitute for insurer-required peril evidence.

## Code audit and delivered behaviour

Historical context: 0a6e417 introduced escrow and the claims workspace; fc7dd42 introduced the assistant. Current implementation references:
- shared/assistant.ts: typed fields, EN/AF/XH fixture extraction, proposal confirmation and source history. Confirmation IDs prevent duplicate application. Question/request detection rejects common question and action prefixes before extraction.
- shared/preparation.ts: separate R200 fixture, mapped fields, versioned checklist, document states, broker summary/follow-up and canonical SHA-256 preparation payload. The historical shared/claims.ts pack/hash remain unchanged.
- app/src/PreparationScreen.tsx: form confirmation, unresolved banking, conditional checklist, inspectable fixture content, JSON and digest preview. Preparing an incomplete pack records gaps; it is not an insurer submission.
- app/src/ClaimScreen.tsx and AssistantScreen.tsx: shared case draft, persistent three-tab shell, role-specific starters, proposal review, checklist answers and settlement freshness. Conversation and confirmed draft are session-local; restart persistence is not provided.
- scripts/assistant-server.ts: optional model extraction and transcription proxy. No new backend or integration was introduced. Model text is untrusted input; extracted fields require confirmation.
- app/src/claim-receipt.ts: chain/token/deployment/event/state checks, distinct transaction lookup statuses and bounded requests. A failed refresh retains a marked stale snapshot. Mined is not finalised.

Invoice purchase date and total remain document values; they are not automatically imported as incident date or requested loss. Field provenance distinguishes fictional starting data from confirmed user entries; invoice extraction remains separate evidence. Placeholder slots are incomplete even if they have descriptive text.

The digest includes canonical form rows, versions, checklist options/states and sorted attachment IDs with fixture contents and content hashes. It is labelled off-chain and unanchored. It is not proof of authenticity or completeness. Existing historical settlement evidence remains independent of preparation edits.

## Roles and handoffs

| Role | Current supported preparation task | Handoff / authority |
| --- | --- | --- |
| Claimant/shop | Describe fictional incident, review proposed fields, inspect gaps and status | Confirms own statements; unresolved questions remain visible in conversation |
| Broker | Review the same form/checklist, inspect source links, draft a follow-up for manual review/copy | Checks policy-specific requirements and sends through existing channels; app sends nothing |
| Insurer handler | Existing demo brief and human decision/signing explanation | Retains coverage and approval authority; advanced decision support is roadmap |
| Embedded platform | Existing demo overview and settlement receipt | Production ingestion, tenant administration and access controls are roadmap |

A single case picker is used when Assistant has no selected case. Role switching is a demo control, not authentication. All four roles can open Assistant. During recording or extraction, tab changes are disabled; proposals, messages and drafts survive tab changes. Banking remains unresolved and is excluded from extraction.

## Limits and priorities

**P0 delivered:** shared preparation state; explicit unknowns; sourced checklist guidance; honest fixture labels; confirmation before continuing intake; broker handoff; persistent Assistant navigation; settlement verification timestamps.

**Unvalidated:** whether claimants understand each question, brokers trust provenance, insurers accept the resulting field mapping, documents are sufficient for a particular policy, users will pay, and any time or follow-up reduction. The phrase “single source of truth” describes product ambition, not current production guarantees.

**Language/voice:** canned EN/AF/XH examples and questions are available, with an editable transcript. These are not professionally reviewed translations. Offline voice uses a labelled sample transcript. A configured transcription service is optional; live accuracy, accents, noise, consent and retention have not been validated. Model mode is identified after a service response; before that the UI explicitly says mode is unverified.

**Extraction limits:** question filtering is conservative heuristic logic, not general intent understanding. The optional model processes one message rather than retrieving the entire case. Unsupported questions stay in the conversation without modifying the form. No general document OCR, retrieval, coverage advice, claim approval or payment execution is delegated to AI. Fixture invoice parsing is intentionally narrow.

**Roadmap:** secure storage/access controls and retention policy; real document upload with provenance; insurer-approved templates/PDF output; broader case Q&A with cited case facts; multilingual and speech validation; document extraction evaluated against human-labelled examples; insurer decision support and platform administration only after preparation validation. Real payout integration remains separate.

## Small user-validation protocol

Recruit 4–6 claimants and 3–5 brokers/claims handlers for an initial qualitative usability study; report the actual sample, not these targets as completed sessions. Obtain consent, use fictional cases only and explain the prototype.

Give each participant two equivalent fictional cases with matched complexity and deliberately missing information. Counterbalance order: existing blank form/checklist versus assisted preparation. Give both conditions the same available facts and document access. Use new equivalent details to reduce learning effects.

Measure time to a reviewable file, missing/incorrect fields, unsupported facts introduced, corrections accepted/rejected, unresolved documents and follow-up requests a blinded broker/handler would make. Record task abandonment and whether participants confuse simulated payout, fixture evidence or the digest with actual verification. Ask participants to explain the status in their own words.

Have handlers assess both outputs against their actual form requirements before discussing the interface. Separately ask buyers which workflow they would trial, their approval process and whether they will commit to a dated pilot or paid test. A positive interview is not a purchase commitment.

Freeze the next scope only if users can complete the core task without critical misunderstandings and handlers find the resulting file useful. Do not set savings claims from this small study: publish raw observations, paired differences and limitations. Investigate every invented fact or mistaken payment/coverage belief before expanding AI scope. No sessions or measured savings have been fabricated.

## Verification

Automated and UI verification results are recorded in [[Build Log]]. Native-device, assistive-technology, live model and live transcription validation must be reported separately from successful typechecks and bundles.
