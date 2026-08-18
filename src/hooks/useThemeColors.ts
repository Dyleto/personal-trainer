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

const colors: ThemeColors = {
  primary: 'app.primary',
  primaryHover: 'app.primary.hover',
  primaryActive: 'app.primary.active',
  primaryBg: 'app.primary.bg',
  primaryBorder: 'app.primary.border',
  primaryHex: '#CF9F3F',
  success: 'app.success',
  successHover: 'app.success.hover',
  successActive: 'app.success.active',
  error: 'app.error',
};

export const useThemeColors = (): ThemeColors => colors;
