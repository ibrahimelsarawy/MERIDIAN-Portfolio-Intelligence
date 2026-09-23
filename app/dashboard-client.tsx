'use client';

import { useEffect } from 'react';
import { Providers } from './providers';
import { registerWidgets } from '@/src/registry/registerWidgets';
import { startMarketSimulation } from '@/src/data/marketSimulator';
import { DashboardGrid } from '@/src/grid/DashboardGrid';
import { WidgetCatalogue } from '@/src/components/WidgetCatalogue';
import { DashboardHeader } from '@/src/components/dashboard/DashboardHeader';
import { PortfolioSidebar } from '@/src/components/dashboard/PortfolioSidebar';
import { PortfolioKpis } from '@/src/components/dashboard/PortfolioKpis';
import { InvestmentDeskPanel } from '@/src/features/investment-desk/components/InvestmentDeskPanel';
import { AnalystCommandCenter } from '@/src/features/analyst-command-center/components/AnalystCommandCenter';

registerWidgets();

function DashboardRuntime() {
  useEffect(() => startMarketSimulation(), []);
  return <div className="meridian-shell"><PortfolioSidebar/><main className="main-canvas"><DashboardHeader/><PortfolioKpis/><InvestmentDeskPanel/><AnalystCommandCenter/><div id="workspace-modules" className="workspace-toolbar"><div><span className="eyebrow">ANALYTICS WORKSPACE</span><h2>Decision modules</h2></div><WidgetCatalogue/></div><DashboardGrid/></main></div>;
}

export default function DashboardClient() { return <Providers><DashboardRuntime/></Providers>; }
