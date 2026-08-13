import { useTheme } from '@/contexts/useTheme';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryBg: string;
  primaryBorder: string;
  primaryHex: string;

  success: string;
  successHover: string;
  successActive: string;
  error: string;
}

const themeColors: Record<'yellow' | 'blue', ThemeColors> = {
  yellow: {
    primary: 'yellow.400',
    primaryHover: 'yellow.300',
    primaryActive: 'yellow.500',
    primaryBg: 'yellow.400/10',
    primaryBorder: 'yellow.400/30',
    primaryHex: '#fbbf24',

    success: 'green.400',
    successHover: 'green.500',
    successActive: 'green.600',
    error: 'red.400',
  },
  blue: {
    primary: 'blue.500',
    primaryHover: 'blue.400',
    primaryActive: 'blue.600',
    primaryBg: 'blue.500/10',
    primaryBorder: 'blue.500/30',
    primaryHex: '#3b82f6',

    success: 'green.400',
    successHover: 'green.500',
    successActive: 'green.600',
    error: 'red.400',
  },
};

export const useThemeColors = (): ThemeColors => {
  const { theme } = useTheme();
  return themeColors[theme];
};
