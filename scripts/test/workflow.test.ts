import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FORM_FIXTURE, DEFAULT_OPTIONS, attachments } from '../../shared/preparation.ts'
import { newWorkflow, readiness, syncPreparation, transition, workflowDocuments, type Preparation } from '../../shared/workflow.ts'
import { DEMO_PACK, DEMO_PACK_HASH } from '../../shared/claims.ts'
const base = (): Preparation => ({ draft: structuredClone(FORM_FIXTURE), documents: attachments(), options: { ...DEFAULT_OPTIONS } })
function complete() {
  let p = base(); let w = newWorkflow()
  w = transition(w, { type: 'review' }, 'Shop', p)
  w = transition(w, { type: 'answer', id: 'police', response: 'DEMO-CAS-123' }, 'Shop', p)
  w = transition(w, { type: 'accept', id: 'police' }, 'Broker', p)
  p = { ...p, documents: workflowDocuments(p.documents.map(d => ['policy', 'photos'].includes(d.id) ? { ...d, content: 'Fictional supporting evidence', state: 'supplied' as const } : d), w) }
  return { p, w }
}
test('theft defaults, incomplete readiness, role and request guards', () => {
  const p = base(); let w = newWorkflow()
  assert.equal(p.draft.fields.incident, 'theft')
  assert.ok(readiness(p, w).length >= 3)
  const missing = { ...p, draft: { ...p.draft, fields: { ...p.draft.fields, claimant: '' } } }
  assert.ok(readiness(missing, w).includes('Complete claimant'))
  assert.equal(transition(w, { type: 'ready' }, 'Broker', p), w)
  assert.equal(transition(w, { type: 'accept', id: 'police' }, 'Broker', p), w)
  assert.equal(transition(w, { type: 'answer', id: 'police', response: 'x' }, 'Insurer', p), w)
  w = transition(w, { type: 'answer', id: 'police', response: 'DEMO-123' }, 'Shop', p)
  assert.equal(w.requests[0].status, 'answered')
  w = transition(w, { type: 'clarify', id: 'police' }, 'Broker', p)
  assert.equal(w.stage, 'Needs information')
  w = transition(w, { type: 'answer', id: 'police', response: 'DEMO-123, 13 Nov' }, 'Shop', p)
  w = transition(w, { type: 'accept', id: 'police' }, 'Broker', p)
  assert.equal(w.requests[0].status, 'accepted')
  assert.equal(workflowDocuments(p.documents, w).find(d => d.id === 'police')!.state, 'reviewed')
})
test('ready snapshot freezes and all material edits invalidate; submissions remain immutable', () => {
  let { p, w } = complete()
  assert.deepEqual(readiness(p, w), [])
  w = transition(w, { type: 'ready' }, 'Broker', p)
  assert.equal(w.stage, 'Ready for insurer')
  const changed = { ...p, draft: { ...p.draft, fields: { ...p.draft.fields, loss: '350' } } }
  assert.equal(transition(w, { type: 'submit' }, 'Broker', changed), w)
  for (const next of [changed, { ...p, options: { repairs: true, identityRequested: false } }, { ...p, documents: p.documents.slice(1) }]) {
    assert.equal(syncPreparation(w, p, next).stage, 'Broker review')
    assert.equal(syncPreparation(w, p, next).ready, undefined)
  }
  assert.equal(syncPreparation(w, p, structuredClone(p)), w)
  w = transition(w, { type: 'submit' }, 'Broker', p)
  assert.equal(w.submissions[0].version, 1)
  p.draft.fields.loss = '999'
  assert.equal(w.submissions[0].preparation.draft.fields.loss, '200.00')
  w = syncPreparation(w, w.submissions[0].preparation, changed)
  w = transition(w, { type: 'ready' }, 'Broker', changed)
  w = transition(w, { type: 'submit' }, 'Broker', changed)
  assert.equal(w.submissions[1].version, 2)
  assert.equal(w.submissions[0].preparation.draft.fields.loss, '200.00')
})
test('illustrative decision has separate amount, no settlement effect and no repeated decision', () => {
  const historical = JSON.stringify({ DEMO_PACK, DEMO_PACK_HASH })
  const { p, w: initial } = complete()
  let w = transition(initial, { type: 'ready' }, 'Broker', p)
  w = transition(w, { type: 'submit' }, 'Broker', p)
  assert.equal(transition(w, { type: 'decide', outcome: 'approved', amountZar: '150' }, 'Shop', p), w)
  assert.equal(transition(w, { type: 'decide', outcome: 'approved', amountZar: 'NaN' }, 'Insurer', p), w)
  const approved = transition(w, { type: 'decide', outcome: 'approved', amountZar: '150' }, 'Insurer', p)
  assert.equal(approved.decision?.amountZar, '150')
  assert.equal(p.draft.fields.loss, '200.00')
  assert.equal(transition(approved, { type: 'decide', outcome: 'rejected' }, 'Insurer', p), approved)
  assert.equal(transition(w, { type: 'decide', outcome: 'rejected' }, 'Insurer', p).decision?.amountZar, undefined)
  assert.equal(JSON.stringify({ DEMO_PACK, DEMO_PACK_HASH }), historical)
})
