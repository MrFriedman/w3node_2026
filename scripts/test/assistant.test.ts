import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CASE_ID, EMPTY_DRAFT, SAMPLE_INVOICE, VOICE_SAMPLE, cleanDraft, confirmProposal, conflicts, extractFixture, extractInvoice } from '../../shared/assistant.ts'

for (const [language, message] of Object.entries(VOICE_SAMPLE)) {
  test('fictional intake in ' + language, () => {
    const fields = extractFixture(message, 'incident')
    assert.equal(fields.date, '2026-11-13')
    assert.equal(fields.loss, '200')
    assert.equal(fields.description, message)
    assert.ok(fields.evidence)
  })
}
test('unknown and invalid input stays unresolved', () => {
  assert.deepEqual(extractFixture('andazi', 'date'), {})
  assert.deepEqual(cleanDraft({ loss: 'R200', approved: true, payout: 'send' }), {})
})
test('confirmation is idempotent and preserves original source', () => {
  const proposal = { id: 'one', caseId: CASE_ID, fields: { loss: '200' }, source: 'I lost R200' } as const
  const draft = confirmProposal(EMPTY_DRAFT, proposal)
  assert.equal(draft.history[0].source, proposal.source)
  assert.equal(confirmProposal(draft, proposal), draft)
  const correction = confirmProposal(draft, { ...proposal, id: 'two', fields: { loss: '180' } })
  assert.equal(correction.fields.loss, '180')
  assert.equal(correction.history.length, 2)
})
test('invoice extraction does not treat purchase date or total as claimant facts', () => {
  assert.deepEqual(extractInvoice(SAMPLE_INVOICE), { date: '2026-11-12', loss: '180.00' })
  assert.deepEqual(conflicts({ date: '2026-11-13', loss: '200' }), ['date', 'loss'])
  assert.deepEqual(conflicts({ loss: '180' }), [])
})
