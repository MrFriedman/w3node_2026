---
tags: [pitch, demo]
status: draft
date: 2026-11-13
---

# Demo script

## Current approved walkthrough — three minutes, no new payment

Lead with theft-claim preparation for a shopkeeper and their existing broker. The insurer decides coverage and remains the payer. Open the landing page, then **Try the demo**. Everything in PREP–THEFT–001 is fictional and session-local. Role switching is a presentation control, not authentication.

### 0:00–0:20 · A clear next step

“This shopkeeper already has a broker. HowlPay helps them prepare the theft claim and see who needs to act next. We aim to reduce repeated requests and preparation work; savings are not measured yet.”

Show the next-action card, fictional broker Alex, requested loss and outstanding police-reference request. The current theft claim has no payout.

### 0:20–0:50 · Shop answers, with confirmation

Use **Help me answer**. Enter “There was a theft on 2026-11-13. I lost R200 of stock.” Review and confirm the proposal. Nothing is saved to the preparation draft until confirmed. Return to Claim. The assistant cannot accept broker requests, submit claims, decide coverage or authorise payment.

### 0:50–1:20 · Broker request and shop response

Open Requests. Enter “DEMO-CAS-123, reported 13 Nov”. Send the response to the demo broker. In Demo controls switch to Broker. Optionally show Request clarification, switch to Shop to clarify, then return to Broker and Accept response. These are local simulation actions, not messages sent to real people.

### 1:20–1:55 · Prepare a reviewable file

On Claim, inspect confirmed answers and readiness gaps. Open Review form and evidence; add the explicitly fictional policy and photo records. These are synthetic fixtures, not uploaded documents or verified evidence. The receiving insurer sets the actual form and requirements; banking remains unresolved.

Mark ready for insurer, then Simulate submission to insurer. A frozen version is created. If demonstrating an edit, show that it requires renewed broker review while the submitted version stays unchanged.

### 1:55–2:20 · Insurer authority

Switch to Insurer, in Progress. Show the submitted requested loss separately from the illustrative approved amount. Illustrate approval (or rejection). “This is a simulated decision and payment handoff. No insurer submission, authorisation or payment has occurred.” The current theft case still says No payout.

### 2:20–2:50 · Separate historical payment example

Expand Existing testnet payment example. Re-check the existing receipt read-only. If verification fails, show unavailable or stale honestly; do not record a mocked test receipt as live evidence. The receipt belongs to the historical case, not this theft preparation. No new opening, release, deployment or treasury transfer is part of this recording.

Explain: “The existing testnet example used a pre-funded Sepolia pool. An insurer would separately authorise settlement. Fiat on-ramp and rand off-ramp are SIMULATED; no real bank or mobile-money integration is connected. The shop would not need to hold USDT.”

### 2:50–3:00 · Close

“One place to see the next action, resolve the missing information, and prepare the file for the insurer. The insurer keeps the coverage and payment decision.”

## Recording boundaries

- Use fictional details only. Reload/reset clears local workflow and assistant progress.
- Never show seeds, filled env files, private notes or a mainnet network.
- If mentioning the source, use “an existing verified incident-alert feed for Cape Town small shops (partner)”. The bundled incident record is fictional; no feed is connected.
- Existing Sepolia evidence is independent of preparation edits. No transaction in this pass is authorised.
- Ten discovery calls, including four brokerages, two meetings next week and two brokerages expressing willingness to pay are user-reported discovery signals. They are not paid adoption or measured savings. Keep them out of the UI unless needed for a separate validation discussion.
- Prior payment-signing and service-credit recordings are historical material, not the current demo procedure. See Testnet for existing evidence.
