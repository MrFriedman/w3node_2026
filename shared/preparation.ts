import { CASE_ID, FIELDS, SAMPLE_INVOICE, type CaseDraft, type Draft, type Field } from './assistant.ts'
import { CLAIM_SOURCE } from './claims.ts'

export const TEMPLATE_VERSION = 'generic-demo-1'
export const CHECKLIST_VERSION = 'small-shop-demo-1'
export const FORM_TITLE = 'Generic claim preparation form — demonstration'
export const FIELD_LABELS: Record<Field, string> = {
  claimant: 'Claimant', policy: 'Policy reference', incident: 'Incident type',
  date: 'Incident date', location: 'Incident location', description: 'Description',
  loss: 'Requested amount (ZAR)', evidence: 'Reported evidence', banking: 'Banking details',
}
export type IncidentType = 'riot' | 'theft' | 'fire'
export type DocumentState = 'missing' | 'placeholder' | 'supplied' | 'reviewed'
export type Attachment = { id: string; title: string; state: DocumentState; content: string | null; source: string }
export type PreparationOptions = { repairs: boolean; identityRequested: boolean }
export const DEFAULT_OPTIONS: PreparationOptions = { repairs: false, identityRequested: false }
const manual = 'https://sasria.co.za/wp-content/uploads/2023/08/Sasria-Agent-Procedure-Manual.pdf'
const faq = 'https://sasria.co.za/claims-and-underwriting/frequently-asked-questions/'
export const FORM_FIXTURE: CaseDraft = {
  fields: {
    claimant: 'FICTIONAL SHOP OWNER', policy: 'DEMO-POLICY-001',
    incident: 'riot', date: '2026-11-13', location: 'FICTIONAL SHOP LOCATION',
    description: 'Fictional stock damage near a reported area incident; cause and coverage require human assessment.',
    loss: '200.00',
  },
  history: [],
}
export function mapForm(draft: CaseDraft) {
  return FIELDS.map(field => {
    const value = field === 'banking' ? null : draft.fields[field] || null
    const proposal = [...draft.history].reverse().find(item => item.fields[field] !== undefined)
    return { field, label: FIELD_LABELS[field], value,
      source: value ? proposal?.source ?? 'Fictional preparation fixture' : 'Unresolved',
      sourceKind: proposal ? 'confirmed-user-entry' : value ? 'fictional-fixture' : 'unknown' }
  })
}
export function incidentType(value?: string): IncidentType | undefined {
  if (/^(riot|unrest|onrus|udushe)$/i.test(value ?? '')) return 'riot'
  if (/^(theft|burglary|diefstal|inbraak|ubusela)$/i.test(value ?? '')) return 'theft'
  if (/^(fire|brand|umlilo)$/i.test(value ?? '')) return 'fire'
}
export function attachments(invoiceReviewed = false): Attachment[] {
  return [
    { id: 'area-alert', title: 'Fictional area incident record', state: 'supplied',
      content: JSON.stringify({ fictional: true, timestamp: '2026-11-13T14:05:00+02:00',
        location: 'FICTIONAL AREA', distance: '300 m', source: CLAIM_SOURCE,
        statement: 'Fictional area alert for demonstration. Corroboration requires human assessment.' }), source: CLAIM_SOURCE },
    { id: 'photos', title: 'Damage photos', state: 'placeholder', content: null, source: 'Three unfilled photo slots' },
    { id: 'invoice', title: 'Fictional stock invoice INV-001', state: invoiceReviewed ? 'reviewed' : 'supplied', content: SAMPLE_INVOICE, source: 'Synthetic invoice fixture' },
    ...['policy', 'premium', 'coupon', 'peril', 'police', 'fire-report', 'quotes', 'identity', 'damage-report'].map(id => ({
      id, title: id, state: 'missing' as const, content: null, source: 'Not supplied',
    })),
  ]
}
export function isSupplied(item?: Attachment) {
  return Boolean(item && item.content?.trim() && (item.state === 'supplied' || item.state === 'reviewed'))
}
export function checklist(draft: CaseDraft, documents: Attachment[], options = DEFAULT_OPTIONS) {
  const type = incidentType(draft.fields.incident)
  const rules = [
    { id: 'policy', title: 'Policy schedule', reason: 'Identify the policy and period of cover.', source: type === 'riot' ? manual : 'Generic demo assumption — confirm with insurer' },
    { id: 'photos', title: 'Damage photos', reason: 'Show the claimed damage. Placeholder slots remain incomplete.', source: 'Generic demo assumption — confirm with insurer' },
    { id: 'invoice', title: 'Stock ownership/value evidence', reason: 'Support the value of claimed stock.', source: 'Generic demo assumption — confirm with insurer' },
  ]
  if (type === 'riot') rules.push(
    { id: 'premium', title: 'Premium payment evidence', reason: 'Support the cover period.', source: faq },
    { id: 'coupon', title: 'Sasria coupon', reason: 'Identify the applicable special-risk cover.', source: manual },
    { id: 'peril', title: 'Peril corroboration for insurer review', reason: 'Media or police evidence may be requested. The sample area alert alone does not establish coverage.', source: manual },
  )
  if (type === 'theft') rules.push({ id: 'police', title: 'Police reference/report', reason: 'Demo theft checklist assumption; insurer must confirm requirements.', source: 'Generic demo assumption — confirm with insurer' })
  if (type === 'fire') rules.push({ id: 'fire-report', title: 'Fire incident report', reason: 'Demo fire checklist assumption; insurer must confirm requirements.', source: 'Generic demo assumption — confirm with insurer' })
  if (options.repairs) rules.push(
    { id: 'quotes', title: 'Repair quotations', reason: 'Conditional on repairs being claimed. Sasria guidance specifies two where applicable.', source: type === 'riot' ? manual : 'Generic demo assumption — confirm with insurer' },
    { id: 'damage-report', title: 'Damage assessment', reason: 'Conditional on repairs; confirm who must assess the loss.', source: 'Generic demo assumption — confirm with insurer' },
  )
  if (options.identityRequested) rules.push({ id: 'identity', title: 'Identity or licence evidence', reason: 'Conditional on the receiving insurer requesting it. Fictional data only.', source: 'Generic demo assumption — confirm with insurer' })
  return rules.map(rule => {
    const document = documents.find(item => item.id === rule.id)
    return { ...rule, state: document?.state ?? 'missing', complete: isSupplied(document) }
  })
}
export function missingSummary(draft: CaseDraft, documents: Attachment[], options = DEFAULT_OPTIONS) {
  const fields = mapForm(draft).filter(item => !item.value && item.field !== 'evidence').map(item => item.label)
  const docs = checklist(draft, documents, options).filter(item => !item.complete)
  const typeNote = incidentType(draft.fields.incident) ? '' : 'Confirm riot, theft or fire to select an incident checklist. '
  return typeNote + 'Unresolved fields: ' + (fields.join(', ') || 'none') +
    '. Evidence to obtain: ' + (docs.map(item => item.title + ' (' + item.state + ')').join(', ') || 'none on this demo checklist') +
    '. The receiving insurer confirms final requirements. Banking stays unresolved in this demo.'
}
export function brokerBrief(draft: CaseDraft, documents: Attachment[], options = DEFAULT_OPTIONS) {
  return 'Demo case ' + CASE_ID + '\n' +
    mapForm(draft).map(item => item.label + ': ' + (item.value ?? 'Unresolved') + ' [source: ' + item.source + ']').join('\n') +
    '\n\n' + missingSummary(draft, documents, options) + '\nSources:\n' + [...new Set(checklist(draft, documents, options).map(item => item.source))].join('\n')
}
export function followUp(draft: CaseDraft, documents: Attachment[], options = DEFAULT_OPTIONS) {
  return 'Draft for manual review — ' + CASE_ID + '\nPlease help complete this fictional case file.\n' +
    missingSummary(draft, documents, options) + '\nPlease confirm the details with the broker before preparing the submission.'
}
/** Sort object keys recursively; arrays retain their deliberate order. */
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']'
  if (value !== null && typeof value === 'object') {
    return '{' + Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
      .map(([key, item]) => JSON.stringify(key) + ':' + canonical(item)).join(',') + '}'
  }
  return JSON.stringify(value)
}
export async function preparePack(draft: CaseDraft, documents: Attachment[], options: PreparationOptions, sha256: (text: string) => Promise<string>) {
  const ordered = [...documents].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  if (new Set(ordered.map(item => item.id)).size !== ordered.length) throw new Error('Duplicate attachment ID')
  const manifest = await Promise.all(ordered.map(async (item, index) => ({
    ...item, index: index + 1, contentHash: item.content === null ? null : await sha256(item.content),
  })))
  const payload = {
    caseId: CASE_ID, title: FORM_TITLE, templateVersion: TEMPLATE_VERSION,
    checklistVersion: CHECKLIST_VERSION, form: mapForm(draft), options,
    checklist: checklist(draft, documents, options), attachments: manifest,
  }
  return { payload, digest: await sha256(canonical(payload)) }
}
