import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { CREDIT_PACKS, formatUnits, isTxHash, parseTokenAmount, usdtBaseUnitsForZar } from '../../shared/money.ts'
import {
  CHECKPOINT_FX_NOTE,
  CHECKPOINT_ZAR_PER_USDT,
  DEFAULT_SEPOLIA_USDT,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_NAME,
} from '../../shared/network.ts'
import { colors, fonts, radius, spacing, typography } from './theme'
import { Banner, Body, Button, Card, Muted, Title } from './ui'
import { ON_DEVICE_SIGNING } from './wdk'

export function WalletScreen() {
  return (
    <View style={styles.stack}>
      <Title>Shop wallet</Title>
      <Body>A self-custodial Sepolia USDT wallet a partner platform can open for a shop. The address can be shared. The recovery phrase stays private.</Body>
      <Card>
        <Text style={styles.label}>Network</Text>
        <Body>{`${SEPOLIA_NAME} · chain id ${SEPOLIA_CHAIN_ID}`}</Body>
        <Text style={styles.label}>Testnet USDT</Text>
        <Text style={styles.mono}>{DEFAULT_SEPOLIA_USDT}</Text>
        <Muted>Default contract from Tether’s wdk-examples. The script reads the on-chain name and decimals before it quotes.</Muted>
      </Card>
      <Banner tone="notice">
        {ON_DEVICE_SIGNING
          ? 'On-device signing is on.'
          : 'On-device signing is not wired. This screen does not read a seed and does not show a balance. Run scripts/wallet.ts address and balance for the testnet wallet.'}
      </Banner>
      <Muted>TODO: hand the derived address to the partner platform, and show that address here from the WDK worklet.</Muted>
    </View>
  )
}

export function TopUpScreen() {
  const [bundleId, setBundleId] = useState<string | null>(null)
  const selected = CREDIT_PACKS.find((bundle) => bundle.id === bundleId)

  return (
    <View style={styles.stack}>
      <Title>Top up service credits</Title>
      <Body>Example credit packs for a pay-as-you-go service. USDT is the checkpoint FX snapshot, rounded up so the quote is never short.</Body>
      <Muted>{CHECKPOINT_FX_NOTE}</Muted>
      {CREDIT_PACKS.map((bundle) => {
        const units = usdtBaseUnitsForZar(bundle.zar, CHECKPOINT_ZAR_PER_USDT)
        const active = bundle.id === bundleId
        return (
          <Pressable
            key={bundle.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => setBundleId(bundle.id)}
            style={[styles.bundle, active ? styles.bundleOn : null]}
          >
            <Text style={styles.bundleTitle}>{`${bundle.credits} service credits`}</Text>
            <Text style={styles.bundleMeta}>{`R${bundle.zar} · ${formatUnits(units, 6)} USDT`}</Text>
          </Pressable>
        )
      })}
      {selected ? (
        <Card>
          <Text style={styles.label}>Review</Text>
          <Body>{`${selected.credits} credits for R${selected.zar}`}</Body>
          <Body>{`${formatUnits(usdtBaseUnitsForZar(selected.zar, CHECKPOINT_ZAR_PER_USDT), 6)} USDT to the platform treasury`}</Body>
          <Body>{`Network: ${SEPOLIA_NAME}`}</Body>
          <Muted>Fee: quoted by WDK when the script runs. This screen does not invent a fee.</Muted>
          <Muted>Recipient: PLATFORM_TREASURY_ADDRESS from the repo-root .env. It is not hardcoded here.</Muted>
          <Button label="Approve — signing is in the wallet script" onPress={() => undefined} disabled />
          <Button label="Cancel" kind="ghost" onPress={() => setBundleId(null)} />
          <Muted>TODO: enable Approve only after the Sepolia worklet can sign. Until then, run npm run wallet -- quote --bundle {selected.id} and, once funded, send --bundle {selected.id} --approve.</Muted>
        </Card>
      ) : null}
    </View>
  )
}

