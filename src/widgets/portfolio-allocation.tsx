import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useAllocation } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

export default function PortfolioAllocation(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useAllocation();
  return <QueryState isLoading={query.isLoading} error={query.error}>{query.data && <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={query.data} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={3}>{query.data.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>}</QueryState>;
}
