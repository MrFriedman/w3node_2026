
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createHash } from 'node:crypto'
import { CASE_ID, confirmProposal } from '../../shared/assistant.ts'
import { FORM_FIXTURE, DEFAULT_OPTIONS, attachments, mapForm, checklist, preparePack, canonical, brokerBrief, followUp } from '../../shared/preparation.ts'
import { DEMO_PACK_HASH } from '../../shared/claims.ts'
const hash = async (s: string) => createHash('sha256').update(s).digest('hex')
test('form preserves unknown banking and provenance of confirmed corrections', () => {
  assert.equal(mapForm(FORM_FIXTURE).find(r => r.field === 'banking')?.value, null)
  const proposal = { id: 'correction', caseId: CASE_ID, fields: { loss: '250.00' }, source: 'Fictional claimant correction' } as const
  const draft = confirmProposal(FORM_FIXTURE, proposal)
  assert.equal(mapForm(draft).find(r => r.field === 'loss')?.source, proposal.source)
  assert.equal(draft.fields.loss, '250.00')
  assert.equal(confirmProposal(draft, proposal), draft)
  assert.equal(FORM_FIXTURE.fields.loss, '200.00')
})
test('versioned incident rules and conditional requirements', () => {
  for (const [incident, expected] of [['riot', 'coupon'], ['theft', 'police'], ['fire', 'fire-report']]) {
    const draft = { ...FORM_FIXTURE, fields: { ...FORM_FIXTURE.fields, incident } }
    const rules = checklist(draft, attachments())
    assert.ok(rules.some(r => r.id === expected))
    assert.ok(!rules.some(r => r.id === 'quotes'))
    assert.ok(checklist(draft, attachments(), { repairs: true, identityRequested: true }).some(r => r.id === 'identity'))
    assert.ok(checklist(draft, attachments(), { repairs: true, identityRequested: false }).some(r => r.id === 'quotes'))
  }
})
test('placeholder and empty content cannot count as supplied', () => {
  const docs = attachments()
  assert.equal(checklist(FORM_FIXTURE, docs).find(r => r.id === 'photos')?.complete, false)
  docs.find(d => d.id === 'photos')!.content = 'placeholder label'
  assert.equal(checklist(FORM_FIXTURE, docs).find(r => r.id === 'photos')?.complete, false)
  docs.find(d => d.id === 'invoice')!.content = null
  assert.equal(checklist(FORM_FIXTURE, docs).find(r => r.id === 'invoice')?.complete, false)
})
test('digest is deterministic and preserves historic receipt hash', async () => {
  const original = await preparePack(FORM_FIXTURE, attachments(), DEFAULT_OPTIONS, hash)
  const reordered = await preparePack(FORM_FIXTURE, attachments().reverse(), DEFAULT_OPTIONS, hash)
  assert.equal(original.digest, reordered.digest)
  assert.equal(canonical({ b: 2, a: 1 }), canonical({ a: 1, b: 2 }))
  assert.equal(DEMO_PACK_HASH, '0xdc34375fe09d3d54af3c029fbc82c58129f7d06f7ba905577561c0a1ee26a78c')
  assert.notEqual('0x' + original.digest, DEMO_PACK_HASH)
  const docs = attachments()
  docs[0].content += ' changed'
  assert.notEqual((await preparePack(FORM_FIXTURE, docs, DEFAULT_OPTIONS, hash)).digest, original.digest)
  assert.notEqual((await preparePack(FORM_FIXTURE, attachments().slice(1), DEFAULT_OPTIONS, hash)).digest, original.digest)
  assert.notEqual((await preparePack({ ...FORM_FIXTURE, fields: { ...FORM_FIXTURE.fields, loss: '201' } }, attachments(), DEFAULT_OPTIONS, hash)).digest, original.digest)
  assert.notEqual((await preparePack(FORM_FIXTURE, attachments(true), DEFAULT_OPTIONS, hash)).digest, original.digest)
  await assert.rejects(() => preparePack(FORM_FIXTURE, [...attachments(), attachments()[0]], DEFAULT_OPTIONS, hash))
})
test('broker outputs use current draft, gaps, and source links', () => {
  const draft = { ...FORM_FIXTURE, fields: { ...FORM_FIXTURE.fields, loss: '321' } }
  const summary = brokerBrief(draft, attachments(), { repairs: true, identityRequested: false })
  assert.match(summary, /321/)
  assert.match(summary, /Repair quotations/)
  assert.match(summary, /https:\/\/sasria.co.za/)
  assert.match(followUp(draft, attachments()), /manual review/)
  assert.match(followUp(draft, attachments()), /placeholder/)
})
