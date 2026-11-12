import type { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, fonts, radius, spacing, typography } from './theme'

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

export function Banner({ tone, children }: { tone: 'notice' | 'planned'; children: ReactNode }) {
  return (
    <View style={[styles.banner, tone === 'notice' ? styles.notice : styles.planned]}>
      <Text style={styles.bannerText}>{children}</Text>
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
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: radius.card,
    borderWidth: 1,
    gap: spacing.sm,
    padding: 20,
  },
  title: { ...typography.heading, color: colors.ink },
  body: { ...typography.body, color: colors.ink },
  muted: { ...typography.caption, color: colors.muted },
  banner: { borderRadius: radius.card, padding: spacing.md },
  notice: { backgroundColor: colors.amberLight },
  planned: { backgroundColor: colors.soft },
  bannerText: { ...typography.label, color: colors.ink },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primary: { backgroundColor: colors.amber },
  ghost: { backgroundColor: colors.card, borderColor: colors.ink, borderWidth: 1 },
  disabled: { backgroundColor: colors.soft, borderColor: colors.line },
  pressed: { opacity: 0.8 },
  buttonText: { ...typography.body, fontFamily: fonts.emphasis, color: colors.ink, textAlign: 'center' },
  disabledText: { color: colors.muted },
})
