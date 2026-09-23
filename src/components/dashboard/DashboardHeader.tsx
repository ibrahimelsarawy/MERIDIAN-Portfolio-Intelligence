'use client';

import { Bell, Command, Database, RotateCcw, Search, SunMoon } from 'lucide-react';
import { LayoutManager } from '../layouts/LayoutManager';
import { ThemeBuilder } from '../../theme/ThemeBuilder';
import { motion } from 'framer-motion';
import { useTheme } from '../../theme/ThemeProvider';
import { useDashboardStore } from '../../store/dashboardStore';
import { confirmDestructiveAction, showSuccess } from '../../lib/feedback';

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const resetDashboard = useDashboardStore((state) => state.resetDashboard);
  const handleReset = async () => {
    const confirmed = await confirmDestructiveAction({ title: 'Reset workspace?', text: 'Restore the default Meridian layout.', confirmText: 'Reset workspace' });
    if (!confirmed) return;
    resetDashboard();
    void showSuccess('Workspace reset', 'The default analytics workspace is restored.');
  };
  const focusWorkspaceSearch = () => { document.getElementById('workspace-modules')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.setTimeout(() => document.querySelector<HTMLInputElement>('.catalogue-search input')?.focus(), 350); };
  return <header className="dashboard-header">
    <div className="header-copy"><span className="eyebrow">INVESTMENT DESK / OVERVIEW</span><h1>Portfolio Decision Workbench</h1><p>Monitor portfolio health, test scenarios, investigate risk, and plan allocation changes from one explainable workspace.</p></div>
    <div className="header-actions"><button type="button" className="search-box search-trigger" onClick={focusWorkspaceSearch} aria-label="Search workspace"><Search size={15}/><span>Search workspace</span><kbd><Command size={10}/>K</kbd></button><span className="data-status"><Database size={12}/> SIMULATED DATA</span><span className="live-status"><span className="live-dot"/>SIMULATION ACTIVE</span><button className="icon-button" aria-label="Notifications"><Bell size={17}/></button><button className="icon-button" aria-label="Theme"><SunMoon size={17}/></button><select className="theme-select" value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)} aria-label="Select dashboard theme"><option value="dark">Dark</option><option value="light">Light</option><option value="high-contrast">Contrast</option><option value="custom">Custom</option></select><ThemeBuilder /><LayoutManager /><motion.button className="icon-button" onClick={handleReset} aria-label="Reset workspace" whileTap={{ rotate: -45 }}><RotateCcw size={16}/></motion.button></div>
  </header>;
}
