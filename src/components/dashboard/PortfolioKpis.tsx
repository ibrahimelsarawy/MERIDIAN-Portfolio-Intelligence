'use client';

import { ArrowDownRight, ArrowUpRight, DollarSign, Gauge, ShieldAlert, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { useHoldings, useRiskMetrics } from '../../hooks/useDashboardData';

export function PortfolioKpis() {
  const holdings = useHoldings();
  const risk = useRiskMetrics();
  const portfolioValue = useMemo(() => (holdings.data ?? []).reduce((sum, holding) => sum + holding.quantity * holding.price, 0), [holdings.data]);
  const cards = [
    { label: 'Portfolio Value', value: `$${(portfolioValue / 1_000_000).toFixed(2)}M`, delta: 'Calculated from holdings', icon: DollarSign, tone: 'positive', hint: 'simulated portfolio NAV' },
    { label: 'YTD Return', value: '+8.64%', delta: '+1.21%', icon: TrendingUp, tone: 'positive', hint: 'vs. benchmark · simulated' },
    { label: 'Risk Utilization', value: `${risk.data?.varPercent ?? 0}%`, delta: `${Math.max(0, 100 - (risk.data?.varPercent ?? 0))}% headroom`, icon: Gauge, tone: (risk.data?.varPercent ?? 0) >= 80 ? 'warning' : 'positive', hint: 'VaR policy threshold' },
    { label: 'Decision Status', value: (risk.data?.varPercent ?? 0) >= 80 ? 'Watch' : 'Healthy', delta: (risk.data?.varPercent ?? 0) >= 80 ? '2 policy flags' : 'No policy flags', icon: ShieldAlert, tone: (risk.data?.varPercent ?? 0) >= 80 ? 'warning' : 'positive', hint: 'see Portfolio Health Center' },
  ] as const;

  return <section className="portfolio-kpis" aria-label="Portfolio summary">{cards.map(({ label, value, delta, icon: Icon, tone, hint }) => <article className="kpi-card" key={label}><div className="kpi-top"><span>{label}</span><div className="kpi-icon"><Icon size={16}/></div></div><strong>{value}</strong><div className={`kpi-delta ${tone}`}>{tone === 'positive' ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>} {delta}</div><small>{hint}</small></article>)}</section>;
}
