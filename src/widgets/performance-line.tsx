import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { usePerformance } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';

export default function PerformanceLine(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = usePerformance();
  return <QueryState isLoading={query.isLoading} error={query.error}>{query.data && <ResponsiveContainer width="100%" height="100%"><LineChart data={query.data}><CartesianGrid strokeDasharray="3 3" opacity={0.15} /><XAxis dataKey="date" hide /><YAxis domain={['dataMin - 2', 'dataMax + 2']} width={38} /><Tooltip /><Legend /><Line type="monotone" dataKey="portfolio" name="Portfolio" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} /><Line type="monotone" dataKey="benchmark" name="Benchmark" stroke="var(--chart-3)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>}</QueryState>;
}
