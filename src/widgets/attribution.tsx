import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAttribution } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';

export default function Attribution(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useAttribution();
  return <QueryState isLoading={query.isLoading} error={query.error}>{query.data && <ResponsiveContainer width="100%" height="100%"><BarChart data={query.data}><CartesianGrid strokeDasharray="3 3" opacity={0.12} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Legend /><Bar dataKey="allocation" stackId="effect" fill="var(--chart-1)" /><Bar dataKey="selection" stackId="effect" fill="var(--chart-2)" /><Bar dataKey="interaction" stackId="effect" fill="var(--chart-3)" /></BarChart></ResponsiveContainer>}</QueryState>;
}
