'use client';
import { Activity, ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';
import { useAllocation, useCorrelation, useDrawdown, useHoldings, useRiskMetrics, useSectors } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';
import { deriveHealthInput, evaluatePortfolioHealth } from '../features/portfolio-health/lib/healthEngine';
import { HealthFindingCard } from '../features/portfolio-health/components/HealthFindingCard';
export default function PortfolioHealth(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const holdings = useHoldings(); const allocation = useAllocation(); const sectors = useSectors(); const drawdown = useDrawdown(); const correlation = useCorrelation(); const risk = useRiskMetrics();
  const loading = holdings.isLoading || allocation.isLoading || sectors.isLoading || drawdown.isLoading || correlation.isLoading || risk.isLoading;
  const error = holdings.error || allocation.error || sectors.error || drawdown.error || correlation.error || risk.error;
  const result = useMemo(() => {
    if (!holdings.data || !allocation.data || !sectors.data || !drawdown.data || !correlation.data || !risk.data) return null;
    return evaluatePortfolioHealth(deriveHealthInput(holdings.data, allocation.data, sectors.data, drawdown.data, correlation.data, risk.data.varPercent));
  }, [holdings.data, allocation.data, sectors.data, drawdown.data, correlation.data, risk.data]);
  return <QueryState isLoading={loading} error={error} onRetry={() => { void Promise.all([holdings.refetch(), allocation.refetch(), sectors.refetch(), drawdown.refetch(), correlation.refetch(), risk.refetch()]); }}>{result && <div className="health-widget"><div className="health-hero"><div><span className="feature-kicker"><Activity size={12}/> POLICY MONITOR</span><h3>Portfolio Health Center</h3><p>Rules-based diagnostics that turn portfolio data into explainable monitoring signals.</p></div><div className={`health-score ${result.status.toLowerCase().replaceAll(' ', '-')}`}><ShieldCheck size={17}/><strong>{result.score}</strong><span>{result.status}</span></div></div><div className="health-summary"><strong>{result.breachedRules === 0 ? 'No policy exceptions detected.' : `${result.breachedRules} policy exception${result.breachedRules === 1 ? '' : 's'} detected.`}</strong><span>Monitoring rules are explicit and explainable; this module is decision support, not a trade recommendation.</span></div><div className="health-findings">{result.findings.map((finding) => <HealthFindingCard key={finding.id} finding={finding} />)}</div></div>}</QueryState>;
}
