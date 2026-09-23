import { useSectors } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';

export default function SectorHeatMap(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useSectors();
  return <QueryState isLoading={query.isLoading} error={query.error}>{query.data && <div className="heat-grid">{query.data.map((sector) => <div key={sector.name} className="heat-cell" style={{ opacity: 0.45 + Math.min(Math.abs(sector.value) / 5, 0.55) }} data-direction={sector.value >= 0 ? 'positive' : 'negative'}><strong>{sector.name}</strong><span>{sector.value > 0 ? '+' : ''}{sector.value.toFixed(2)}%</span></div>)}</div>}</QueryState>;
}
