import { useRef, useState, type ComponentRef, type ReactNode } from 'react'
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { PRODUCT_NAME } from '../../shared/brand.ts'
import { colors, fonts, radius, typography } from './theme'

const DEMO_VIDEO = 'https://drive.google.com/file/d/1M8miUNCvET3XyF07GjYcedBnCejA4e-4/view'
const PILOT_MAILTO = 'mailto:hello@howlpay.app?subject=HowlPay%20pilot'

const PACK = [
  ['Incident', 'Verified, timestamped record attached'],
  ['Form', 'Pre-filled, ready for the client to review'],
  ['Checklist', 'Missing fields and documents, by cause of loss'],
  ['Proof of unrest', 'From an existing verified incident-alert feed for Cape Town small shops (partner)'],
] as const

const FINDINGS = [
  {
    title: 'Incomplete files still bounce.',
    paragraphs: [
      'One brokerage described about four rounds of follow-up per file, depending on severity and circumstance.',
      'At another, submitting without a supporting document used to come back about a week later. A claim that should have been sorted in about two days was taking about three weeks a year or two ago. They are now around two days, because the file is not submitted until every required document is present. That figure is time to a complete, submitted file, not time to payment after approval.',
    ],
  },
  {
    title: 'Riot claims stall on proof of unrest.',
    paragraphs: [
      'One brokerage said riot claims need proof of political unrest in the area, and that this is the proof that gets queried or rejected most often.',
    ],
  },
  {
    title: 'Payment after approval still takes time.',
    paragraphs: [
      'One brokerage said it takes about five days to pay after approval, depending on the claim.',
    ],
  },
] as const

const STEPS = [
  ['Incident', 'A verified, timestamped incident record is attached from an existing verified incident-alert feed for Cape Town small shops (partner).'],
  ['Pre-filled insurer form', 'HowlPay prepares the insurer’s own claim form from the incident and the information already on file. It does not replace that form with a new portal.'],
  ['Checklist', 'Missing fields and documents are listed for that cause of loss, before the file is sent.'],
  ['Client review and submission', 'The client checks the pack and submits it themselves. The broker can help; in some offices they are not allowed to complete the form on the client’s behalf.'],
  ['Insurer approval', 'A human at the insurer decides. The contract does not decide the claim. The legal policy still governs.'],
  ['Payout', 'On the insurer or platform side, a USDT escrow can hold the payout and release it once the claim is approved. That rail is demonstrated on Sepolia testnet. It is not a broker feature, and a live production payout is still on the roadmap. Rand cash-out in the demo is a labelled simulation.'],
] as const

const ROLES = [
  ['Underwriting managers and insurers', 'Receive a complete file on your own form, with proof of unrest attached. HowlPay is meant to plug into an underwriting manager’s own broker app rather than compete with it. The escrow payout rail sits on this side of the market.'],
  ['Embedded micro-insurers', 'A claims process for spaza shops and other small businesses, with a testnet escrow that can hold and release a payout once a human approves.'],
  ['Brokers', 'A client-facing pre-fill, a missing-document checklist, and a familiar chat-style assistant with a handoff to someone at the brokerage. Not a new client portal. Escrow is not a broker product: many brokers never hold client money.'],
  ['Shops', 'A pack you can check and submit yourself. You do not have to hold USDT.'],
] as const

const EVIDENCE = [
  'Three brokerages said the insurer’s own claim form plus supporting documents is required. The pack cannot replace that form.',
  'One brokerage expressed strong interest in auto-filling the insurer’s own forms from the policy and data already on file, with the client only signing.',
  'A WhatsApp-style flow was familiar. A chatbot-only path was not: a live handoff to a person at the brokerage is required.',
  'Data security, in line with legislation, was raised unprompted, and matters as much as speed.',
  'Many brokers never hold client money. Debit orders go straight to the insurer, so escrow is not a broker product.',
  'Two brokerages are open to reviewing a first version once their decision-makers have been briefed at the start of next week. That is still not a paid pilot.',
] as const

const NAV = [
  ['problem', 'The problem'],
  ['how', 'How it works'],
  ['who', 'Who it’s for'],
  ['evidence', 'Evidence'],
  ['demo', 'Demo'],
] as const

function open(url: string) {
  void Linking.openURL(url)
}

function Wordmark() {
  return <Text style={s.wordmark}>{PRODUCT_NAME}<Text style={s.dot}>.</Text></Text>
}

function Wrap({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[s.wrap, style]}>{children}</View>
}

function Btn({ label, onPress, kind = 'primary' }: { label: string; onPress: () => void; kind?: 'primary' | 'secondary' }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [s.btn, kind === 'secondary' ? s.btnSecondary : s.btnPrimary, pressed && s.pressed]}
    >
      <Text style={[s.btnLabel, kind === 'secondary' ? s.btnLabelSecondary : s.btnLabelPrimary]}>{label}</Text>
    </Pressable>
  )
}

