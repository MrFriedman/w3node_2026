import { useState } from 'react'
import { Linking, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import * as Crypto from 'expo-crypto'
import * as Clipboard from 'expo-clipboard'
import { CASE_ID, cleanDraft, type CaseDraft, type Proposal } from '../../shared/assistant.ts'
import { FORM_TITLE, FIELD_LABELS, mapForm, checklist, preparePack, incidentType, brokerBrief, followUp, type Attachment, type PreparationOptions } from '../../shared/preparation.ts'
import { DEMO_PACK_HASH } from '../../shared/claims.ts'
import { Body, Button, Card, Muted, Banner } from './ui'
import { colors, typography } from './theme'

export function PreparationScreen({ draft, documents, options, setOptions, confirm, broker }: {
  draft: CaseDraft
  documents: Attachment[]
  options: PreparationOptions
  setOptions: (value: PreparationOptions) => void
  confirm: (proposal: Proposal) => void
  broker: boolean
}) {
  const [edits, setEdits] = useState<CaseDraft['fields']>()
  const [prepared, setPrepared] = useState<Awaited<ReturnType<typeof preparePack>>>()
  const [preparing, setPreparing] = useState(false)
  const [message, setMessage] = useState('')
  const [followupText, setFollowupText] = useState<string>()
  const [followupFrom, setFollowupFrom] = useState('')
  const [showJson, setShowJson] = useState(false)
  const current = JSON.stringify({ draft, documents, options })
  const [preparedFrom, setPreparedFrom] = useState('')
  const rows = mapForm(draft)
  const checks = checklist(draft, documents, options)

  async function prepare() {
    setPreparing(true)
    setMessage('')
    try {
      const result = await preparePack(draft, documents, options, text =>
        Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text))
      setPrepared(result)
      setPreparedFrom(current)
    } catch {
      setMessage('Could not calculate the preparation digest. Please retry.')
    } finally {
      setPreparing(false)
    }
  }
  async function copy(text: string) {
    try { await Clipboard.setStringAsync(text); setMessage('Copied for manual review.') }
    catch { setMessage('Copy unavailable. Select the preview text to copy.') }
  }
  function save() {
    const values = cleanDraft(edits)
    if (!Object.keys(values).length || Object.keys(values).length !== Object.values(edits ?? {}).filter(value => value?.trim()).length) {
      setMessage('Use a decimal rand amount and complete valid fields before confirming.')
      return
    }
    confirm({ id: 'form-' + Date.now(), caseId: CASE_ID, fields: values, source: 'Confirmed fictional form edit' })
    setEdits(undefined)
    setMessage('Form draft updated.')
  }
  return <View style={styles.stack}>
    <Text accessibilityRole="header" style={styles.heading}>{FORM_TITLE}</Text>
    <Muted>Fictional R200 preparation case. The receiving insurer supplies its approved form and final requirements. This preview has no live submission.</Muted>
    <Card>
      {rows.map(row => <View key={row.field} style={styles.field}>
        <Text style={styles.label}>{row.label}</Text>
        {edits && row.field !== 'banking' ? <TextInput accessibilityLabel={row.label}
          value={edits[row.field] ?? ''} placeholder="Unresolved" maxLength={2000}
          multiline={row.field === 'description' || row.field === 'evidence'} style={styles.input}
          onChangeText={value => setEdits(previous => ({ ...previous, [row.field]: value }))} /> :
          <Body>{row.value ?? 'Unresolved'}</Body>}
        <Muted>Source · {row.source}</Muted>
      </View>)}
      {edits ? <>
        <Button label="Confirm form changes" onPress={save} />
        <Button label="Cancel edits" kind="ghost" onPress={() => setEdits(undefined)} />
      </> : <Button label="Edit fictional form" kind="ghost" onPress={() => setEdits({ ...draft.fields })} />}
      <Muted>Banking details stay unresolved. Use fictional identity and policy details only.</Muted>
    </Card>
    <Text accessibilityRole="header" style={styles.heading}>Document checklist</Text>
    <Body>{incidentType(draft.fields.incident) ?? 'Incident type unresolved'} · small-shop-demo-1</Body>
    {!incidentType(draft.fields.incident) && <Banner tone="notice">Choose riot, theft or fire in the form to load its incident requirements.</Banner>}
    <View style={styles.toggle}><Body>Repairs claimed</Body><Switch accessibilityLabel="Repairs claimed" value={options.repairs} onValueChange={repairs => setOptions({ ...options, repairs })} /></View>
    <View style={styles.toggle}><Body>Insurer requests identity evidence</Body><Switch accessibilityLabel="Insurer requests identity evidence" value={options.identityRequested} onValueChange={identityRequested => setOptions({ ...options, identityRequested })} /></View>
    {checks.map(item => <Card key={item.id}>
      <Text style={styles.label}>{item.title} · {item.state.toUpperCase()}</Text>
      <Muted>{item.reason}</Muted>
      <Muted>{item.complete ? 'Fixture content supplied; insurer review remains necessary.' : 'Still needed for this demo checklist.'}</Muted>
      {item.source.startsWith('https://') ? <Button label={'Source for ' + item.title.toLowerCase()} kind="ghost" onPress={() => void Linking.openURL(item.source)} /> : <Muted>{item.source}</Muted>}
    </Card>)}
    <Text accessibilityRole="header" style={styles.heading}>Supporting bundle</Text>
    <Card><Text style={styles.label}>0. Generic preparation form</Text><Muted>The form above is included as structured data in the JSON bundle.</Muted></Card>
    {documents.map((item, index) => <Card key={item.id}>
      <Text style={styles.label}>{index + 1}. {item.title} · {item.state}</Text>
      <Muted>{item.source}</Muted>
      <Text selectable style={styles.text}>{item.content ?? 'No attachment content supplied.'}</Text>
    </Card>)}
    {broker && <Card>
      <Text accessibilityRole="header" style={styles.heading}>Broker handoff</Text>
      <Text selectable style={styles.text}>{brokerBrief(draft, documents, options)}</Text>
      <Button label="Draft document follow-up" kind="ghost" onPress={() => { setFollowupText(followUp(draft, documents, options)); setFollowupFrom(current) }} />
      {followupText !== undefined && <>
        <TextInput accessibilityLabel="Follow-up message for manual review" multiline style={styles.input} value={followupText} onChangeText={setFollowupText} />
        {followupFrom !== current && <Muted>Case details changed. Draft the follow-up again before copying.</Muted>}
        <Button label="Copy reviewed follow-up" kind="ghost" disabled={followupFrom !== current} onPress={() => void copy(followupText)} />
      </>}
    </Card>}
    <Muted>Incomplete fields and missing documents are included in the preparation manifest. Preparing a demo pack does not submit it to an insurer.</Muted>
    <Button label={preparing ? 'Calculating digest…' : 'Prepare demo pack'} disabled={preparing || Boolean(edits)} onPress={() => void prepare()} />
    {prepared && <Card>
      <Text style={styles.label}>Off-chain preparation digest</Text>
      <Text selectable style={styles.text}>{prepared.digest}</Text>
      <Banner tone="notice">{preparedFrom !== current ? 'Draft changed. Prepare again to calculate its current digest.' : 'Preparation snapshot ready.'} This digest has not been anchored by the existing transaction.</Banner>
      <Muted>Historical on-chain pack hash</Muted><Text selectable style={styles.text}>{DEMO_PACK_HASH}</Text>
      <Button label={showJson ? 'Hide bundle JSON' : 'Preview bundle JSON'} kind="ghost" onPress={() => setShowJson(!showJson)} />
      {showJson && <Text selectable style={styles.text}>{JSON.stringify(prepared.payload, null, 2)}</Text>}
      <Button label="Copy preparation JSON" kind="ghost" onPress={() => void copy(JSON.stringify(prepared, null, 2))} />
    </Card>}
    {message ? <Text accessibilityLiveRegion="polite" style={styles.text}>{message}</Text> : null}
  </View>
}
const styles = StyleSheet.create({
  stack: { gap: 16 }, field: { gap: 6, marginBottom: 12 },
  heading: { ...typography.heading, fontSize: 22, lineHeight: 28, color: colors.ink },
  label: { ...typography.label, color: colors.ink },
  text: { ...typography.caption, color: colors.ink },
  input: { ...typography.body, color: colors.ink, borderColor: colors.line, borderWidth: 1, borderRadius: 8, minHeight: 48, padding: 12 },
  toggle: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
})
