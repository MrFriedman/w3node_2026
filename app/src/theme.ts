// Visual tokens adapted from the existing product design system.
export const colors = {
  ink: '#0F1419',
  paper: '#F7F5F0',
  amber: '#F5A524',
  line: '#DEDFD7',
  muted: '#626961',
  red: '#D92D20',
  card: '#FFFFFF',
  amberDark: '#B57512',
  amberLight: '#FFF1D6',
  soft: '#EDEEE5',
}

export const fonts = {
  body: 'Inter_400Regular',
  emphasis: 'Inter_600SemiBold',
  heading: 'SpaceGrotesk_600SemiBold',
}

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }
export const radius = { button: 5, card: 12, input: 5 }

export const typography = {
  heading: { fontFamily: fonts.heading, fontSize: 30, lineHeight: 38, letterSpacing: -1.05 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  label: { fontFamily: fonts.emphasis, fontSize: 14, lineHeight: 21 },
} as const
