import { useRef, useState, type ComponentRef } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder } from 'expo-audio'
import { CASE_ID, FIELDS, INVOICE, SAMPLE_INVOICE, LANGUAGES, QUESTIONS, VOICE_SAMPLE, cleanDraft, conflicts, extractFixture, extractInvoice, type CaseDraft, type Draft, type Field, type Language, type Proposal } from '../../shared/assistant.ts'
import { colors, fonts, typography } from './theme'
import { Body, Button, Card, Muted } from './ui'

const server = process.env.EXPO_PUBLIC_ASSISTANT_URL?.replace(/\/$/, '')
export const fieldLabels: Record<Field, string> = { incident: 'Incident type', date: 'Incident date', description: 'What happened', loss: 'Reported loss (ZAR)', evidence: 'Available evidence' }
type Message = { speaker: 'shop' | 'assistant'; text: string; link?: 'Evidence' | 'Settlement' }
type Review = { proposal: Proposal; invoice?: boolean }
export type ChatState = { messages: Message[]; awaiting?: Field; skipped: Field[]; language: Language; text: string; review?: Review; invoiceReviewed?: boolean; resolved?: Field[] }
export const NEW_CHAT: ChatState = { messages: [], skipped: [], language: 'en', text: '' }
const missing = (fields: Draft, skipped: Field[] = []) => FIELDS.find(field => !fields[field] && !skipped.includes(field))

