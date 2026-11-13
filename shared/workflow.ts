import type { CaseDraft, Field } from './assistant.ts'
import { canonical, checklist, incidentType, type Attachment, type PreparationOptions } from './preparation.ts'

export type DemoRole = 'Shop' | 'Broker' | 'Insurer'
export type Stage = 'Draft' | 'Broker review' | 'Needs information' | 'Ready for insurer' | 'Submitted for insurer review'
export type BrokerRequest = { id: string; required: boolean; reason: string; response: string; status: 'requested' | 'answered' | 'accepted' | 'clarification needed' }
export type Preparation = { draft: CaseDraft; documents: Attachment[]; options: PreparationOptions }
export type Submission = { version: number; preparation: Preparation; requests: BrokerRequest[] }
export type Workflow = { stage: Stage; requests: BrokerRequest[]; ready?: Submission; submissions: Submission[]; decision?: { version: number; outcome: 'approved' | 'rejected'; amountZar?: string }; notice?: string }
export const newWorkflow = (): Workflow => ({ stage: 'Draft', submissions: [], requests: [{ id: 'police', required: true, reason: 'Please provide the fictional police reference for the theft report. The insurer confirms whether a full report is required.', response: '', status: 'requested' }] })
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))
export function readiness(p: Preparation, w: Workflow): string[] {
  const required: Field[] = ['claimant', 'policy', 'incident', 'date', 'location', 'description', 'loss']
  return [
    ...required.filter(f => !p.draft.fields[f]?.trim()).map(f => `Complete ${f}`),
    ...(!incidentType(p.draft.fields.incident) ? ['Select theft, riot or fire'] : []),
    ...(!/^\d{1,10}(\.\d{1,2})?$/.test(p.draft.fields.loss ?? '') || Number(p.draft.fields.loss) <= 0 ? ['Enter a positive requested amount'] : []),
    ...checklist(p.draft, p.documents, p.options).filter(d => !d.complete).map(d => `Supply demo evidence: ${d.title}`),
    ...w.requests.filter(r => r.required && r.status !== 'accepted').map(r => `Resolve request: ${r.id}`),
  ]
}
export function invalidate(w: Workflow): Workflow {
  return { ...w, ready: undefined, decision: undefined, stage: w.stage === 'Draft' ? 'Draft' : 'Broker review', notice: 'Preparation changed. Renew broker review; earlier submitted versions remain unchanged.' }
}
export function syncPreparation(w: Workflow, before: Preparation, after: Preparation): Workflow {
  return canonical(before) === canonical(after) ? w : invalidate(w)
}
export type Action = { type: 'review' } | { type: 'answer'; id: string; response: string } | { type: 'accept' | 'clarify'; id: string } | { type: 'ready' } | { type: 'submit' } | { type: 'decide'; outcome: 'approved' | 'rejected'; amountZar?: string }
/** Demo-only transitions. No wallet, contract or network effects. */
export function transition(w: Workflow, action: Action, role: DemoRole, p: Preparation): Workflow {
  if (action.type === 'review' && role === 'Shop' && w.stage === 'Draft') return { ...w, stage: 'Broker review', notice: undefined }
  if (action.type === 'answer' && role === 'Shop' && action.response.trim()) {
    const request = w.requests.find(r => r.id === action.id)
    if (!request || !['requested', 'clarification needed'].includes(request.status)) return w
    return { ...invalidate(w), stage: 'Broker review', requests: w.requests.map(r => r.id === action.id ? { ...r, response: action.response.trim().slice(0, 2000), status: 'answered' } : r) }
  }
  if ((action.type === 'accept' || action.type === 'clarify') && role === 'Broker') {
    if (!w.requests.some(r => r.id === action.id && r.status === 'answered')) return w
    return { ...invalidate(w), stage: action.type === 'clarify' ? 'Needs information' : 'Broker review', requests: w.requests.map(r => r.id === action.id ? { ...r, status: action.type === 'accept' ? 'accepted' : 'clarification needed' } : r) }
  }
  if (action.type === 'ready' && role === 'Broker' && ['Broker review', 'Needs information'].includes(w.stage) && !readiness(p, w).length) {
    return { ...w, stage: 'Ready for insurer', notice: undefined, ready: clone({ version: w.submissions.length + 1, preparation: p, requests: w.requests }) }
  }
  if (action.type === 'submit' && role === 'Broker' && w.stage === 'Ready for insurer' && w.ready && canonical(w.ready.preparation) === canonical(p) && !readiness(p, w).length) {
    return { ...w, stage: 'Submitted for insurer review', submissions: [...w.submissions, clone(w.ready)], ready: undefined, notice: 'Simulated submission only. Nothing sent to an insurer.' }
  }
  if (action.type === 'decide' && role === 'Insurer' && w.stage === 'Submitted for insurer review' && !w.decision) {
    if (action.outcome === 'approved' && (!/^\d{1,10}(\.\d{1,2})?$/.test(action.amountZar ?? '') || Number(action.amountZar) <= 0)) return w
    return { ...w, decision: { version: w.submissions.at(-1)!.version, outcome: action.outcome, ...(action.outcome === 'approved' ? { amountZar: action.amountZar } : {}) } }
  }
  return w
}
export function workflowDocuments(documents: Attachment[], w: Workflow): Attachment[] {
  const police = w.requests.find(r => r.id === 'police' && r.status === 'accepted')
  return documents.map(d => d.id === 'police' && police ? { ...d, content: 'Fictional claimant response: ' + police.response, state: 'reviewed', source: 'Accepted by demo broker; authenticity not verified' } : d)
}
