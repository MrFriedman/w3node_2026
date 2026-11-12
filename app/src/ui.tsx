import type { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from './theme'

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>
}

export function Body({ children }: { children: ReactNode }) {
  return <Text style={styles.body}>{children}</Text>
}

export function Muted({ children }: { children: ReactNode }) {
  return <Text style={styles.muted}>{children}</Text>
}

export function Banner({ tone, children }: { tone: 'amber' | 'danger' | 'mint'; children: ReactNode }) {
  const toneStyle = tone === 'amber' ? styles.amber : tone === 'danger' ? styles.danger : styles.mint
  const textStyle = tone === 'amber' ? styles.amberText : tone === 'danger' ? styles.dangerText : styles.mintText
  return (
    <View style={[styles.banner, toneStyle]}>
      <Text style={textStyle}>{children}</Text>
    </View>
  )
}

export function Button({
  label,
  onPress,
  disabled,
  kind = 'primary',
}: {
  label: string
  onPress: () => void
  disabled?: boolean
  kind?: 'primary' | 'ghost'
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        kind === 'ghost' ? styles.ghost : styles.primary,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.buttonText, kind === 'ghost' ? styles.ghostText : styles.primaryText]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  banner: {
    borderRadius: 12,
    padding: 12,
  },
  amber: { backgroundColor: colors.amberBg },
  danger: { backgroundColor: colors.dangerBg },
  mint: { backgroundColor: colors.mint },
  amberText: { color: colors.amberInk, fontSize: 14, lineHeight: 20 },
  dangerText: { color: colors.dangerInk, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  mintText: { color: colors.tealDark, fontSize: 14, lineHeight: 20 },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primary: { backgroundColor: colors.teal },
  ghost: { backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1 },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },
  buttonText: { fontSize: 16, fontWeight: '600' },
  primaryText: { color: colors.white },
  ghostText: { color: colors.ink },
})
