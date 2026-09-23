'use client';

import { useRef, useState } from 'react';
import { Download, FolderOpen, Save, Trash2, Upload, History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDashboardStore } from '../../store/dashboardStore';
import { downloadJSON, fromJSON, toJSON } from '../../features/layouts/layoutSerializer';
import { confirmDestructiveAction, showError, showSuccess } from '../../lib/feedback';

export function LayoutManager() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [historyFor, setHistoryFor] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const savedLayouts = useDashboardStore((state) => state.savedLayouts);
  const saveCurrentLayout = useDashboardStore((state) => state.saveCurrentLayout);
  const loadSavedLayout = useDashboardStore((state) => state.loadSavedLayout);
  const deleteSavedLayout = useDashboardStore((state) => state.deleteSavedLayout);
  const restoreVersion = useDashboardStore((state) => state.restoreVersion);
  const exportCurrentSnapshot = useDashboardStore((state) => state.exportCurrentSnapshot);
  const importSnapshot = useDashboardStore((state) => state.importSnapshot);

  const handleSave = () => {
    saveCurrentLayout(name || 'My Meridian Layout', description);
    setName(''); setDescription('');
    void showSuccess('Layout saved', 'A new version of your dashboard has been saved locally.');
  };
  const handleLoad = (id: string) => { if (loadSavedLayout(id)) { setOpen(false); void showSuccess('Layout loaded', 'Your saved workspace is now active.'); } };
  const handleDelete = async (id: string) => {
    if (!await confirmDestructiveAction({ title: 'Delete saved layout?', text: 'This will permanently remove the layout and its version history.', confirmText: 'Delete layout' })) return;
    deleteSavedLayout(id); void showSuccess('Layout deleted', 'The saved layout was removed.');
  };
  const handleExport = () => downloadJSON('meridian-layout.json', toJSON(exportCurrentSnapshot()));
  const handleImport = async (file: File) => {
    try { importSnapshot(fromJSON(await file.text()), file.name.replace(/\.json$/i, '')); void showSuccess('Layout imported', 'The imported layout has been loaded and saved.'); }
    catch (error) { void showError('Import failed', error instanceof Error ? error.message : 'Unable to read this layout file.'); }
  };

  return <>
    <button className="secondary-button" onClick={() => setOpen(true)}><FolderOpen size={16}/>Layouts</button>
    <button className="secondary-button" onClick={handleExport}><Download size={16}/>Export</button>
    <button className="secondary-button" onClick={() => fileInput.current?.click()}><Upload size={16}/>Import</button>
    <input ref={fileInput} className="sr-only" type="file" accept="application/json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImport(file); event.currentTarget.value = ''; }} />
    <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpen(false)}>
      <motion.section className="layout-modal" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-title"><div><span className="eyebrow">WORKSPACE LIBRARY</span><h2>Save & manage layouts</h2></div><button className="icon-button" onClick={() => setOpen(false)}>×</button></div>
        <div className="save-layout-form"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Layout name"/><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (optional)"/><button className="primary-button" onClick={handleSave}><Save size={16}/>Save current</button></div>
        <div className="saved-layout-list">{savedLayouts.length === 0 ? <p className="empty-state">No saved layouts yet. Save your current workspace to create one.</p> : savedLayouts.map((item) => <article className="saved-layout-card" key={item.id}>
          <div><strong>{item.name}</strong><p>{item.description || 'No description'}</p><small>{item.versions.length} version{item.versions.length === 1 ? '' : 's'} · Updated {new Date(item.updatedAt).toLocaleString()}</small></div>
          <div className="layout-card-actions"><button className="secondary-button" onClick={() => handleLoad(item.id)}>Load</button><button className="icon-button" title="Version history" onClick={() => setHistoryFor(historyFor === item.id ? null : item.id)}><History size={16}/></button><button className="icon-button danger-action" title="Delete layout" onClick={() => void handleDelete(item.id)}><Trash2 size={16}/></button></div>
          <AnimatePresence>{historyFor === item.id && <motion.div className="version-history" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{[...item.versions].reverse().map((version) => <div key={version.id}><span>{new Date(version.createdAt).toLocaleString()}</span><button className="secondary-button" onClick={() => { if (restoreVersion(item.id, version.id)) { void showSuccess('Version restored', 'The selected version is now your active dashboard.'); } }}>Restore</button></div>)}</motion.div>}</AnimatePresence>
        </article>)}</div>
      </motion.section>
    </motion.div>}</AnimatePresence>
  </>;
}
