import { useEffect, useRef, useState, type ComponentRef } from 'react'
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { CLAIM_SOURCE, CLAIM_TOKEN, DEMO_ESCROW, DEMO_PACK, DEMO_PACK_HASH, receiptAfterFailure, type ReceiptViewState } from '../../shared/claims.ts'
import { PRODUCT_NAME } from '../../shared/brand.ts'
import { isTxHash } from '../../shared/money.ts'
import { CHECKPOINT_FX_NOTE } from '../../shared/network.ts'
import { readDemoClaim } from './claim-receipt'
import { colors, fonts, radius, spacing, typography } from './theme'
import { Banner, Body, Button, Card, Muted } from './ui'

type Role = 'Insurer' | 'Platform' | 'Shop'
type Section = 'Overview' | 'Evidence' | 'Decision' | 'Settlement'
const sections: Section[] = ['Overview', 'Evidence', 'Decision', 'Settlement']
const evidence = [
  { title: 'Incident corroboration', kind: 'Sample incident', detail: 'Fictional alert at 14:05, 300 m from the shop. A real record would include the date, location, source and human verification history. None is connected in this demo.' },
  { title: 'Photo 01 · Shop exterior', kind: 'Photo placeholder', detail: 'Would document visible damage and its context. No photograph has been uploaded; date, location and authenticity have not been checked.' },
  { title: 'Photo 02 · Affected stock', kind: 'Photo placeholder', detail: 'Would show the affected stock. No photograph has been uploaded and no loss has been assessed.' },
  { title: 'Photo 03 · Incident detail', kind: 'Photo placeholder', detail: 'Would add supporting detail for human review. No photograph has been uploaded or verified.' },
  { title: 'Invoice 01 · Stock purchase', kind: 'Invoice placeholder', detail: 'Would support stock ownership and purchase value. No invoice is attached; supplier, date and amounts remain unverified.' },
  { title: 'Invoice 02 · Stock purchase', kind: 'Invoice placeholder', detail: 'Would provide additional purchase evidence. No invoice is attached and no coverage decision can be inferred.' },
]
const txLabels = {
  'not-requested': '', unknown: 'Unknown hash · no transaction was found. This is not confirmation of a pending payment.',
  unavailable: 'Transaction found, but its mined receipt is unavailable. Retry verification; this is not a pending confirmation.',
  unrelated: 'Unrelated transaction · this hash is not a successful event for this sample claim.',
  pending: 'Contract transaction pending · not evidence that this claim has changed.',
  reverted: 'Contract transaction reverted · no successful claim change is established by this hash.',
  confirmed: 'Matching claim transaction mined successfully. Finality has not been checked.',
}
function Label({ children }: { children: React.ReactNode }) { return <Text style={s.eyebrow}>{children}</Text> }
function Heading({ children }: { children: React.ReactNode }) { return <Text accessibilityRole="header" style={s.heading}>{children}</Text> }
function Badge({ children, good = false }: { children: React.ReactNode; good?: boolean }) {
  return <View style={[s.badge, good && s.badgeGood]}><Text style={[s.badgeText, good && s.goodText]}>{children}</Text></View>
}
function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
    style={[s.choice, selected && s.choiceOn]}><Text style={[s.choiceText, selected && s.choiceTextOn]}>{label}</Text></Pressable>
}

