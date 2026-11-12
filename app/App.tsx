import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular'
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold'
import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk/600SemiBold'
import { useFonts } from 'expo-font'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { PRODUCT_NAME } from '../shared/brand.ts'
import { isTxHash } from '../shared/money.ts'
import { CashOutScreen, RewardsScreen, StatusScreen, TopUpScreen, WalletScreen } from './src/screens'
import { colors, radius, spacing, typography } from './src/theme'

const TABS = ['Wallet', 'Top up', 'Rewards', 'Status', 'Cash out'] as const
type Tab = (typeof TABS)[number]

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_600SemiBold, SpaceGrotesk_600SemiBold })

  return (
    <SafeAreaProvider style={styles.root}>
      {fontsLoaded || fontError ? <WalletApp /> : null}
    </SafeAreaProvider>
  )
}

function WalletApp() {
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
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.wordmark}>{PRODUCT_NAME}</Text>
        <Text style={styles.headerNote}>Sepolia testnet · USDT</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {tab === 'Wallet' ? <WalletScreen /> : null}
        {tab === 'Top up' ? <TopUpScreen /> : null}
        {tab === 'Rewards' ? <RewardsScreen /> : null}
        {tab === 'Status' ? (
          <StatusScreen hash={hash} note={note} onChangeHash={setHash} onRecheck={recheck} />
        ) : null}
        {tab === 'Cash out' ? <CashOutScreen /> : null}
      </ScrollView>
      <View style={styles.tabs} accessibilityRole="tablist">
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
              <Text style={styles.tabText}>{name}</Text>
            </Pressable>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
  },
  wordmark: { ...typography.heading, color: colors.ink, fontSize: 24, lineHeight: 30, letterSpacing: -0.84 },
  headerNote: { ...typography.caption, color: colors.muted },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: radius.button,
    paddingVertical: spacing.sm,
  },
  tabOn: { backgroundColor: colors.amberLight },
  tabText: { ...typography.label, color: colors.ink, textAlign: 'center' },
})
