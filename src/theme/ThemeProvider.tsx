'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { themes, type ThemeName } from './themes';

export type ThemeTokens = Record<string, string>;
type Ctx = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  customTheme: ThemeTokens;
  setCustomTheme: (tokens: ThemeTokens) => void;
};
const ThemeContext = createContext<Ctx | null>(null);

const customStorageKey = 'meridian-custom-theme-v1';
const loadCustomTheme = (): ThemeTokens => {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(window.localStorage.getItem(customStorageKey) ?? '{}') as ThemeTokens; } catch { return {}; }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [customTheme, setCustomThemeState] = useState<ThemeTokens>(loadCustomTheme);

  useEffect(() => {
    const preset = theme === 'custom' ? themes.dark : themes[theme];
    const tokens = { ...preset, ...(theme === 'custom' ? customTheme : {}) };
    Object.entries(tokens).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
    document.documentElement.dataset.theme = theme;
  }, [theme, customTheme]);

  const setCustomTheme = (tokens: ThemeTokens) => {
    setCustomThemeState(tokens);
    if (typeof window !== 'undefined') window.localStorage.setItem(customStorageKey, JSON.stringify(tokens));
    setTheme('custom');
  };

  const value = useMemo(() => ({ theme, setTheme, customTheme, setCustomTheme }), [theme, customTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() { const ctx = useContext(ThemeContext); if (!ctx) throw new Error('ThemeProvider missing'); return ctx; }