export function ClaimScreen() {
  const [tab, setTab] = useState<'Claims' | 'Activity'>('Claims')
  const [detail, setDetail] = useState(false)
  const [section, setSection] = useState<Section>('Overview')
  const [role, setRole] = useState<Role>('Insurer')
  const [panel, setPanel] = useState(false)
  const [technical, setTechnical] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [view, setView] = useState<ReceiptViewState>({ snapshot: null, refresh: 'idle' })
  const [hash, setHash] = useState('')
  const [copied, setCopied] = useState('')
  const [simulatedClaim, setSimulatedClaim] = useState<string | null>(null)
  const [walkthrough, setWalkthrough] = useState<'closed' | 'review' | 'handoff' | 'cancelled' | 'rejected'>('closed')
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  const busy = useRef(false)
  const claim = view.snapshot?.claim
  const loading = view.refresh === 'loading'
  const invalid = Boolean(hash.trim() && !isTxHash(hash.trim()))
  const status = claim?.state === 'paid' ? 'Test-token settlement confirmed' : claim?.state === 'opened' ? 'Opened · awaiting insurer decision' :
    claim?.state === 'rejected' ? 'Rejected · no token payout' : view.snapshot ? 'Not opened on Sepolia' : 'Settlement not yet verified'
  async function refresh(submitted = '') {
    if (busy.current) return
    busy.current = true
    setView(v => ({ ...v, refresh: 'loading', error: undefined }))
    try { const snapshot = await readDemoClaim(submitted); setView({ snapshot, refresh: 'idle' }) }
    catch { setView(v => receiptAfterFailure(v, 'Sepolia could not be reached or its evidence could not be verified.')) }
    finally { busy.current = false }
  }
  useEffect(() => { void refresh() }, [])
  function navigate(next: Section) { setDetail(true); setSection(next); scroll.current?.scrollTo({ y: 0, animated: false }) }
  async function copy(label: string, value: string) {
    try { await Clipboard.setStringAsync(value); setCopied(`${label} copied`) } catch { setCopied('Copy unavailable. Select the value to copy it.') }
  }
  const notices = <>
    {view.refresh === 'error' && <Banner tone="notice">{view.error} {view.snapshot ? 'Showing a stale, previously verified receipt.' : 'No verified receipt is available.'}</Banner>}
    {view.snapshot && <Muted>Last verified {new Date(view.snapshot.checkedAt).toLocaleTimeString()} · block {view.snapshot.blockNumber}{view.refresh === 'error' ? ' · STALE' : ''}</Muted>}
  </>
  const technicalDetails = <View style={s.stack}>
    <Muted>{CHECKPOINT_FX_NOTE}</Muted>
    <Body>{DEMO_PACK.amountUsdt} test USD₮ · Ethereum Sepolia · 11155111</Body>
    {[
      ['Token', CLAIM_TOKEN], ['Payee', DEMO_PACK.shopAddress], ['Escrow', DEMO_ESCROW], ['Pack SHA-256', DEMO_PACK_HASH],
      ...(claim ? [['Opened transaction', claim.openTxHash]] : []),
      ...(claim?.decisionTxHash ? [['Decision transaction', claim.decisionTxHash]] : []),
    ].map(([label, value]) => <View key={label} style={s.technicalRow}>
      <Label>{label}</Label><Text selectable style={s.hash}>{value}</Text>
      <Button label={`Copy ${label.toLowerCase()}`} kind="ghost" onPress={() => void copy(label, value)} />
    </View>)}
    {copied ? <Text accessibilityLiveRegion="polite" style={s.caption}>{copied}</Text> : null}
  </View>
  return <View style={s.root}>
    <View style={s.header}><View><Text style={s.wordmark}>{PRODUCT_NAME}<Text style={s.dot}> ●</Text></Text><Text style={s.headerSub}>CLAIMS WORKSPACE</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Demo settings and operator instructions" accessibilityState={{ expanded: panel }} onPress={() => { setPanel(!panel); scroll.current?.scrollTo({ y: 0, animated: false }) }} style={s.demoButton}><Text style={s.choiceText}>Demo {panel ? '−' : '+'}</Text></Pressable>
    </View>
    <ScrollView ref={scroll} style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <View style={s.context}><Text style={s.contextText}>SEPOLIA TESTNET</Text><Text style={s.caption}>{role === 'Insurer' ? 'Claims operator' : role === 'Shop' ? 'Shop view' : 'Platform view'}</Text></View>
      {panel && <Card>
        <Heading>Demo controls</Heading><Muted>Role switching is a presentation tool, not authentication. One test wallet performs all roles in the recorded payment.</Muted>
        <View style={s.wrap}>{(['Insurer', 'Platform', 'Shop'] as Role[]).map(r => <Choice key={r} label={r} selected={r === role} onPress={() => { setRole(r); if (r === 'Shop' && section === 'Decision') setSection('Overview') }} />)}</View>
        <Muted>Synthetic evidence is bundled with this prototype. There is no private storage service, live insurer, or connected incident feed.</Muted>
        <Label>Operator signing · terminal only</Label>
        <Muted>Run from scripts/. Commands below quote by default. Review the payee, amount, fee and network before a separately authorised signing step. This existing claim cannot be opened or paid again.</Muted>
        <Text selectable style={s.code}>npm run claim -- read</Text>
        {claim?.state === 'opened' ? <>
          <Text selectable style={s.code}>npm run claim -- release --claim {claim.claimId}</Text>
          <Text selectable style={s.code}>npm run claim -- reject --claim {claim.claimId}</Text>
          <Muted>Only the insurer can sign a release or rejection. Cancel leaves the claim unchanged. Use --approve only for an intentionally authorised action.</Muted>
        </> : <Muted>No release action is available for this claim. A fresh case requires a distinct pack and a separately authorised transaction.</Muted>}
        <Button label="Close demo controls" kind="ghost" onPress={() => setPanel(false)} />
      </Card>}
      {tab === 'Claims' ? <>
        {!detail ? <>
          <Text accessibilityRole="header" style={s.title}>{role === 'Shop' ? 'Your recovery' : 'Claims'}</Text>
          <Body>{role === 'Shop' ? 'Follow your sample claim and its next step.' : 'A clear path from evidence to settlement.'}</Body>
          <View style={s.sectionHeading}><Label>{role === 'Shop' ? 'YOUR CASE FILE' : 'CASE FILES'}</Label><Muted>1 fictional case</Muted></View>
          <View style={s.claimCard}>
            <View style={s.wrap}><Label>CLM–001</Label><Badge>Fictional evidence</Badge></View>
            <Text style={s.caseTitle}>Small-shop recovery</Text>
            <Text style={s.amount}>R200<Text style={s.cents}>.00</Text></Text>
            <Muted>Requested amount · illustrative case</Muted>
            <View style={s.divider} />
            <Badge good={claim?.state === 'paid'}>{status}</Badge>
            <Muted>1 sample incident · 3 photo placeholders · 2 invoice placeholders</Muted>
            <Button label={role === 'Shop' ? 'View claim progress →' : 'Review claim →'} onPress={() => navigate('Overview')} />
          </View>
          {notices}
          <Button label={loading ? 'Verifying settlement…' : view.refresh === 'error' ? 'Retry verification' : 'Refresh settlement'} kind="ghost" disabled={loading} onPress={() => void refresh()} />
          <View style={s.note}><Label>BUILT AROUND A HUMAN DECISION</Label><Muted>Evidence supports assessment. The insurer decides the claim under the policy; the contract records and enforces the token payout.</Muted></View>
        </> : <>
          <Button label="← All claims" kind="ghost" onPress={() => { setDetail(false); scroll.current?.scrollTo({ y: 0 }) }} />
          <Label>CLM–001 · FICTIONAL CASE</Label><Heading>Small-shop recovery</Heading>
          <View style={s.wrap}><Text style={s.detailAmount}>R200.00</Text><Badge good={claim?.state === 'paid'}>{claim?.state === 'paid' ? 'Test tokens released' : status}</Badge></View>
          <View style={s.sectionNav}>{sections.filter(x => role !== 'Shop' || x !== 'Decision').map(x => <Choice key={x} label={x} selected={section === x} onPress={() => navigate(x)} />)}</View>
          {(section === 'Overview' || role === 'Shop' && section === 'Decision') && <>
            <Card><Label>CLAIM SUMMARY</Label><Body>Incident near the shop</Body><Muted>Sample alert · 14:05 · 300 m away. The date, cause of loss and coverage have not been established by this fictional pack.</Muted>
              <View style={s.divider} /><Body>Evidence needs human review</Body><Muted>Five attachment slots are placeholders, not submitted documents. This is not a complete, validated insurance claim.</Muted>
              <Button label="Inspect the evidence →" onPress={() => navigate('Evidence')} />
            </Card>
            <Card><Label>PROGRESS</Label><Body>01 · Evidence assembled for demonstration</Body><Muted>Fictional incident and attachment placeholders.</Muted><Body>02 · Human decision</Body><Muted>{claim?.state === 'paid' ? 'An existing insurer-authorised test release is recorded on Sepolia. This does not validate the fictional evidence.' : 'A human insurer must assess coverage before authorising payment.'}</Muted><Body>03 · Settlement</Body><Muted>{status}</Muted><Body>04 · Rand delivery</Body><Muted>Simulation only. No money has reached a bank or mobile-money account.</Muted><Button label="View shared settlement →" kind="ghost" onPress={() => navigate('Settlement')} /></Card>
          </>}
          {section === 'Evidence' && <>
            <Heading>Evidence, in context</Heading><Muted>Inspect each item before making a decision. This synthetic pack demonstrates organisation, not verified completeness.</Muted>
            {evidence.map((item, i) => <View key={item.title} style={s.evidenceCard}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: expanded === i }} onPress={() => setExpanded(expanded === i ? null : i)} style={s.evidenceButton}>
                <View style={s.evidenceNumber}><Text style={s.choiceText}>{String(i + 1).padStart(2, '0')}</Text></View><View style={s.flex}><Text style={s.rowTitle}>{item.title}</Text><Muted>{item.kind}</Muted></View><Text style={s.choiceText}>{expanded === i ? '−' : '+'}</Text>
              </Pressable>
              {expanded === i && <View style={s.evidenceDetail}><View style={s.placeholder}><Text style={s.placeholderTitle}>{i === 0 ? 'SAMPLE INCIDENT RECORD' : i < 4 ? 'NO PHOTO ATTACHED' : 'NO INVOICE ATTACHED'}</Text></View><Body>{item.detail}</Body>{i === 0 && <><Muted>Intended source: {CLAIM_SOURCE}.</Muted><Muted>Independent corroboration supports human assessment. It does not prove that a covered loss occurred.</Muted></>}</View>}
            </View>)}
            <Muted>Only the digest, payee and amount are recorded on-chain. Real photos, invoices and personal information require a private backend, which is not implemented.</Muted>
            {role !== 'Shop' && <Button label="Continue to decision →" onPress={() => navigate('Decision')} />}
          </>}
          {section === 'Decision' && role !== 'Shop' && <>
            <Heading>{role === 'Platform' ? 'Prepare the handoff' : 'A human makes the decision'}</Heading>
            <Body>{role === 'Platform' ? 'The platform prepares the pack and opens a funded claim. Only the insurer can approve or reject it.' : 'Review the evidence and policy before authorising a release. An incident alert alone does not establish coverage.'}</Body>
            <Card><Label>LIVE SAMPLE CLAIM</Label><Badge>{status}</Badge><Muted>{claim?.state === 'paid' ? 'This is an existing test payment. It cannot be approved or paid again.' : claim?.state === 'rejected' ? 'This claim has been rejected. No release is available.' : 'Signing takes place in the operator’s terminal, not on this device.'}</Muted><Button label="View settlement evidence" kind="ghost" onPress={() => navigate('Settlement')} /></Card>
            <View style={s.illustration}><Badge>ILLUSTRATIVE WALKTHROUGH</Badge><Heading>Explore a review</Heading><Muted>Separate from the live claim. These controls make no claim decision, submit no transaction and create no receipt.</Muted>
              {walkthrough === 'closed' ? <Button label="Start illustrative review" onPress={() => setWalkthrough('review')} /> : <>
                <Body>Requested R200.00 · {DEMO_PACK.amountUsdt} test USD₮</Body>
                <Muted>Recipient and network are shown in settlement details. A real release requires a fresh fee quote and insurer authorisation in the CLI.</Muted>
                {walkthrough === 'review' && <><Button label="Preview signing handoff" onPress={() => setWalkthrough('handoff')} /><Button label="Cancel review" kind="ghost" onPress={() => setWalkthrough('cancelled')} /><Button label="Explore rejection" kind="ghost" onPress={() => setWalkthrough('rejected')} /></>}
                {walkthrough === 'handoff' && <><Heading>Operator signing required</Heading><Muted>Validate recipient, Sepolia and token → check funds and fee → review and approve or cancel → sign in the terminal → re-check the same transaction. Nothing has been signed here.</Muted><Button label="Show operator instructions" kind="ghost" onPress={() => { setPanel(true); scroll.current?.scrollTo({ y: 0 }) }} /></>}
                {walkthrough === 'cancelled' && <Body>Review cancelled · no transaction or decision was submitted.</Body>}
                {walkthrough === 'rejected' && <Body>Illustrative rejection · a real rejection requires an insurer-signed transaction and releases the reservation without paying the shop. No rejection was submitted.</Body>}
                <Button label="Close walkthrough" kind="ghost" onPress={() => setWalkthrough('closed')} />
              </>}
            </View>
          </>}
          {section === 'Settlement' && <>
            <Heading>One shared settlement record</Heading><Muted>Read from Sepolia events and checked against contract state. This view never sends a payment.</Muted>
            {notices}
            <Card><Label>TEST-TOKEN SETTLEMENT</Label><Badge good={claim?.state === 'paid'}>{status}</Badge>
              {claim && <><Body>{claim.amountUsdt} test USD₮</Body><Muted>R{claim.amountZar} at the demo FX snapshot. This is not a rand receipt.</Muted><Muted>Claim #{claim.claimId} · {claim.state === 'paid' ? 'Existing test payment' : 'Existing on-chain claim'} · mined evidence, not a finality assertion.</Muted><Button label="View transaction on Etherscan ↗" kind="ghost" onPress={() => void Linking.openURL('https://sepolia.etherscan.io/tx/' + (claim.decisionTxHash ?? claim.openTxHash))} /></>}
              <Button label={loading ? 'Checking Sepolia…' : 'Re-check settlement'} disabled={loading} onPress={() => void refresh()} />
            </Card>
            <Card><Label>RAND DELIVERY</Label><Badge>SIMULATED · NO REAL PAYOUT</Badge><Body>R200.00</Body><Muted>No bank or mobile-money integration is connected. A future licensed payout partner would handle delivery.</Muted>
              {claim?.state === 'paid' ? <><Button label="Simulate rand delivery" disabled={simulatedClaim === claim.claimId} kind="ghost" onPress={() => setSimulatedClaim(claim.claimId)} />{simulatedClaim === claim.claimId && <Body>SIM-CLAIM-{claim.claimId} · simulation only. No funds moved.</Body>}</> : <Muted>Simulation is available only after a verified test-token release.</Muted>}
            </Card>
            <Button label={technical ? 'Hide settlement details −' : 'Settlement details +'} kind="ghost" onPress={() => setTechnical(!technical)} />
            {technical && <Card>{technicalDetails}<Label>OPTIONAL TRANSACTION LOOKUP</Label><TextInput accessibilityLabel="Transaction hash to check" placeholder="0x…" placeholderTextColor={colors.muted} value={hash} onChangeText={setHash} autoCapitalize="none" autoCorrect={false} style={s.input} />
              {invalid && <Text accessibilityRole="alert" style={s.error}>Enter 0x followed by 64 hexadecimal characters.</Text>}
              <Button label="Check this transaction" disabled={loading || invalid || !hash.trim()} onPress={() => void refresh(hash.trim())} />
              {view.snapshot?.transaction.status !== undefined && <Text accessibilityLiveRegion="polite" style={s.caption}>{txLabels[view.snapshot.transaction.status]}</Text>}
              {view.snapshot?.transaction.hash && <Text selectable style={s.hash}>Checked hash: {view.snapshot.transaction.hash}</Text>}
            </Card>}
          </>}
        </>}
      </> : <>
        <Label>SHARED AUDIT TRAIL</Label><Text accessibilityRole="header" style={s.title}>Activity</Text><Body>Only verified on-chain events appear here. Illustrative reviews and rand simulations are not settlement events.</Body>{notices}
        {!claim ? <Card><Heading>No verified activity loaded</Heading><Muted>{view.snapshot ? 'No opening event was found for this sample pack.' : 'Refresh to check the sample claim on Sepolia.'}</Muted></Card> : <>
          <Card><Label>01 · CLAIM OPENED</Label><Heading>Funds reserved</Heading><Body>{claim.amountUsdt} test USD₮</Body><Muted>Claim #{claim.claimId} · linked to the fictional pack digest.</Muted><Text selectable style={s.hash}>{claim.openTxHash}</Text></Card>
          {claim.decisionTxHash && <Card><Label>02 · {claim.state === 'paid' ? 'RELEASE RECORDED' : 'REJECTION RECORDED'}</Label><Heading>{claim.state === 'paid' ? 'Test tokens released' : 'Reservation released'}</Heading><Muted>{claim.state === 'paid' ? 'Existing payment. Rand delivery remains simulated.' : 'No token payout was made for this rejection.'}</Muted><Text selectable style={s.hash}>{claim.decisionTxHash}</Text></Card>}
        </>}
        <Button label={loading ? 'Checking Sepolia…' : 'Refresh activity'} disabled={loading} onPress={() => void refresh()} />
      </>}
      <Text style={s.footer}>PROTOTYPE · FICTIONAL CASE · REAL TESTNET EVIDENCE</Text>
    </ScrollView>
    <View style={s.tabs} accessibilityRole="tablist">{(['Claims', 'Activity'] as const).map(name => <Pressable key={name} accessibilityRole="tab" accessibilityState={{ selected: tab === name }} onPress={() => { setTab(name); scroll.current?.scrollTo({ y: 0, animated: false }) }} style={[s.tab, tab === name && s.tabOn]}><Text style={[s.tabText, tab === name && s.tabTextOn]}>{name === 'Claims' ? '▤  ' : '◷  '}{name}</Text></Pressable>)}</View>
  </View>
}
const s = StyleSheet.create({
  root: { flex: 1 }, flex: { flex: 1 }, scroll: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderColor: colors.line },
  wordmark: { fontFamily: fonts.heading, color: colors.ink, fontSize: 25, letterSpacing: -1 }, dot: { color: colors.amber, fontSize: 16 },
  headerSub: { fontFamily: fonts.emphasis, fontSize: 9, letterSpacing: 1.8, color: colors.muted, marginTop: 4 },
  demoButton: { minHeight: 48, paddingHorizontal: 14, justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 8 },
  content: { padding: 24, gap: 16, maxWidth: 680, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  context: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  contextText: { fontFamily: fonts.emphasis, fontSize: 10, letterSpacing: 1.2, color: colors.muted },
  title: { fontFamily: fonts.heading, color: colors.ink, fontSize: 36, lineHeight: 42, letterSpacing: -1.5 },
  heading: { fontFamily: fonts.heading, fontSize: 22, lineHeight: 28, color: colors.ink, letterSpacing: -0.5 },
  eyebrow: { fontFamily: fonts.emphasis, fontSize: 11, lineHeight: 17, letterSpacing: 1.1, color: colors.muted },
  caption: { ...typography.caption, color: colors.muted }, stack: { gap: 16 }, wrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  claimCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 20, gap: 10, borderTopWidth: 4, borderTopColor: colors.amber },
  caseTitle: { ...typography.body, fontFamily: fonts.emphasis, color: colors.ink },
  amount: { fontFamily: fonts.heading, color: colors.ink, fontSize: 54, lineHeight: 64, letterSpacing: -2 }, cents: { fontSize: 30, color: colors.muted },
  detailAmount: { fontFamily: fonts.heading, color: colors.ink, fontSize: 30, lineHeight: 38 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 4 },
  badge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: colors.soft, flexShrink: 1 },
  badgeGood: { backgroundColor: '#E7EFE8' }, badgeText: { fontFamily: fonts.emphasis, fontSize: 12, lineHeight: 18, color: colors.muted }, goodText: { color: '#28553B' },
  note: { padding: 20, gap: 10, borderLeftWidth: 2, borderColor: colors.amber },
  sectionNav: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingBottom: 8, borderBottomWidth: 1, borderColor: colors.line },
  choice: { minHeight: 48, paddingHorizontal: 12, justifyContent: 'center', borderRadius: 8, backgroundColor: colors.soft }, choiceOn: { backgroundColor: colors.ink },
  choiceText: { ...typography.label, color: colors.ink }, choiceTextOn: { color: colors.paper },
  evidenceCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, overflow: 'hidden' },
  evidenceButton: { flexDirection: 'row', gap: 12, padding: 16, alignItems: 'center', minHeight: 72 },
  evidenceNumber: { width: 36, height: 40, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  rowTitle: { ...typography.label, color: colors.ink }, evidenceDetail: { padding: 16, gap: 12, borderTopWidth: 1, borderColor: colors.line },
  placeholder: { minHeight: 100, padding: 16, backgroundColor: colors.paper, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  placeholderTitle: { ...typography.label, color: colors.muted, textAlign: 'center' },
  illustration: { borderRadius: 12, borderWidth: 1, borderColor: colors.amberDark, backgroundColor: colors.amberLight, padding: 20, gap: 16 },
  input: { ...typography.body, color: colors.ink, minHeight: 52, borderWidth: 1, borderColor: colors.muted, borderRadius: 8, padding: 12 },
  error: { ...typography.caption, color: colors.red }, technicalRow: { gap: 8 },
  hash: { ...typography.caption, color: colors.ink, fontVariant: ['tabular-nums'] }, code: { ...typography.caption, backgroundColor: colors.paper, color: colors.ink, padding: 12 },
  footer: { fontFamily: fonts.emphasis, fontSize: 9, lineHeight: 16, letterSpacing: 1.1, color: colors.muted, textAlign: 'center', marginTop: 12 },
  tabs: { flexDirection: 'row', padding: spacing.sm, gap: 8, borderTopWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  tab: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 10, padding: 8 }, tabOn: { backgroundColor: colors.ink },
  tabText: { ...typography.label, color: colors.muted }, tabTextOn: { color: colors.paper },
})
