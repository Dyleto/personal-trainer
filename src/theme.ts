import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        // Couleurs principales
        'app.primary': { value: '#CF9F3F' },
        'app.primary.hover': { value: '#DFB563' },
        'app.primary.active': { value: '#B3852F' },
        'app.primary.bg': { value: '#CF9F3F1A' },
        'app.primary.border': { value: '#CF9F3F4D' },

        // États
        'app.success': { value: '#4F8F8A' },
        'app.success.hover': { value: '#5FA39D' },
        'app.success.active': { value: '#3F726D' },

        'app.error': { value: '#E2574C' },

        'bg.canvas': { value: '#17181B' },
        'bg.muted': { value: '#17181B' },
        'bg.panel': { value: '#1E2024' },

        fg: { value: '#ECE8DE' },
        'fg.muted': { value: '#A6A49A' },
        'bg.surface': { value: '#26282D' },

        'session.work': { value: '#E2574C' },
        'session.rest': { value: '#4F8F8A' },
      },
    },
    tokens: {
      colors: {
        brand: {
          50: { value: '#fffbeb' },
          100: { value: '#fef3c7' },
          200: { value: '#fde68a' },
          300: { value: '#fcd34d' },
          400: { value: '#fbbf24' },
          500: { value: '#f59e0b' },
          600: { value: '#d97706' },
          700: { value: '#b45309' },
          800: { value: '#92400e' },
          900: { value: '#78350f' },
          950: { value: '#451a03' },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      backgroundColor: 'bg.canvas', // Utilise la valeur définie au-dessus
      color: 'fg',
    },
    'input, textarea, select': {
      fontSize: '16px !important', // Empêche le zoom auto sur iOS
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
