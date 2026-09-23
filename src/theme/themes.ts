export type ThemeName = 'dark' | 'light' | 'high-contrast' | 'custom';

type ThemeTokens = Record<string, string>;

const shared: ThemeTokens = {
  '--radius-sm': '8px',
  '--radius-md': '12px',
  '--radius-lg': '18px',
  '--chart-1': '#4da3ff',
  '--chart-2': '#25c49a',
  '--chart-3': '#f6bd3b',
  '--chart-4': '#9b87f5',
  '--chart-5': '#ef7f6d',
  '--chart-6': '#4fb6b0',
};

export const themes: Record<Exclude<ThemeName, 'custom'>, ThemeTokens> = {
  dark: {
    ...shared,
    '--bg': '#070a0f', '--panel': '#0d121a', '--panel-2': '#111824', '--panel-3': '#151e2a',
    '--text': '#f4f7fb', '--muted': '#8c99aa', '--muted-strong': '#b4bfce', '--border': '#202a38',
    '--accent': '#78e3c4', '--positive': '#62d6a7', '--negative': '#ff6f7d', '--warning': '#f2c66d',
    '--on-accent': '#07110e', '--overlay': 'rgba(0,0,0,.62)', '--shadow': 'rgba(0,0,0,.22)',
    '--accent-soft': 'rgba(120,227,196,.10)', '--positive-soft': 'rgba(98,214,167,.10)',
    '--negative-soft': 'rgba(255,111,125,.10)', '--warning-soft': 'rgba(242,198,109,.10)',
  },
  light: {
    ...shared,
    '--bg': '#f5f7fb', '--panel': '#ffffff', '--panel-2': '#f0f4f8', '--panel-3': '#e8eef5',
    '--text': '#142033', '--muted': '#64748b', '--muted-strong': '#3f4e63', '--border': '#d6dee8',
    '--accent': '#087f6b', '--positive': '#087f5b', '--negative': '#c92f45', '--warning': '#996500',
    '--on-accent': '#ffffff', '--overlay': 'rgba(15,23,42,.38)', '--shadow': 'rgba(15,23,42,.10)',
    '--accent-soft': 'rgba(8,127,107,.10)', '--positive-soft': 'rgba(8,127,91,.10)',
    '--negative-soft': 'rgba(201,47,69,.10)', '--warning-soft': 'rgba(153,101,0,.11)',
  },
  'high-contrast': {
    ...shared,
    '--bg': '#000000', '--panel': '#050505', '--panel-2': '#111111', '--panel-3': '#1b1b1b',
    '--text': '#ffffff', '--muted': '#f1f1f1', '--muted-strong': '#ffffff', '--border': '#ffffff',
    '--accent': '#00ffff', '--positive': '#00ff88', '--negative': '#ff4d4d', '--warning': '#ffff00',
    '--on-accent': '#000000', '--overlay': 'rgba(0,0,0,.80)', '--shadow': 'rgba(0,0,0,.70)',
    '--accent-soft': 'rgba(0,255,255,.14)', '--positive-soft': 'rgba(0,255,136,.14)',
    '--negative-soft': 'rgba(255,77,77,.14)', '--warning-soft': 'rgba(255,255,0,.14)',
    '--chart-1': '#00ffff', '--chart-2': '#00ff88', '--chart-3': '#ffff00', '--chart-4': '#ff8cff', '--chart-5': '#ff6666', '--chart-6': '#66ffff',
  },
};
