import { useState } from 'react'
import { TextInput, View } from 'react-native'
import type { Action, DemoRole, Workflow } from '../../shared/workflow.ts'
import { Body, Button, Card, Muted, Title } from './ui'
import { HistoricalReceipt } from './HistoricalReceipt'
import { colors, typography } from './theme'
export function ProgressView({ workflow: w, role, act }: { workflow: Workflow; role: DemoRole; act: (a: Action) => void }) {
  const [amount, setAmount] = useState('200.00')
  const [history, setHistory] = useState(false)
  const [receiptLoaded, setReceiptLoaded] = useState(false)
  const [receipt, setReceipt] = useState(false)
  return <View style={{ gap: 16 }}><Title>Progress</Title>
    <Card><Body>Current preparation: {w.stage}</Body><Muted>Draft → Broker review → Needs information (if needed) → Ready for insurer → Submitted for insurer review</Muted>
      <Body>Payment: No payout for this theft claim</Body>
      <Muted>Readiness is a demo preparation check, not coverage or insurer acceptance. All submissions and decisions below are simulated.</Muted>
      {w.submissions.length > 0 && <Body>Last simulated submission: version {w.submissions.at(-1)!.version}</Body>}
    </Card>
    {role === 'Insurer' && w.stage === 'Submitted for insurer review' && !w.decision && <Card>
      <Title>Illustrative insurer review</Title><Body>Submitted requested loss: R{w.submissions.at(-1)!.preparation.draft.fields.loss}</Body>
      <Muted>The insurer decides coverage and the payable amount under the policy. This prototype does neither.</Muted>
      <TextInput accessibilityLabel="Illustrative approved amount (ZAR)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={{ ...typography.body, padding: 12, minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: 8 }} />
      <Button label="Illustrate approval" disabled={!/^\d{1,10}(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0} onPress={() => act({ type: 'decide', outcome: 'approved', amountZar: amount })} />
      <Button label="Illustrate rejection" kind="ghost" onPress={() => act({ type: 'decide', outcome: 'rejected' })} />
    </Card>}
    {w.decision && <Card><Title>{w.decision.outcome === 'approved' ? 'Illustrative payment handoff' : 'Illustrative rejection'}</Title>
      <Body>SIMULATED decision · version {w.decision.version}</Body>
      {w.decision.outcome === 'approved' ? <><Body>Illustrative approved amount: R{w.decision.amountZar}</Body><Muted>No payment authorised or sent. In a future integration, the insurer would separately review and authorise settlement.</Muted></> : <Muted>No payment handoff. This is not an actual insurer decision.</Muted>}
    </Card>}
    <Card><Title>How payment could work</Title><Body>1 · On-ramp — SIMULATED</Body><Muted>An insurer could fund a stablecoin balance through a suitable provider. No fiat is converted here.</Muted>
      <Body>2 · Pre-funded testnet pool</Body><Muted>The separate historical example used a pre-funded Sepolia escrow pool. Insurer authorisation controls the payout. This walkthrough never signs.</Muted>
      <Body>3 · Rand off-ramp — SIMULATED</Body><Muted>A future payout provider could deliver rand to a bank or mobile-money account. No integration is connected; the shop need not hold USDT.</Muted>
    </Card>
    <Button label={history ? 'Hide submission versions' : 'View submission versions'} kind="ghost" onPress={() => setHistory(!history)} />
    {history && <Card>{w.submissions.length ? w.submissions.map(s => <View key={s.version}><Body>Version {s.version} · frozen simulated submission</Body><Muted>{s.preparation.draft.fields.description} · Requested R{s.preparation.draft.fields.loss}</Muted><Muted>{s.requests.map(r => r.id + ': ' + r.response).join('\n')}</Muted></View>) : <Muted>No submitted versions yet.</Muted>}</Card>}
    <Button label={receipt ? 'Hide historical payment example' : 'Existing testnet payment example'} kind="ghost" onPress={() => { setReceiptLoaded(true); setReceipt(!receipt) }} />
    <View style={!receipt ? { display: 'none' } : undefined}>{receiptLoaded && <HistoricalReceipt />}</View>
  </View>
}
