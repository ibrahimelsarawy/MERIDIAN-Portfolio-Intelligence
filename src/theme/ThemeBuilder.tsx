'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { Download, Palette, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, type ThemeTokens } from './ThemeProvider';
import { themes } from './themes';

const editableTokens = ['--bg', '--panel', '--panel-2', '--text', '--muted', '--border', '--accent', '--positive', '--negative', '--warning'] as const;

function contrastText(hex: string) {
  const value = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) return 'Unknown';
  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
  const lum = (channel: number) => channel <= .03928 ? channel / 12.92 : Math.pow((channel + .055) / 1.055, 2.4);
  const ratio = (Math.max(lum(r), lum(g), lum(b)) + .05) / (Math.min(lum(r), lum(g), lum(b)) + .05);
  return ratio >= 4.5 ? 'AA candidate' : 'Review contrast';
}

export function ThemeBuilder() {
  const { theme, customTheme, setCustomTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ThemeTokens>({ ...themes.dark, ...customTheme });
  const inputRef = useRef<HTMLInputElement>(null);

  const exportTheme = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'meridian-theme.json'; link.click(); URL.revokeObjectURL(url);
  };
  const importTheme = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => { try { const parsed = JSON.parse(String(reader.result)) as ThemeTokens; setDraft((current) => ({ ...current, ...parsed })); } catch { /* invalid JSON ignored */ } };
    reader.readAsText(file);
  };

  return <>
    <button className="secondary-button" type="button" onClick={() => setOpen(true)} aria-label="Open theme builder"><Palette size={16}/>Theme Builder</button>
    <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className="theme-builder-modal" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}>
        <div className="modal-title"><div><span className="eyebrow">WHITE-LABEL THEMING</span><h2>Theme Builder</h2><p>Current preset: {theme}</p></div><button className="icon-button" onClick={() => setOpen(false)}><X size={18}/></button></div>
        <div className="theme-token-grid">{editableTokens.map((token) => <label key={token} className="theme-token"><span>{token.replace('--', '')}</span><input type="color" value={draft[token] ?? '#000000'} onChange={(event) => setDraft((current) => ({ ...current, [token]: event.target.value }))}/><small>{token === '--text' ? contrastText(draft[token] ?? '#000000') : draft[token]}</small></label>)}</div>
        <div className="theme-preview" style={draft as CSSProperties}><strong>Live preview</strong><span>Institutional analytics tokens update immediately.</span></div>
        <div className="theme-builder-actions"><button className="secondary-button" onClick={exportTheme}><Download size={15}/>Export JSON</button><button className="secondary-button" onClick={() => inputRef.current?.click()}><Upload size={15}/>Import JSON</button><input ref={inputRef} className="sr-only" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importTheme(event.target.files[0])}/><button className="primary-button" onClick={() => { setCustomTheme(draft); setOpen(false); }}>Apply custom theme</button></div>
      </motion.section>
    </motion.div>}</AnimatePresence>
  </>;
}
