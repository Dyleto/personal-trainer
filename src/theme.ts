import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        // Couleurs principales
        app: {
          primary: {
            DEFAULT: { value: '#CF9F3F' },
            hover: { value: '#DFB563' },
            active: { value: '#B3852F' },
            bg: { value: '#CF9F3F1A' },
            border: { value: '#CF9F3F4D' },
          },
          // États
          success: {
            DEFAULT: { value: '#4F8F8A' },
            hover: { value: '#5FA39D' },
            active: { value: '#3F726D' },
          },
          error: { value: '#E2574C' },
        },

        bg: {
          canvas: { value: '#17181B' },
          surface: { value: '#26282D' },
        },
        surface: {
          wall: { value: '#17181B' },
          card: { value: '#1E2024' },
        },

        fg: {
          DEFAULT: { value: '#ECE8DE' },
          muted: { value: '#A6A49A' },
        },

        session: {
          work: {
            DEFAULT: { value: '#E2574C' },
            fg: { value: '#EC8079' },
          },
          rest: {
            DEFAULT: { value: '#4F8F8A' },
            fg: { value: '#7BB8B2' },
          },
        },
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