export function RewardsScreen() {
  return (
    <View style={styles.stack}>
      <Title>Verified-data rewards</Title>
      <Body>When a partner verifies a shop’s data contribution, such as an incident report or a price, the treasury wallet sends a small USDT reward. The shop does not sign that transfer.</Body>
      <Card>
        <Body>1. Validate the shop address, Sepolia, and the USDT contract.</Body>
        <Body>2. Check the treasury balance and quote the fee.</Body>
        <Body>3. Show recipient, amount, fee, and network. Approve or cancel.</Body>
        <Body>4. Sign and submit from the treasury seed.</Body>
        <Body>5. Stay pending until the same hash is confirmed. Reconnect checks that hash again.</Body>
      </Card>
      <Banner tone="planned">No rewards in this build. Nothing here pays a shop on its own.</Banner>
      <Muted>TODO: call the wallet script when the partner platform marks a contribution verified. The CLI path is send, opened with the treasury seed.</Muted>
    </View>
  )
}

export function StatusScreen({
  hash,
  note,
  onChangeHash,
  onRecheck,
}: {
  hash: string
  note: string
  onChangeHash: (value: string) => void
  onRecheck: () => void
}) {
  const valid = hash.length === 0 || isTxHash(hash)
  return (
    <View style={styles.stack}>
      <Title>Pending and reconnect</Title>
      <Body>A top-up or reward stays pending until the receipt is confirmed. If the signal drops, keep the last hash and look it up again. Do not send a second transaction for the same payment.</Body>
      <Card>
        <Text style={styles.label}>Last transaction hash</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeHash}
          placeholder="0x…"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={hash}
        />
        {valid ? null : <Text style={styles.error}>Enter a 32-byte transaction hash, or clear the field.</Text>}
        <Muted>{note}</Muted>
        <Button label="Re-check this hash" onPress={onRecheck} disabled={!isTxHash(hash)} />
      </Card>
      <Muted>The re-check that actually talks to Sepolia is scripts/wallet.ts status --hash. This app does not pretend a lookup succeeded.</Muted>
    </View>
  )
}

export function CashOutScreen() {
  const [mobile, setMobile] = useState('')
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function submit() {
    const digits = mobile.replace(/\s+/g, '')
    if (!/^0\d{9}$/.test(digits) && !/^\+?\d{10,15}$/.test(digits)) {
      setReference(null)
      setError('Enter a mobile number, for example 0821234567.')
      return
    }
    try {
      parseTokenAmount(amount, 6)
    } catch {
      setReference(null)
      setError('Enter a USDT amount greater than zero, with at most 6 decimals.')
      return
    }
    setError(null)
    const stamp = Date.now().toString(36).toUpperCase()
    setReference(`SIM-${stamp}`)
  }

  return (
    <View style={styles.stack}>
      <Title>Cash out</Title>
      <Banner tone="notice">SIMULATED mobile-money cash-out. No USDT moves. No mobile-money payout is sent.</Banner>
      <Card>
        <Text style={styles.label}>Mobile number</Text>
        <TextInput
          keyboardType="phone-pad"
          onChangeText={setMobile}
          placeholder="082 000 0000"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={mobile}
        />
        <Text style={styles.label}>USDT amount</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setAmount}
          placeholder="1.00"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={amount}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Simulate cash-out" onPress={submit} />
      </Card>
      {reference ? (
        <Card>
          <Text style={styles.label}>Simulation only</Text>
          <Body>{`Reference ${reference}`}</Body>
          <Body>{`${amount} USDT was not sent to ${mobile.replace(/\s+/g, '')}.`}</Body>
          <Muted>A live cash-out would still require the five-step USDT approval, then a mobile-money partner. No partner is connected.</Muted>
        </Card>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  label: { ...typography.label, color: colors.muted },
  mono: { ...typography.caption, color: colors.ink },
  bundle: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.md,
  },
  bundleOn: {
    borderColor: colors.amberDark,
    backgroundColor: colors.amberLight,
  },
  bundleTitle: { ...typography.body, fontFamily: fonts.emphasis, color: colors.ink },
  bundleMeta: { ...typography.caption, color: colors.muted, marginTop: spacing.xs, fontVariant: ['tabular-nums'] },
  input: {
    ...typography.body,
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: radius.input,
    borderWidth: 1,
    color: colors.ink,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  error: { ...typography.caption, color: colors.red },
})
