'use client';
import { AlertTriangle, CheckCircle2, CircleAlert, Info } from 'lucide-react';
import type { HealthFinding } from '../types/health';
const icons = { critical: CircleAlert, warning: AlertTriangle, info: Info, clear: CheckCircle2 };
export function HealthFindingCard({ finding }: { finding: HealthFinding }) {
  const Icon = icons[finding.severity];
  const observed = finding.unit === 'ratio' ? finding.observed.toFixed(2) : `${finding.observed.toFixed(1)}%`;
  const threshold = finding.unit === 'ratio' ? finding.threshold.toFixed(2) : `${finding.threshold.toFixed(1)}%`;
  return <article className={`health-finding ${finding.severity}`}><div className="health-finding-icon"><Icon size={15} /></div><div className="health-finding-copy"><div className="health-finding-heading"><strong>{finding.label}</strong><span>{observed} / {threshold}</span></div><p>{finding.explanation}</p><small>{finding.severity === 'clear' ? 'Inside policy threshold' : finding.action}</small></div></article>;
}
