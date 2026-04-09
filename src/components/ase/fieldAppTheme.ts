/** Field / ASE mobile app — product palette (enterprise blue). */
export const FIELD_THEME = {
  primary: '#0B5ED7',
  secondary: '#1E3A8A',
  bg: '#F4F6F9',
  surface: '#FFFFFF',
  border: '#D1D5DB',
  text: '#111827',
  textMuted: '#6B7280',
  accent: '#2563EB',
  focus: '#93C5FD',
} as const;

export const field = {
  headerGradient: `linear-gradient(165deg, ${FIELD_THEME.primary} 0%, ${FIELD_THEME.secondary} 52%, #152a52 100%)`,
  cardGradient: `linear-gradient(155deg, ${FIELD_THEME.secondary} 0%, ${FIELD_THEME.primary} 55%, #1d4ed8 100%)`,
  kpiGradient: `linear-gradient(160deg, ${FIELD_THEME.primary} 0%, ${FIELD_THEME.accent} 100%)`,
  shadowCard: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)',
  shadowElevated: '0 4px 14px rgba(15, 23, 42, 0.08)',
} as const;