export function LandingScreen({ enter }: { enter: () => void }) {
  const wide = useWindowDimensions().width >= 720
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  const offsets = useRef<Record<string, number>>({})
  const [menuOpen, setMenuOpen] = useState(false)

  function go(id: string) {
    setMenuOpen(false)
    const y = offsets.current[id]
    if (y != null) scroll.current?.scrollTo({ y, animated: true })
  }

  function mark(id: string) {
    return (event: { nativeEvent: { layout: { y: number } } }) => {
      offsets.current[id] = event.nativeEvent.layout.y
    }
  }

  const navLinks = (
    <>
      {NAV.map(([id, label]) => (
        <Pressable key={id} accessibilityRole="button" onPress={() => go(id)} style={wide ? s.navItem : s.menuItem}>
          <Text style={s.navLabel}>{label}</Text>
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" onPress={() => open(PILOT_MAILTO)} style={wide ? s.navItem : s.menuItem}>
        <Text style={s.navLabel}>Request a pilot</Text>
      </Pressable>
    </>
  )

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <View style={s.headerInner}>
          <Wordmark />
          {wide ? (
            <View style={s.navRow}>{navLinks}</View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: menuOpen }}
              onPress={() => setMenuOpen(open => !open)}
              style={s.menuToggle}
            >
              <Text style={s.menuToggleLabel}>{menuOpen ? 'Close' : 'Menu'}</Text>
            </Pressable>
          )}
        </View>
      </View>
      {!wide && menuOpen ? <View style={s.menu}>{navLinks}</View> : null}

      <ScrollView ref={scroll} style={s.scroll} contentContainerStyle={s.page} scrollEnabled={!menuOpen || wide}>
        <View style={s.heroBand}>
        <Wrap style={[s.hero, wide && s.heroWide]}>
          <View style={s.heroCopy}>
            <Text style={s.eyebrow}>For underwriting managers, insurers, and brokers</Text>
            <Text accessibilityRole="header" style={[s.headline, wide && s.headlineWide]}>A verified incident, turned into a complete claim pack on the insurer’s own form.</Text>
            <Text style={s.lede}>The client checks a pre-filled form and submits it themselves. A checklist flags missing fields and documents for that cause of loss. Proof of unrest is attached from an existing verified incident-alert feed for Cape Town small shops (partner). If they get stuck, a WhatsApp-style assistant can hand them to a real person.</Text>
            <View style={s.actions}>
              <Btn label="Open the demo" onPress={enter} />
              <Btn label="Watch the demo" kind="secondary" onPress={() => open(DEMO_VIDEO)} />
            </View>
          </View>
          <View style={s.pack} accessibilityLabel="Example of a prepared claim pack">
            <Text style={s.packKicker}>Claim pack</Text>
            <Text accessibilityRole="header" style={s.packTitle}>Prepared for the insurer’s form</Text>
            {PACK.map(([label, value]) => (
              <View key={label} style={s.packRow}>
                <Text style={s.packDt}>{label}</Text>
                <Text style={s.body}>{value}</Text>
              </View>
            ))}
            <Text style={s.packHash}>Off-chain pack. Only a hash goes on-chain.</Text>
          </View>
        </Wrap>
        </View>

        <View style={s.section} onLayout={mark('problem')}>
          <Wrap>
          <Text style={s.eyebrow}>The problem</Text>
          <Text accessibilityRole="header" style={s.heading}>Files arrive incomplete, follow-up drags on, and riot claims stall on proof.</Text>
          <Text style={s.intro}>Conversations with Cape Town short-term brokerages on 13 November 2026. These are interview observations, not industry averages, HowlPay results, or service commitments.</Text>
          <View style={[s.findings, wide && s.findingsWide]}>
            {FINDINGS.map((finding, index) => (
              <View key={finding.title} style={[s.finding, wide && (index === 0 ? s.findingLead : s.findingHalf)]}>
                <Text accessibilityRole="header" style={s.subhead}>{finding.title}</Text>
                {finding.paragraphs.map(paragraph => <Text key={paragraph} style={s.body}>{paragraph}</Text>)}
              </View>
            ))}
          </View>
          </Wrap>
        </View>

        <View style={[s.section, s.alt]} onLayout={mark('how')}>
          <Wrap>
          <Text style={s.eyebrow}>How it works</Text>
          <Text accessibilityRole="header" style={s.heading}>From a verified incident to a file the client can actually submit.</Text>
          <View style={s.steps}>
            {STEPS.map(([title, body], index) => (
              <View key={title} style={s.step}>
                <View style={s.stepNum}><Text style={s.stepNumLabel}>{index + 1}</Text></View>
                <View style={s.stepCopy}>
                  <Text accessibilityRole="header" style={s.subhead}>{title}</Text>
                  <Text style={s.body}>{body}</Text>
                </View>
              </View>
            ))}
          </View>
          </Wrap>
        </View>

        <View style={s.section} onLayout={mark('who')}>
          <Wrap>
          <Text style={s.eyebrow}>Who it’s for</Text>
          <Text accessibilityRole="header" style={s.heading}>Built to sit in the claims process, not to replace the people in it.</Text>
          <View style={[s.roles, wide && s.rolesWide]}>
            {ROLES.map(([title, body]) => (
              <View key={title} style={[s.role, wide && s.roleHalf]}>
                <Text accessibilityRole="header" style={s.subhead}>{title}</Text>
                <Text style={s.body}>{body}</Text>
              </View>
            ))}
          </View>
          </Wrap>
        </View>

        <View style={[s.section, s.alt]} onLayout={mark('evidence')}>
          <Wrap>
          <Text style={s.eyebrow}>Validation evidence</Text>
          <Text accessibilityRole="header" style={s.heading}>What we heard on 13 November 2026.</Text>
          <Text style={s.intro}>Conversations with three Cape Town short-term brokerages and one underwriting manager. These are interview observations. Interest is not a paid pilot, and none of the figures below are HowlPay results.</Text>
          <View>
            {EVIDENCE.map(item => (
              <View key={item} style={s.evidenceItem}>
                <View style={s.evidenceMark} />
                <Text style={[s.body, s.evidenceText]}>{item}</Text>
              </View>
            ))}
          </View>
          </Wrap>
        </View>

        <View style={s.section}>
          <Wrap>
          <View style={s.narrow}>
            <Text style={s.eyebrow}>Security and POPIA</Text>
            <Text accessibilityRole="header" style={s.headingWide}>The pack stays off‑chain.{'\n'}Only its hash goes on‑chain.</Text>
            <Text style={s.body}>Names, photos, invoices, and other personal information are not written to the blockchain. The private claim pack is the record of what happened. The on-chain hash is an audit trail for that pack, not a copy of it.</Text>
            <Text style={[s.body, { marginTop: 16 }]}>A human insurer approves or rejects the claim. The legal policy still governs. The escrow demonstration runs on Sepolia testnet only.</Text>
          </View>
          </Wrap>
        </View>

        <View style={[s.section, s.alt]} onLayout={mark('demo')}>
          <Wrap>
          <View style={[s.demoRow, wide && s.demoRowWide]}>
            <View style={s.demoCopy}>
              <Text style={s.eyebrow}>Demo</Text>
              <Text accessibilityRole="header" style={s.headingWide}>See the claim pack, the checklist, and the testnet payout.</Text>
              <Text style={s.intro}>A short walkthrough of the current HowlPay demo. The escrow release shown there is on Sepolia testnet. Rand delivery is a labelled simulation.</Text>
            </View>
            <View style={s.actions}>
              <Btn label="Open the demo" onPress={enter} />
              <Btn label="Watch the demo" kind="secondary" onPress={() => open(DEMO_VIDEO)} />
            </View>
          </View>
          </Wrap>
        </View>

        <View style={s.section} onLayout={mark('pilot')}>
          <Wrap>
          <View style={s.narrow}>
            <Text style={s.eyebrow}>Pilot</Text>
            <Text accessibilityRole="header" style={s.headingWide}>Walk through a first version with us.</Text>
            <Text style={s.intro}>If you handle claims for small businesses in South Africa, we would like to show you the pack, the checklist, and how it sits next to the insurer’s own form. No paid pilot is in place yet.</Text>
            <Btn label="Request a pilot" onPress={() => open(PILOT_MAILTO)} />
          </View>
          </Wrap>
        </View>

        <View style={s.footer}>
          <Wrap>
          <Wordmark />
          <Text style={s.footerCopy}>A testnet demonstration built for the W3Node Node Engine hackathon, Cape Town, November 2026. Sepolia only. HowlPay is not a licensed insurer or financial services provider.</Text>
          </Wrap>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.paper,
    zIndex: 2,
  },
  headerInner: {
    minHeight: 64,
    width: '100%',
    maxWidth: 1152,
    alignSelf: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  wordmark: { fontFamily: fonts.heading, fontSize: 22, letterSpacing: -1, color: colors.ink },
  dot: { color: colors.amber },
  navRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 18, flexShrink: 1 },
  navItem: { minHeight: 44, justifyContent: 'center' },
  navLabel: { ...typography.body, fontSize: 14, color: colors.ink },
  menuToggle: { minHeight: 44, minWidth: 44, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line, borderRadius: radius.button, justifyContent: 'center' },
  menuToggleLabel: { fontFamily: fonts.emphasis, fontSize: 14, color: colors.ink },
  menu: { position: 'absolute', left: 0, right: 0, top: 64, bottom: 0, zIndex: 3, backgroundColor: colors.paper, paddingHorizontal: 20, paddingTop: 8 },
  menuItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  scroll: { flex: 1 },
  page: { paddingBottom: 8, width: '100%' },
  wrap: { width: '100%', maxWidth: 1152, alignSelf: 'center', paddingHorizontal: 20 },
  heroBand: { borderBottomWidth: 1, borderBottomColor: colors.line, width: '100%' },
  hero: { paddingTop: 40, paddingBottom: 48, gap: 32 },
  heroWide: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 64, paddingBottom: 72, gap: 48 },
  heroCopy: { flex: 1.2, minWidth: 0, gap: 16 },
  eyebrow: { fontFamily: fonts.emphasis, fontSize: 11, lineHeight: 16, letterSpacing: 1.4, textTransform: 'uppercase', color: colors.muted },
  headline: { fontFamily: fonts.heading, fontSize: 36, lineHeight: 42, letterSpacing: -1.4, color: colors.ink },
  headlineWide: { fontSize: 54, lineHeight: 60 },
  lede: { ...typography.body, color: colors.ink, marginBottom: 8 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  btn: { minHeight: 48, paddingHorizontal: 18, paddingVertical: 12, borderRadius: radius.button, borderWidth: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
  btnPrimary: { backgroundColor: colors.ink, borderColor: colors.ink },
  btnSecondary: { backgroundColor: 'transparent', borderColor: colors.line },
  btnLabel: { fontFamily: fonts.emphasis, fontSize: 16, lineHeight: 20 },
  btnLabelPrimary: { color: colors.paper },
  btnLabelSecondary: { color: colors.ink },
  pressed: { opacity: 0.82 },
  pack: { flex: 0.8, minWidth: 0, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, padding: 22, gap: 4 },
  packKicker: { fontFamily: fonts.emphasis, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: colors.muted, marginBottom: 4 },
  packTitle: { fontFamily: fonts.heading, fontSize: 22, lineHeight: 28, letterSpacing: -0.5, color: colors.ink, marginBottom: 8 },
  packRow: { paddingTop: 14, marginTop: 10, borderTopWidth: 1, borderTopColor: colors.line, gap: 2 },
  packDt: { fontFamily: fonts.emphasis, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.muted },
  packHash: { ...typography.caption, color: colors.muted, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.line },
  section: { paddingVertical: 52, borderBottomWidth: 1, borderBottomColor: colors.line, width: '100%' },
  alt: { backgroundColor: colors.soft },
  heading: { fontFamily: fonts.heading, fontSize: 28, lineHeight: 34, letterSpacing: -0.8, color: colors.ink, maxWidth: 520, marginBottom: 8 },
  headingWide: { fontFamily: fonts.heading, fontSize: 28, lineHeight: 34, letterSpacing: -0.8, color: colors.ink, marginBottom: 8 },
  intro: { ...typography.body, color: colors.muted, marginBottom: 16, maxWidth: 680 },
  body: { ...typography.body, color: colors.ink },
  subhead: { fontFamily: fonts.heading, fontSize: 18, lineHeight: 24, letterSpacing: -0.3, color: colors.ink, marginBottom: 6 },
  findings: { gap: 16 },
  findingsWide: { flexDirection: 'row', flexWrap: 'wrap' },
  finding: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderLeftWidth: 3, borderLeftColor: colors.amber, borderRadius: radius.card, padding: 20, gap: 12, width: '100%' },
  findingLead: { width: '100%' },
  findingHalf: { flexGrow: 1, flexBasis: 280, maxWidth: '100%' },
  steps: { marginTop: 8 },
  step: { flexDirection: 'row', gap: 16, paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.line },
  stepNum: { width: 34, height: 34, borderRadius: radius.button, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center' },
  stepNumLabel: { fontFamily: fonts.heading, fontSize: 15, color: colors.ink },
  stepCopy: { flex: 1, minWidth: 0 },
  roles: { marginTop: 8 },
  rolesWide: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 40 },
  role: { width: '100%', paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.line },
  roleHalf: { width: '47%', flexGrow: 1 },
  evidenceItem: { flexDirection: 'row', gap: 14, paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.line },
  evidenceMark: { width: 7, height: 7, marginTop: 8, backgroundColor: colors.amber },
  evidenceText: { flex: 1, minWidth: 0 },
  narrow: { maxWidth: 640, width: '100%', alignSelf: 'center', gap: 4 },
  demoRow: { gap: 20 },
  demoRowWide: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 },
  demoCopy: { flex: 1, minWidth: 0 },
  footer: { paddingVertical: 36, width: '100%' },
  footerCopy: { ...typography.caption, color: colors.muted, maxWidth: 640 },
})
