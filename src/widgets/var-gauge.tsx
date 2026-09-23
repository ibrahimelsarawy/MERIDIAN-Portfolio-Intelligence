'use client';

import { useState } from 'react';
import { useRiskMetrics } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';

const describeRisk = (value: number) => value >= 90 ? 'High' : value >= 70 ? 'Elevated' : 'Within limit';
const zone = (value: number) => value >= 90 ? 'risk-high' : value >= 70 ? 'risk-elevated' : 'risk-normal';

export default function VarGauge(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useRiskMetrics(); const [confidence, setConfidence] = useState<95 | 99>(99); const [method, setMethod] = useState<'Historical' | 'Parametric'>('Historical');
  const base = query.data?.varPercent ?? 0;
  const varPercent = Math.min(99, Math.max(0, base + (confidence === 95 ? -6 : 0) + (method === 'Parametric' ? 3 : 0)));
  return <QueryState isLoading={query.isLoading} error={query.error} onRetry={() => query.refetch()}>{query.data && (() => {
    return <div className="var-widget"><div className="var-controls"><div><button className={confidence === 95 ? 'active' : ''} onClick={() => setConfidence(95)}>95%</button><button className={confidence === 99 ? 'active' : ''} onClick={() => setConfidence(99)}>99%</button></div><select value={method} onChange={(event) => setMethod(event.target.value as typeof method)} aria-label="VaR calculation method"><option>Historical</option><option>Parametric</option></select></div><div className={`var-gauge-wrap ${zone(varPercent)}`}><svg viewBox="0 0 140 82" role="img" aria-label={`${varPercent}% value at risk utilization`}><path className="var-track" d="M18 68 A52 52 0 0 1 122 68"/><path className="var-value" d="M18 68 A52 52 0 0 1 122 68" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - varPercent}/></svg><div className="var-percent"><strong>{varPercent}%</strong><span>of limit</span></div></div><div className="var-copy"><div><span>Confidence</span><strong>{confidence}% · 1-Day</strong></div><div><span>Estimated loss</span><strong>${(query.data.estimatedLoss / 1_000_000).toFixed(2)}M</strong></div><div><span>Status</span><strong className="var-status">{describeRisk(varPercent)}</strong></div></div></div>;
  })()}</QueryState>;
}
