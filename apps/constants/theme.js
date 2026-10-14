import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  brand: {
    primary: '#0D9488', // Modern Hospitality Teal
    primaryDark: '#0F766E',
    primaryLight: '#F0FDFA',
    primaryContainer: '#CCFBF1',
    accent: '#F59E0B', // Amber for rating & stars
    accentLight: '#FEF3C7',
  },
  neutral: {
    background: '#F8FAFC', // Slate 50 clean backdrop
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9', // Slate 100
    cardBorder: '#E2E8F0', // Slate 200
    textPrimary: '#0F172A', // Slate 900
    textSecondary: '#64748B', // Slate 500
    gray: '#94A3B8', // Slate 400
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
  },
};

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.brand.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: colors.brand.primaryContainer,
    onPrimaryContainer: colors.brand.primaryDark,
    secondary: colors.brand.accent,
    secondaryContainer: colors.brand.accentLight,
    onSecondaryContainer: '#92400E',
    background: colors.neutral.background,
    surface: colors.neutral.surface,
    surfaceVariant: colors.neutral.surfaceVariant,
    onSurfaceVariant: colors.neutral.textSecondary,
    onSurface: colors.neutral.textPrimary,
    outline: colors.neutral.cardBorder,
    error: colors.status.error,
  },
  roundness: 14,
};

export { theme };