import { useMemo } from 'react';
import { useCorrelation } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';

export default function CorrelationMatrix(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useCorrelation();
  const labels = useMemo(() => [...new Set((query.data ?? []).map((cell) => cell.row))], [query.data]);
  const cellMap = useMemo(() => new Map((query.data ?? []).map((cell) => [`${cell.row}:${cell.column}`, cell.value])), [query.data]);
  return <QueryState isLoading={query.isLoading} error={query.error}>{labels.length > 0 && <div className="matrix-wrapper"><div className="matrix-labels matrix-columns">{labels.map((label) => <span key={label}>{label.slice(0, 4)}</span>)}</div><div className="matrix-body">{labels.map((row) => <div className="matrix-row" key={row}>{labels.map((column) => { const value = cellMap.get(`${row}:${column}`) ?? 0; return <div key={column} className="matrix-cell" title={`${row} / ${column}: ${value}`} style={{ opacity: 0.2 + Math.abs(value) * 0.8 }} data-positive={value >= 0}>{value.toFixed(1)}</div>; })}</div>)}</div></div>}</QueryState>;
}
