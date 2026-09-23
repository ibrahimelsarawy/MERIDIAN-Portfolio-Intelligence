'use client';

import { useState } from 'react';
import { Activity, BarChart3, BriefcaseBusiness, ChevronDown, Command, LayoutDashboard, LineChart, Settings2, ShieldAlert, SlidersHorizontal } from 'lucide-react';

type SidebarItem = {
  label: string;
  icon: typeof LayoutDashboard;
  target?: string;
};

const nav: SidebarItem[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Portfolio', icon: BriefcaseBusiness, target: 'holdings-table' },
  { label: 'Performance', icon: LineChart, target: 'performance-line' },
  { label: 'Risk Center', icon: ShieldAlert, target: 'var-gauge' },
  { label: 'Analytics', icon: BarChart3, target: 'correlation-matrix' },
  { label: 'Health Center', icon: Activity, target: 'portfolio-health' },
  { label: 'Decision Journal', icon: BriefcaseBusiness, target: 'decision-journal' },
];

const scrollTo = (target?: string) => {
  if (!target) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const element = document.querySelector<HTMLElement>(`[data-widget-id=\"${target}\"]`);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export function PortfolioSidebar() {
  const [active, setActive] = useState('Overview');
  const [deskOpen, setDeskOpen] = useState(false);

  const handleNavigate = (item: SidebarItem) => {
    setActive(item.label);
    scrollTo(item.target);
  };

  const handleToolNavigate = (label: string, target: string) => {
    setActive(label);
    scrollTo(target);
  };

  const handleInvestmentDesk = () => {
    setActive('Investment Desk');
    setDeskOpen((open) => !open);
    window.requestAnimationFrame(() => scrollTo('investment-desk-workspace'));
  };

  const openDeskAction = (target: string) => {
    setActive('Investment Desk');
    setDeskOpen(false);
    scrollTo(target);
  };

  return (
    <aside className="portfolio-sidebar" aria-label="Main navigation">
      <div className="brand">
        <div className="brand-mark">M</div>
        <div><strong>MERIDIAN</strong><span>Portfolio Intelligence</span></div>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              type="button"
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleNavigate(item)}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{item.label}</span>
              {isActive && <i aria-hidden="true" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-section-label">TOOLS</div>
      <div className="sidebar-nav">
        <button type="button" className={`sidebar-link ${active === 'Scenario Lab' ? 'active' : ''}`} onClick={() => handleToolNavigate('Scenario Lab', 'stress-testing')}>
          <SlidersHorizontal size={17} aria-hidden="true" /><span>Scenario Lab</span>{active === 'Scenario Lab' && <i aria-hidden="true" />}
        </button>
        <button type="button" className={`sidebar-link ${active === 'Workspace' ? 'active' : ''}`} onClick={() => handleToolNavigate('Workspace', 'workspace-modules')}>
          <Settings2 size={17} aria-hidden="true" /><span>Workspace</span>{active === 'Workspace' && <i aria-hidden="true" />}
        </button>
      </div>

      <div className="sidebar-bottom">
        <button type="button" className="command-card command-card-button" onClick={() => { document.getElementById('workspace-modules')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.setTimeout(() => document.querySelector<HTMLInputElement>('.catalogue-search input')?.focus(), 350); }}>
          <Command size={15} aria-hidden="true" />
          <div><strong>Quick actions</strong><span>Search your workspace</span></div>
          <kbd>⌘ K</kbd>
        </button>
        <div className="investment-desk-menu">
          <button
            type="button"
            className={`profile profile-button ${deskOpen ? 'open' : ''}`}
            onClick={handleInvestmentDesk}
            aria-expanded={deskOpen}
            aria-controls="investment-desk-quick-menu"
            aria-label="Open Investment Desk portfolio decision workspace"
          >
            <div className="avatar">ID</div>
            <div><strong>Investment Desk</strong><span>Portfolio decision workspace</span></div>
            <ChevronDown className="desk-chevron" size={15} aria-hidden="true" />
          </button>
          {deskOpen && (
            <div id="investment-desk-quick-menu" className="investment-desk-quick-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => openDeskAction('investment-desk-workspace')}>Open workspace <span>↗</span></button>
              <button type="button" role="menuitem" onClick={() => openDeskAction('portfolio-health')}>Review portfolio health <span>↗</span></button>
              <button type="button" role="menuitem" onClick={() => openDeskAction('rebalance-planner')}>Plan rebalance <span>↗</span></button>
              <button type="button" role="menuitem" onClick={() => openDeskAction('decision-journal')}>Open decision journal <span>↗</span></button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