export function AssistantScreen({ chat, update, draft, confirm, onBack, open, payment, refresh, onSelectCase }: {
  chat: ChatState
  update: (fn: (previous: ChatState) => ChatState) => void
  draft: CaseDraft
  confirm: (proposal: Proposal) => void
  onBack: () => void
  open: (section: 'Evidence' | 'Settlement') => void
  payment: string
  refresh: () => Promise<void>
  onSelectCase?: () => void
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [recording, setRecording] = useState(false)
  const [retry, setRetry] = useState('')
  const [transcript, setTranscript] = useState<string>()
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  const counter = useRef(0)
  const busy = useRef(false)
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const id = () => Date.now().toString(36) + '-' + ++counter.current
  const append = (...messages: Message[]) => update(c => ({ ...c, messages: [...c.messages, ...messages] }))
  const say = (text: string, link?: Message['link']) => append({ speaker: 'assistant', text, link })
  const missingEvidence = () => say(draft.fields.evidence
    ? 'Your draft describes available evidence. The sample pack still has placeholder attachments. Check Evidence to see what has actually been supplied.'
    : 'The sample pack has no submitted photos or invoices. Add a note about what you have, or try the sample invoice.', 'Evidence')
  async function send(text = chat.text, retrying = false) {
    const message = text.trim()
    if (!message || busy.current || recording || chat.review) return
    setError(''); setRetry('')
    if (!retrying) {
      append({ speaker: 'shop', text: message })
      update(c => ({ ...c, text: '' }))
    }
    if (/\b(paid|payout|payment|settlement|status|betaal\w*|intlawulo|ndihlawulwe)\b/i.test(message) || /check my claim/i.test(message)) {
      say(payment, 'Settlement'); return
    }
    if (/what.s missing|missing evidence|watter bewyse ontbreek|ubungqina obungekhoyo/i.test(message)) { missingEvidence(); return }
    busy.current = true; setPending(true)
    try {
      const unknown = /^(i don.t know|unknown|ek weet nie|andazi)[.! ]*$/i.test(message)
      let fields: Draft
      if (unknown) fields = {}
      else if (server) {
        const response = await fetch(server + '/intake', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(25000),
          body: JSON.stringify({ caseId: CASE_ID, message, language: chat.language, awaiting: chat.awaiting }),
        })
        if (!response.ok) throw new Error('Unavailable')
        fields = cleanDraft((await response.json()).fields)
      } else fields = extractFixture(message, chat.awaiting)
      const skipped = unknown && chat.awaiting ? [...chat.skipped, chat.awaiting] : chat.skipped
      const next = missing({ ...draft.fields, ...fields }, skipped)
      update(c => ({ ...c, awaiting: next, skipped,
        review: Object.keys(fields).length ? { proposal: { id: id(), caseId: CASE_ID, source: message, fields } } : undefined }))
      say(next ? QUESTIONS[chat.language][next] : 'You can review your draft and check the evidence list.', next ? undefined : 'Evidence')
    } catch {
      setError('Assistant unavailable. Retry or enter the details manually.'); setRetry(message)
    } finally { busy.current = false; setPending(false) }
  }
  function startReport() {
    const next = missing(draft.fields) ?? 'description'
    update(c => ({ ...c, awaiting: next, skipped: [] }))
    say(QUESTIONS[chat.language][next])
  }
  function startReview(fields: Draft, source: string, invoice = false) {
    update(c => ({ ...c, review: { proposal: { id: id(), caseId: CASE_ID, fields, source }, invoice } }))
  }
  function saveReview(review: Review) {
    const fields = cleanDraft(review.proposal.fields)
    if (!Object.keys(fields).length || Object.keys(fields).length !== Object.values(review.proposal.fields).filter(v => v?.trim()).length) {
      setError('Enter a value. Use a decimal amount for rand, such as 200.00.'); return
    }
    if (!review.invoice) confirm({ ...review.proposal, fields })
    update(c => ({ ...c, review: undefined, invoiceReviewed: review.invoice || c.invoiceReviewed, resolved: [], awaiting: review.invoice ? c.awaiting : missing({ ...draft.fields, ...fields }, c.skipped) }))
    setError('')
    say(review.invoice ? 'Sample invoice reviewed. Its purchase date and total are kept as separate evidence.' : 'Draft saved on this device for this demo session.', 'Evidence')
  }
  async function voice() {
    setError('')
    if (busy.current) return
    if (!recording && !server) { setTranscript(VOICE_SAMPLE[chat.language]); return }
    busy.current = true
    try {
      if (!recording) {
        if (!(await AudioModule.requestRecordingPermissionsAsync()).granted) throw new Error('Permission')
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })
        await recorder.prepareToRecordAsync()
        recorder.record()
        setRecording(true)
        return
      }
      setPending(true)
      await recorder.stop()
      setRecording(false)
      if (!recorder.uri) throw new Error('Missing recording')
      const audio = await (await fetch(recorder.uri)).blob()
      const response = await fetch(server + '/transcribe', { method: 'POST', body: audio, signal: AbortSignal.timeout(35000),
        headers: { 'Content-Type': 'application/octet-stream', 'X-Howl-Language': chat.language, 'X-Howl-Audio-Name': Platform.OS === 'web' ? 'voice.webm' : 'voice.m4a' } })
      if (!response.ok) throw new Error('Unavailable')
      const data = await response.json() as { text: string }
      setTranscript(data.text)
    } catch {
      setError('Recording or transcription unavailable. Try the sample transcript or type instead.')
    } finally { busy.current = false; setPending(false) }
  }
  const review = chat.review
  const discrepancies = chat.invoiceReviewed ? conflicts(draft.fields).filter(f => !chat.resolved?.includes(f)) : []
  return <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={s.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to claim" disabled={pending || recording} onPress={onBack} style={s.icon}><Text style={s.iconText}>‹</Text></Pressable>
      <View style={s.flex}><Text accessibilityRole="header" style={s.title}>Ask HowlPay</Text><Muted>{CASE_ID} · Fictional case</Muted></View>
    </View>
    {onSelectCase ? <View style={s.selection}><Body>Choose a case to open its conversation.</Body><Button label={CASE_ID + ' · Small-shop recovery'} onPress={onSelectCase} /></View> : <>
      <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={s.thread} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        <View style={s.row}>{Object.entries(LANGUAGES).map(([key, label]) => <Pressable key={key} accessibilityRole="button" accessibilityState={{ selected: chat.language === key, disabled: pending || recording }}
          disabled={pending || recording} onPress={() => update(c => ({ ...c, language: key as Language }))} style={[s.chip, chat.language === key && s.selected]}><Text style={s.label}>{label}</Text></Pressable>)}</View>
        <View style={s.bubble}><Body>I can help you describe an incident, organise evidence, or check this claim. Use fictional details only.</Body></View>
        {!chat.messages.length && <View style={s.row}>
          <Button label="Report an incident" kind="ghost" onPress={startReport} />
          <Button label="What’s missing?" kind="ghost" onPress={missingEvidence} />
          <Button label="Check my claim" kind="ghost" onPress={() => say(payment, 'Settlement')} />
        </View>}
        {chat.messages.map((item, index) => <View key={index} style={[s.bubble, item.speaker === 'shop' && s.mine]}>
          <Text style={s.label}>{item.speaker === 'shop' ? 'You' : 'HowlPay'}</Text><Body>{item.text}</Body>
          {item.link && <Button label={'Open ' + item.link.toLowerCase()} kind="ghost" onPress={() => open(item.link!)} />}
          {item.link === 'Settlement' && <Button label="Recheck settlement" kind="ghost" onPress={async () => { await refresh(); open('Settlement') }} />}
        </View>)}
        {review && <Card>
          <Text accessibilityRole="header" style={s.title}>{review.invoice ? 'Review sample invoice' : 'Review claim draft'}</Text>
          <Muted>Source · {review.proposal.source}</Muted>
          {review.invoice && <Body>{SAMPLE_INVOICE}</Body>}
          {(review.invoice ? ['date', 'loss'] as const : FIELDS).map(field => <View key={field}>
            <Text style={s.label}>{review.invoice ? field === 'date' ? 'Invoice date' : 'Invoice total (ZAR)' : fieldLabels[field]}</Text>
            <TextInput accessibilityLabel={fieldLabels[field]} style={s.input} maxLength={2000} value={review.proposal.fields[field] ?? ''}
              editable={!review.invoice} placeholder="Unresolved" onChangeText={value => update(c => c.review ? ({ ...c, review: { ...c.review, proposal: {
                ...c.review.proposal, fields: { ...c.review.proposal.fields, [field]: value },
              } } }) : c)} />
          </View>)}
          <Button label={review.invoice ? 'Confirm evidence review' : 'Confirm and save draft'} onPress={() => saveReview(review)} />
          <Button label="Discard proposal" kind="ghost" onPress={() => { setError(''); update(c => ({ ...c, review: undefined, awaiting: missing(draft.fields, c.skipped) })) }} />
        </Card>}
        {discrepancies.map(field => <Card key={field}>
          <Text style={s.label}>{field === 'date' ? 'Dates differ' : 'Amounts differ'}</Text>
          <Body>Claim draft: {draft.fields[field]} · Sample invoice: {INVOICE[field]}</Body>
          <Muted>{field === 'date' ? 'A purchase date can differ from an incident date.' : 'The invoice total can differ from the reported loss.'}</Muted>
          <Button label="Review draft correction" kind="ghost" disabled={Boolean(review)} onPress={() => startReview(draft.fields, 'Claimant correction after reviewing ' + INVOICE.id)} />
          <Button label="Keep both values" kind="ghost" onPress={() => update(c => ({ ...c, resolved: [...(c.resolved ?? []), field] }))} />
        </Card>)}
        {transcript !== undefined && <Card><Text style={s.label}>Review transcript</Text>
          <TextInput accessibilityLabel="Voice transcript" style={s.input} multiline maxLength={2000} value={transcript} onChangeText={setTranscript} />
          <Button label="Use transcript in composer" onPress={() => { update(c => ({ ...c, text: transcript })); setTranscript(undefined) }} />
          <Button label="Discard transcript" kind="ghost" onPress={() => setTranscript(undefined)} />
        </Card>}
        {pending && <Text accessibilityLiveRegion="polite" style={s.label}>Working…</Text>}
        {error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
        {retry ? <Button label="Retry message" kind="ghost" onPress={() => void send(retry, true)} /> : null}
        <View style={s.row}>
          <Button label="Manual draft" kind="ghost" disabled={pending || Boolean(review)} onPress={() => startReview(draft.fields, 'Manual claimant entry')} />
          <Button label="Try sample transcript" kind="ghost" disabled={pending || recording} onPress={() => setTranscript(VOICE_SAMPLE[chat.language])} />
        </View>
      </ScrollView>
      <View style={s.composer}>
        <Pressable accessibilityRole="button" accessibilityLabel="Add sample invoice" disabled={pending || recording || Boolean(review)} style={s.icon}
          onPress={() => startReview(extractInvoice(SAMPLE_INVOICE), INVOICE.id, true)}><Text style={s.iconText}>＋</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={recording ? 'Stop recording' : server ? 'Record voice note' : 'Open sample voice transcript'}
          disabled={pending} style={[s.icon, recording && s.selected]} onPress={() => void voice()}><Text style={s.label}>{recording ? 'Stop' : 'Voice'}</Text></Pressable>
        <TextInput accessibilityLabel="Message" placeholder="Message HowlPay" style={[s.input, s.flex, s.messageInput]} multiline maxLength={2000} value={chat.text}
          onChangeText={text => update(c => ({ ...c, text }))} />
        <Pressable accessibilityRole="button" accessibilityLabel="Send message" accessibilityState={{ disabled: pending || recording || !chat.text.trim() || Boolean(review) }}
          disabled={pending || recording || !chat.text.trim() || Boolean(review)} onPress={() => void send()} style={[s.icon, s.send]}><Text style={s.iconText}>↑</Text></Pressable>
      </View>
    </>}
  </KeyboardAvoidingView>
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper }, flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderBottomWidth: 1, borderColor: colors.line },
  title: { fontFamily: fonts.heading, fontSize: 22, color: colors.ink },
  selection: { padding: 20, gap: 12 },
  thread: { padding: 16, gap: 14, width: '100%', maxWidth: 760, alignSelf: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 24, backgroundColor: colors.soft },
  selected: { backgroundColor: colors.amberLight, borderWidth: 1, borderColor: colors.amberDark },
  bubble: { maxWidth: '88%', alignSelf: 'flex-start', borderRadius: 18, padding: 14, gap: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.amberLight },
  label: { ...typography.label, color: colors.ink },
  error: { ...typography.caption, color: colors.red },
  input: { ...typography.body, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, color: colors.ink, padding: 10 },
  messageInput: { maxHeight: 120, minWidth: 0 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, padding: 8, borderTopWidth: 1, borderColor: colors.line },
  icon: { minWidth: 48, minHeight: 48, padding: 4, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.soft },
  iconText: { fontSize: 26, color: colors.ink }, send: { backgroundColor: colors.amber },
})
