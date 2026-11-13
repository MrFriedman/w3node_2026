# Theft preparation UX audit — 13 November 2026

## Baseline before UI edits

Reviewed the current worktree, not the stale AGENTS build status. Exported the original UI and walked Shop, Broker and Insurer roles in headless Chromium at 390px. Baseline screenshot: `/tmp/howlpay-baseline.png` (local QA, not a deliverable).

- Default Insurer screen and the historic R200 settlement led the experience; the editable preparation case was not visually independent enough.
- Claims / Activity / Assistant plus five inner sections duplicated navigation and exposed a large technical flow.
- Broker had a generated brief and form, but no actionable request, acceptance or readiness lifecycle. Shop response could not advance a broker review.
- Coverage, preparation and settlement needed independent status labels. Historical receipt status appeared beside current preparation information.
- No baseline overflow assertion was made; final responsive tests cover this explicitly.

## Implemented review

- Landing page has working local demo CTAs; no signup or external submission. Existing amber/paper/ink tokens and fonts retained. Client, broker and insurer responsibilities are distinct. No adoption metrics or compliance promises.
- Default Shop and theft case; one next-action card, named fictional broker, request count, requested loss and No payout. Technical bundle is behind form/evidence expansion; historical hashes and lookup remain behind receipt details.
- Claim / Requests / Progress navigation; destination changes return to the top. Assistant remains mounted so proposals, conversation and local controls persist. Request help supplies context without sending a response for the shop.
- Broker sees fixture/confirmed provenance, incomplete checklist and unresolved request gates. Only explicit synthetic evidence additions count as supplied. Police evidence is derived from broker acceptance. Readiness does not assert cover or insurer acceptance.
- Submitted versions are deep-copied snapshots. Material edits clear readiness/current illustrative decision, require review, and preserve earlier submissions. Demo transitions check the acting role as a consistency guard, not authentication.
- Insurer controls use the frozen submitted request amount and a separate illustrative approved amount. Approval/rejection has no signing effects. Historical contract, pack, receipt matcher and wallet code are untouched.
- Reset clears the session; landing-page return retains it. Reload clears progress. All external data remains outside scope.

## Actual verification

- 41 tests: 5 money/approval, 8 assistant, 5 preparation, 16 receipt-reader, 3 workflow, 4 local escrow. All passed.
- App and scripts TypeScript checks passed. Expo web export passed.
- `scripts/test/preparation-ui.cjs`: Chromium at 320/390/430/1280 × 900. Landing entry; theft intake and explicit confirmation; role and conversation retention; answer → clarification → answer → acceptance; incomplete readiness disabled; evidence supplied; ready invalidated by an edit; frozen submitted amount survives another edit; illustrative approval and rejection; independent historical receipt and failed refresh stale notice; reset. No page errors or document horizontal overflow. Read-only RPC methods asserted. Receipt responses are mocked, not live chain verification.
- `scripts/test/assistant-ui.cjs`: controlled 503 then successful retry, single user message, pending navigation lock, retained proposal and confirmation, desktop focus and reduced viewport, 150% font overflow checks. Assistant responses mocked; no live model used.
- Additional 150% computed font/line-height checks passed across Claim, Requests and Progress at 320/390/430px, including a reachable response action and contextual help. Visual review covered the mobile landing, claim home, enlarged request and historical receipt screenshots. Browser checks do not establish native rendering, safe areas, software keyboard behaviour, screen reader usability or real device font scaling.

## Reproduce

From `app/`, use `EXPO_NO_DOTENV=1 npx expo export --platform web --output-dir /tmp/howlpay-workflow-export`; serve that directory on localhost. Run the optional browser scripts with `HOWLPAY_TEST_URL`, `PLAYWRIGHT_MODULE` and (if needed) `PLAYWRIGHT_BROWSERS_PATH`. No new test dependencies were added. The assistant transport script needs a separate export with `EXPO_PUBLIC_ASSISTANT_URL=http://127.0.0.1:8788`; its route is intercepted by the test.

Use `npm run typecheck` in app and scripts, and scripts' `test`, `test:assistant`, `test:preparation`, `test:receipt`, `test:workflow`, `test:escrow` commands. Existing dependencies were reused locally for this worktree; fresh checkouts should install from their lockfiles.

No new transactions, deployment, real insurer submissions, publishing, commits or pushes were performed. Public source naming stays neutral. Remaining gaps: real insurer forms, uploads, secure persistence/auth, real integrations, native/accessibility verification and user testing.

## Changed-file inventory

- App entry and orchestration: `app/App.tsx`, `app/src/ClaimScreen.tsx`, `app/src/AssistantScreen.tsx`.
- Focused views: `app/src/LandingScreen.tsx`, `app/src/RequestView.tsx`, `app/src/ProgressView.tsx`, `app/src/HistoricalReceipt.tsx` (new).
- Shared model: `shared/workflow.ts` (new), `shared/assistant.ts` (separate preparation ID), `shared/preparation.ts` (theft fixture).
- Verification: `scripts/package.json`, `scripts/test/workflow.test.ts` (new), `scripts/test/preparation.test.ts`, `scripts/test/preparation-ui.cjs`, `scripts/test/assistant-ui.cjs`.
- Notes: this audit, `w3node_vault/02 Product/V1 Build Spec.md`, `w3node_vault/03 Build/Build Log.md`, `w3node_vault/03 Build/Tasks.md`, `w3node_vault/05 Pitch/Demo Script.md`.

Worktree: `/Users/dylanfriedman/.codex/worktrees/1978/w3node_2026`. Branch: `codex/theft-claims-ux-landing`, based on `1bbc6ce`. Uncommitted for review.
