import { useEffect, useRef, useState, type ComponentRef } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { CASE_ID, confirmProposal, type Proposal } from '../../shared/assistant.ts'
import { FORM_FIXTURE, DEFAULT_OPTIONS, attachments, checklist, mapForm, type Attachment, type PreparationOptions } from '../../shared/preparation.ts'
import { newWorkflow, readiness, syncPreparation, transition, workflowDocuments, type Action, type DemoRole, type Preparation } from '../../shared/workflow.ts'
import { PRODUCT_NAME } from '../../shared/brand.ts'
import { PreparationScreen } from './PreparationScreen'
import { AssistantScreen, NEW_CHAT } from './AssistantScreen'
import { RequestView } from './RequestView'
import { ProgressView } from './ProgressView'
import { Banner, Body, Button, Card, Muted, Title } from './ui'
import { colors, fonts, typography } from './theme'

type Destination = 'Claim' | 'Requests' | 'Progress'
export function ClaimScreen({ onHome }: { onHome?: () => void }) {
  const [state, setState] = useState(() => ({ draft: FORM_FIXTURE, documents: attachments(), options: DEFAULT_OPTIONS, workflow: newWorkflow() }))
  const [role, setRole] = useState<DemoRole>('Shop')
  const [tab, setTabState] = useState<Destination>('Claim')
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  function setTab(next: Destination) { setTabState(next); scroll.current?.scrollTo({ y: 0, animated: false }) }
  const [chat, setChat] = useState(NEW_CHAT)
  const [help, setHelp] = useState(false)
  const [locked, setLocked] = useState(false)
  const [controls, setControls] = useState(false)
  const [form, setForm] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const { draft, options, workflow } = state
  const documents = workflowDocuments(state.documents.map(d => d.id === 'invoice' && chat.invoiceReviewed ? { ...d, state: 'reviewed' as const } : d), workflow)
  const preparation: Preparation = { draft, options, documents }
  const gaps = readiness(preparation, workflow)
  const unresolved = workflow.requests.filter(r => r.status !== 'accepted')
  function change(next: Partial<Preparation>) {
    setState(s => {
      const before = { draft: s.draft, options: s.options, documents: workflowDocuments(s.documents, s.workflow) }
      const after = { ...before, ...next }
      return { ...s, ...next, workflow: syncPreparation(s.workflow, before, after) }
    })
  }
  useEffect(() => {
    if (chat.invoiceReviewed && state.documents.find(d => d.id === 'invoice')?.state !== 'reviewed') change({ documents: state.documents.map(d => d.id === 'invoice' ? { ...d, state: 'reviewed' } : d) })
  }, [chat.invoiceReviewed])
  function confirm(proposal: Proposal) { change({ draft: confirmProposal(draft, proposal) }) }
  function act(action: Action) { setState(s => ({ ...s, workflow: transition(s.workflow, action, role, { ...preparation, draft: s.draft, options: s.options, documents: workflowDocuments(s.documents, s.workflow) }) })) }
  function supply(d: Attachment) { change({ documents: state.documents.map(item => item.id === d.id ? { ...item, state: 'supplied', content: `FICTIONAL DEMO ${item.title}: synthetic supporting record for the preparation walkthrough. Not a real document or verified evidence.`, source: 'Explicitly added synthetic demo fixture' } : item) }) }
  function reset() { setState({ draft: FORM_FIXTURE, documents: attachments(), options: DEFAULT_OPTIONS, workflow: newWorkflow() }); setChat(NEW_CHAT); setRole('Shop'); setTab('Claim'); setHelp(false); setForm(false); setResetKey(k => k + 1) }
  const next = workflow.decision ? 'Review the illustrative outcome in Progress. No payout has been made.' : workflow.stage === 'Submitted for insurer review' ? 'Insurer: review the frozen simulated submission in Progress.' : workflow.stage === 'Ready for insurer' ? 'Broker: submit the frozen version for simulated insurer review.' : unresolved.some(r => r.status === 'answered') ? 'Broker: review the shop response in Requests.' : unresolved.length ? 'Shop: answer the police-reference request. Broker then reviews the file.' : 'Broker: check confirmed answers and remaining evidence, then mark ready.'
  return <View style={s.root}>
    <View style={s.header}><Text style={s.brand}>{PRODUCT_NAME} <Text style={{ color: colors.amber }}>●</Text></Text><Button label="Demo controls" kind="ghost" disabled={locked} onPress={() => setControls(!controls)} /></View>
    <View style={s.notice}><Text style={s.label}>FICTIONAL DEMO · {role} view</Text><Muted>Session only · reload clears progress</Muted></View>
    {controls && <View style={s.controls}><Muted>Role switching is a demo control, not authentication.</Muted><View style={s.row}>{(['Shop', 'Broker', 'Insurer'] as const).map(r => <Button key={r} label={r} kind={role === r ? 'primary' : 'ghost'} onPress={() => { setRole(r); setControls(false) }} />)}</View><Button label="Reset fictional demo" kind="ghost" onPress={reset} />{onHome && <Button label="Back to HowlPay introduction" kind="ghost" onPress={onHome} />}</View>}
    <View style={[s.root, !help && { display: 'none' }]}><AssistantScreen key={'assistant-' + resetKey} chat={chat} update={setChat} draft={draft} documents={documents} confirm={confirm} onBack={() => setHelp(false)} open={section => { setHelp(false); if (section === 'Settlement') setTab('Progress'); else { setTab('Claim'); setForm(true) } }} payment="This fictional theft claim has no payout. Progress contains a separate historical testnet example; it does not pay this claim." refresh={async () => { setHelp(false); setTab('Progress') }} role={role} options={options} onBusyChange={setLocked} /></View>
    <ScrollView ref={scroll} key={resetKey} style={[s.root, help && { display: 'none' }]} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {workflow.notice && <Banner tone="notice">{workflow.notice}</Banner>}
      {tab === 'Claim' && <>
        <Text accessibilityRole="header" style={s.title}>Your theft claim</Text><Muted>{CASE_ID} · Alex, your fictional broker</Muted>
        <Card><Text style={s.label}>NEXT ACTION</Text><Body>{next}</Body><Button label={unresolved.length ? 'Open requests' : 'View progress'} onPress={() => setTab(unresolved.length ? 'Requests' : 'Progress')} /></Card>
        <Card><Title>Stock stolen from the shop</Title><Body>Requested loss · R{draft.fields.loss ?? 'unresolved'}</Body><Body>Preparation · {workflow.stage}</Body><Muted>{draft.fields.description}</Muted><Body>{unresolved.length} outstanding request{unresolved.length === 1 ? '' : 's'} · No payout</Body><Muted>The insurer decides coverage and payment. Your broker helps prepare the file.</Muted>
          <Button label="Help me answer" kind="ghost" onPress={() => setHelp(true)} />
          {role === 'Shop' && workflow.stage === 'Draft' && <Button label="Ask broker to review demo" onPress={() => act({ type: 'review' })} />}
        </Card>
        {role === 'Broker' && <Card><Title>Broker review</Title><Muted>Confirmed answers and fixture values; none establishes coverage.</Muted>
          {mapForm(draft).filter(r => r.field !== 'banking').map(r => <View key={r.field}><Body>{r.label}: {r.value ?? 'Unresolved'}</Body><Muted>{r.source}</Muted></View>)}
          <Body>Readiness checks</Body>{gaps.length ? gaps.map(g => <Muted key={g}>• {g}</Muted>) : <Muted>Required demo fields and evidence supplied; required requests accepted.</Muted>}
          <Muted>Banking remains unresolved. Insurer-specific forms, evidence and acceptance still require confirmation.</Muted>
          <Button label="Mark ready for insurer" disabled={gaps.length > 0 || !['Broker review', 'Needs information'].includes(workflow.stage)} onPress={() => act({ type: 'ready' })} />
          {workflow.stage === 'Ready for insurer' && <Button label="Simulate submission to insurer" onPress={() => { act({ type: 'submit' }); setTab('Progress') }} />}
        </Card>}
        {role !== 'Insurer' && <>
          <Button label={form ? 'Hide form and evidence' : 'Review form and evidence'} kind="ghost" onPress={() => setForm(!form)} />
          <View style={!form ? { display: 'none' } : undefined}>
            <View style={{ gap: 12, marginBottom: 16 }}><Title>Demo evidence</Title><Muted>Add synthetic records to complete the walkthrough. No real uploads or verification. The receiving insurer determines final requirements.</Muted>
              {checklist(draft, documents, options).map(item => <Card key={item.id}><Body>{item.title} · {item.state}</Body>{!item.complete && item.id !== 'police' && <Button label={'Add fictional ' + item.title.toLowerCase()} kind="ghost" onPress={() => supply(documents.find(d => d.id === item.id)!)} />}{item.id === 'police' && !item.complete && <Button label="Resolve police request" kind="ghost" onPress={() => setTab('Requests')} />}</Card>)}
            </View>
            <PreparationScreen key={resetKey} draft={draft} documents={documents} options={options} setOptions={(value: PreparationOptions) => change({ options: value })} confirm={confirm} broker={role === 'Broker'} />
          </View>
        </>}
      </>}
      <View style={tab !== 'Requests' ? { display: 'none' } : undefined}><RequestView key={resetKey} workflow={workflow} role={role} act={act} help={() => { setChat(c => ({ ...c, messages: [...c.messages, { speaker: 'assistant', text: 'Your broker needs the police reference and report date. For this fictional walkthrough, you can enter DEMO-CAS-123, reported 13 Nov, in Requests. In a real claim, use the actual reference or tell the broker it is unavailable. I cannot send or accept a broker response for you.' }] })); setHelp(true) }} /></View>
      <View style={tab !== 'Progress' ? { display: 'none' } : undefined}><ProgressView key={resetKey} workflow={workflow} role={role} act={act} /></View>
    </ScrollView>
    <View style={s.tabs} accessibilityRole="tablist">{(['Claim', 'Requests', 'Progress'] as const).map(name => <Pressable key={name} accessibilityRole="tab" accessibilityState={{ selected: tab === name && !help, disabled: locked }} disabled={locked} onPress={() => { setTab(name); setHelp(false) }} style={[s.tab, tab === name && !help && s.selected]}><Text style={[s.label, tab === name && !help && { color: colors.paper }]}>{name}</Text></Pressable>)}</View>
  </View>
}
const s = StyleSheet.create({ root: { flex: 1 }, header: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderBottomWidth: 1, borderColor: colors.line }, brand: { fontFamily: fonts.heading, fontSize: 25, color: colors.ink }, notice: { paddingHorizontal: 16, paddingVertical: 8, gap: 4, backgroundColor: colors.amberLight }, label: { ...typography.label, color: colors.ink }, controls: { padding: 16, gap: 8 }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, content: { padding: 16, gap: 16, width: '100%', maxWidth: 720, alignSelf: 'center', paddingBottom: 36 }, title: { ...typography.heading, fontSize: 32, lineHeight: 40, color: colors.ink }, tabs: { flexDirection: 'row', padding: 8, gap: 4, borderTopWidth: 1, borderColor: colors.line }, tab: { flex: 1, minHeight: 52, padding: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }, selected: { backgroundColor: colors.ink } })
