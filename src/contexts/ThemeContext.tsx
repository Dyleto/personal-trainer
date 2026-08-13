import { createContext } from 'react';

export type ThemeColor = 'yellow' | 'blue';

export interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
