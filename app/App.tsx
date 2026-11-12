import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { isTxHash } from '../shared/money.ts'
import { CashOutScreen, RewardsScreen, StatusScreen, TopUpScreen, WalletScreen } from './src/screens'
import { colors } from './src/theme'

const TABS = ['Wallet', 'Top up', 'Rewards', 'Status', 'Cash out'] as const
type Tab = (typeof TABS)[number]

export default function App() {
  const [tab, setTab] = useState<Tab>('Wallet')
  const [hash, setHash] = useState('')
  const [note, setNote] = useState('No hash yet. A real payment stores one hash and re-checks that hash only.')

  function recheck() {
    if (!isTxHash(hash)) return
    setNote(
      `Last-known status for ${hash}: not looked up from this app. Re-check on Sepolia with scripts/wallet.ts status --hash ${hash}. That command does not send a second transaction.`,
    )
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.kicker}>Howl · Cape Town shops</Text>
        <Text style={styles.wordmark}>Howl Wallet</Text>
        <Text style={styles.headerNote}>Sepolia testnet · USDT</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {TABS.map((name) => {
          const active = name === tab
          return (
            <Pressable
              key={name}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setTab(name)}
              style={[styles.tab, active ? styles.tabOn : null]}
            >
              <Text style={[styles.tabText, active ? styles.tabTextOn : null]}>{name}</Text>
            </Pressable>
          )
        })}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'Wallet' ? <WalletScreen /> : null}
        {tab === 'Top up' ? <TopUpScreen /> : null}
        {tab === 'Rewards' ? <RewardsScreen /> : null}
        {tab === 'Status' ? (
          <StatusScreen hash={hash} note={note} onChangeHash={setHash} onRecheck={recheck} />
        ) : null}
        {tab === 'Cash out' ? <CashOutScreen /> : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 58, paddingHorizontal: 20, gap: 2 },
  kicker: { color: colors.teal, fontSize: 13, fontWeight: '700' },
  wordmark: { color: colors.ink, fontSize: 28, fontWeight: '700' },
  headerNote: { color: colors.muted, fontSize: 14 },
  tabs: { gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  tab: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabOn: { backgroundColor: colors.tealDark, borderColor: colors.tealDark },
  tabText: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  tabTextOn: { color: colors.white },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
})
