'use client';

import { useMemo } from 'react';
import { ArrowRightLeft, SlidersHorizontal } from 'lucide-react';
import type { WidgetComponentProps } from '../types/widgets';
import { allocation } from '../data/mockData';
import { calculateRebalance, summarizeRebalance } from '../features/rebalancing/lib/rebalanceEngine';
import { RebalanceMetric } from '../features/rebalancing/components/RebalanceMetric';
import { RebalanceTable } from '../features/rebalancing/components/RebalanceTable';

const targets: Record<string, number> = { Equities: 50, 'Fixed Income': 25, Derivatives: 15, Alternatives: 10 };
const portfolioValue = 1_000_000;

export default function RebalancePlanner(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const rows = useMemo(() => calculateRebalance(allocation.map((item) => ({ name: item.name, current: item.value, target: targets[item.name] ?? item.value, value: portfolioValue }))), []);
  const summary = summarizeRebalance(rows);

  return <div className="rebalance-widget">
    <div className="rebalance-intro"><div><span className="feature-kicker"><ArrowRightLeft size={13}/> PORTFOLIO CONTROL</span><h3>Rebalance Planner</h3><p>Compare current allocation with your target policy and identify the trades required to bring drift back within tolerance.</p></div><button className="secondary-button"><SlidersHorizontal size={14}/> 1% tolerance</button></div>
    <div className="rebalance-metrics"><RebalanceMetric label="Trades Required" value={String(summary.tradeCount)} hint="outside tolerance"/><RebalanceMetric label="Estimated Turnover" value={`$${summary.turnover.toLocaleString()}`} hint="notional value"/><RebalanceMetric label="Max Drift" value={`${summary.maxDrift.toFixed(1)}%`} hint="largest deviation"/><RebalanceMetric label="Target Model" value="Balanced" hint="strategic allocation"/></div>
    <RebalanceTable rows={rows}/>
    <p className="rebalance-note">Illustrative analytics using mock portfolio values. Trade sizing is a planning estimate, not an execution instruction.</p>
  </div>;
}
