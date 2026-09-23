'use client';

import { GripVertical, MoreHorizontal, Settings2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { confirmDestructiveAction, showSuccess } from '../lib/feedback';

type WidgetShellProps = {
  title: string;
  subtitle?: string;
  onRemove: () => void;
  config?: Record<string, unknown>;
  onConfigChange?: (next: Record<string, unknown>) => void;
  children: ReactNode;
};

export function WidgetShell({ title, subtitle, onRemove, config = {}, onConfigChange, children }: WidgetShellProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState(() => JSON.stringify(config, null, 2));

  const handleRemove = async () => {
    const confirmed = await confirmDestructiveAction({ title: `Remove ${title}?`, text: 'This widget will be removed from the current dashboard layout.', confirmText: 'Yes, remove it' });
    if (!confirmed) return;
    onRemove(); void showSuccess('Widget removed', `${title} was removed successfully.`);
  };
  const applyConfig = () => {
    try { onConfigChange?.(JSON.parse(draft) as Record<string, unknown>); setSettingsOpen(false); void showSuccess('Configuration saved', `${title} settings were updated.`); }
    catch { void showSuccess('Invalid configuration', 'Please provide valid JSON before applying changes.'); }
  };

  return <motion.section className="widget" role="region" aria-label={title} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
    <header className="widget-header">
      <div className="widget-title-group"><GripVertical className="drag-handle-icon" size={16} aria-hidden="true" /><div><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}</div></div>
      <div className="widget-actions">
        <button type="button" className="icon-button" aria-label={`Configure ${title}`} onClick={() => { setDraft(JSON.stringify(config, null, 2)); setSettingsOpen(true); }}><Settings2 size={16} /></button>
        <button type="button" className="icon-button" aria-label={`More options for ${title}`}><MoreHorizontal size={17} /></button>
        <motion.button type="button" className="icon-button danger-action" aria-label={`Remove ${title}`} onClick={handleRemove} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}><X size={17} /></motion.button>
      </div>
    </header>
    <div className="widget-body" tabIndex={0}>{children}</div>
    <AnimatePresence>{settingsOpen && <motion.div className="widget-settings-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettingsOpen(false)}><motion.div className="widget-settings" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} onClick={(event) => event.stopPropagation()}><div><span className="eyebrow">WIDGET CONFIGURATION</span><h3>{title}</h3></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} aria-label={`${title} JSON configuration`} /><div className="widget-settings-actions"><button className="secondary-button" onClick={() => setSettingsOpen(false)}>Cancel</button><button className="primary-button" onClick={applyConfig}>Apply</button></div></motion.div></motion.div>}</AnimatePresence>
  </motion.section>;
}
