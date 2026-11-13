export const CASE_ID = 'CLM–001'
export const LANGUAGES = { en: 'English', af: 'Afrikaans', xh: 'isiXhosa' } as const
export type Language = keyof typeof LANGUAGES
export const FIELDS = ['claimant', 'policy', 'incident', 'date', 'location', 'description', 'loss', 'evidence', 'banking'] as const
export type Field = typeof FIELDS[number]
export type Draft = Partial<Record<Field, string>>
export type Proposal = { id: string; caseId: typeof CASE_ID; fields: Draft; source: string }
export type CaseDraft = { fields: Draft; history: Proposal[] }
export const EMPTY_DRAFT: CaseDraft = { fields: {}, history: [] }
export const SAMPLE_INVOICE = 'Fictional stock invoice INV-001\nPurchase date: 2026-11-12\nTotal: R180.00'
export function extractInvoice(source: string): Draft {
  return cleanDraft({
    date: /^Purchase date: (\d{4}-\d{2}-\d{2})$/m.exec(source)?.[1],
    loss: /^Total: R(\d+(?:\.\d{2})?)$/m.exec(source)?.[1],
  })
}
export const INVOICE = { ...extractInvoice(SAMPLE_INVOICE), id: 'Sample invoice INV-001' }
export const VOICE_SAMPLE: Record<Language, string> = {
  en: 'There was a fire on 2026-11-13. I lost R200 of stock. I have a photo and an invoice.',
  af: 'Daar was ’n brand op 2026-11-13. Ek het R200 se voorraad verloor. Ek het ’n foto en ’n faktuur.',
  xh: 'Bekukho umlilo ngomhla we-2026-11-13. Ndilahlekelwe sisitokhwe se-R200. Ndinefoto ne-invoyisi.',
}
export const QUESTIONS: Record<Language, Record<Field, string>> = {
  en: { claimant: 'What fictional claimant name should we use?', policy: 'What fictional policy reference should we use?', location: 'Where did the incident happen? Use a fictional location.', banking: 'Banking details remain unresolved in this demo.', incident: 'What happened at your shop?', date: 'When did it happen? An approximate date is fine.', description: 'Can you describe the incident?', loss: 'What was the estimated loss in rand?', evidence: 'What evidence do you have, such as photos or invoices?' },
  af: { claimant: 'Watter fiktiewe naam moet ons gebruik?', policy: 'Wat is die fiktiewe polisnommer?', location: 'Waar het dit gebeur? Gebruik ’n fiktiewe plek.', banking: 'Bankbesonderhede bly onopgelos in hierdie demo.', incident: 'Wat het by jou winkel gebeur?', date: 'Wanneer het dit gebeur? ’n Geskatte datum is reg.', description: 'Kan jy die voorval beskryf?', loss: 'Wat was die geskatte verlies in rand?', evidence: 'Watter bewyse het jy, soos foto’s of fakture?' },
  xh: { claimant: 'Leliphi igama eliyintsomi esinokulisebenzisa?', policy: 'Ithini inombolo yepolisi eyintsomi?', location: 'Kwenzeke phi? Sebenzisa indawo eyintsomi.', banking: 'Iinkcukacha zebhanki azifakwanga kule demo.', incident: 'Kwenzeke ntoni evenkileni yakho?', date: 'Kwenzeke nini? Umhla oqikelelweyo ulungile.', description: 'Ungasichaza isiganeko?', loss: 'Ilahleko eqikelelweyo ibingakanani ngeerandi?', evidence: 'Bubuphi ubungqina onabo, njengeefoto okanye ii-invoyisi?' },
}
export function cleanDraft(input: unknown): Draft {
  if (!input || typeof input !== 'object') return {}
  const result: Draft = {}
  for (const field of FIELDS) {
    if (field === 'banking') continue
    const value = (input as Draft)[field]
    if (typeof value !== 'string' || value.length > 2000 || !value.trim()) continue
    if (field === 'loss' && !/^\d{1,10}(\.\d{1,2})?$/.test(value.trim())) continue
    result[field] = value.trim()
  }
  return result
}

export function isQuestionOrRequest(message: string) {
  return /[?？]|^(what|why|how|when|where|who|can|could|would|should|please|help|show|explain|tell|ignore|send|approve|reject|cancel|refund|delete|remove|transfer|pay|submit|upload|download|change|update|wat|waarom|hoe|wanneer|waar|kan|wys|ndicela|yintoni|kutheni|njani|nini|phi|ngubani)\b/i.test(message.trim())
}

export function extractFixture(message: string, awaiting?: Field): Draft {
  if (isQuestionOrRequest(message)) return {}
  if (/^(i don.t know|unknown|ek weet nie|andazi)[.! ]*$/i.test(message.trim())) return {}
  const incident = /\b(riot|unrest|onrus|udushe|fire|brand|umlilo|flood|vloed|izikhukula|theft|diefstal|ubusela|burglary|inbraak)\b/i.exec(message)?.[0]
  const date = /\b\d{4}-\d{2}-\d{2}\b/.exec(message)?.[0]
  const loss = /(?:\bR\s*|\bZAR\s*)(\d+(?:[.,]\d{1,2})?)/i.exec(message)?.[1]
  const evidence = /\b(photo\w*|foto\w*|ndinefoto|invoice\w*|faktuur|invoyisi)\b/i.test(message)
  const fields = cleanDraft({
    incident, date, loss: loss?.replace(',', '.'),
    description: awaiting === 'description' || incident && (!awaiting || awaiting === 'incident') ? message : undefined,
    evidence: evidence || awaiting === 'evidence' ? message : undefined,
  })
  if (awaiting === 'date' && !date && /^(yesterday|today|last |about |gister|vandag|izolo|namhlanje)/i.test(message)) fields.date = message
  if (awaiting && ['claimant', 'policy', 'location'].includes(awaiting)) fields[awaiting] = message
  if (awaiting === 'loss' && !loss) fields.loss = cleanDraft({ loss: message.replace(',', '.') }).loss
  return cleanDraft(fields)
}

export function confirmProposal(draft: CaseDraft, proposal: Proposal): CaseDraft {
  if (proposal.caseId !== CASE_ID || draft.history.some(item => item.id === proposal.id)) return draft
  const fields = cleanDraft(proposal.fields)
  if (!Object.keys(fields).length) return draft
  return { fields: { ...draft.fields, ...fields }, history: [...draft.history, { ...proposal, fields }] }
}

// Compare only fields with the same meaning. Invoice values describe a purchase.
export function conflicts(fields: Draft, previous?: Draft): Field[] {
  if (!previous) return []
  return FIELDS.filter(field => fields[field] && previous[field] && (
    field === 'loss' ? Number(fields[field]) !== Number(previous[field]) : fields[field] !== previous[field]
  ))
}
