import { useEffect, useRef, useState } from 'react'
import { Linking, StyleSheet, Text, TextInput, View } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { CLAIM_TOKEN, DEMO_ESCROW, DEMO_PACK, DEMO_PACK_HASH, receiptAfterFailure, type ReceiptViewState } from '../../shared/claims.ts'
import { isTxHash } from '../../shared/money.ts'
import { CHECKPOINT_FX_NOTE } from '../../shared/network.ts'
import { readDemoClaim } from './claim-receipt'
import { colors, typography } from './theme'
import { Banner, Body, Button, Card, Muted } from './ui'
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
export function HistoricalReceipt() {
  const [technical, setTechnical] = useState(false)
  const [view, setView] = useState<ReceiptViewState>({ snapshot: null, refresh: 'idle' })
  const [hash, setHash] = useState('')
  const [copied, setCopied] = useState('')
  const [simulatedClaim, setSimulatedClaim] = useState<string | null>(null)
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
  return <View style={s.stack}>
            <Heading>Existing testnet payment example</Heading><Muted>Separate historical case, not this theft claim. Read-only verification of Sepolia events and contract state. No current claim payout is implied.</Muted>
            {notices}
            <Card><Label>HISTORICAL CASE · TEST-TOKEN SETTLEMENT</Label><Badge good={claim?.state === 'paid'}>{status}</Badge>
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

</View>
}
const s = StyleSheet.create({stack:{gap:12}, heading:{...typography.heading,color:colors.ink,fontSize:22},eyebrow:{...typography.label,color:colors.muted}, badge:{padding:10,backgroundColor:colors.soft,borderRadius:8},badgeGood:{backgroundColor:'#E7EFE8'},badgeText:{...typography.label,color:colors.ink},goodText:{color:'#28553B'},caption:{...typography.caption,color:colors.muted},technicalRow:{gap:8},hash:{...typography.caption,color:colors.ink},input:{...typography.body,minHeight:52,padding:12,borderWidth:1,borderColor:colors.line,borderRadius:8},error:{...typography.caption,color:colors.red}})
