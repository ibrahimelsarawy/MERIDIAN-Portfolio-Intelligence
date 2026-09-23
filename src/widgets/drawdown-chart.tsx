'use client';

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDrawdown } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';

export default function DrawdownChart(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useDrawdown();
  const maxDrawdown = useMemo(() => Math.min(...(query.data ?? []).map((item) => item.drawdown), 0), [query.data]);

  return (
    <QueryState isLoading={query.isLoading} error={query.error}>
      {(query.data?.length ?? 0) > 0 ? (
        <div className="drawdown-widget">
          <div className="drawdown-summary"><span>Max drawdown</span><strong>{maxDrawdown.toFixed(2)}%</strong><small>Recovery tracking enabled</small></div>
          <div className="chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={query.data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                <defs><linearGradient id="drawdownFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--negative)" stopOpacity={0.45}/><stop offset="100%" stopColor="var(--negative)" stopOpacity={0.04}/></linearGradient></defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 10 }} minTickGap={18} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <ReferenceLine y={0} stroke="var(--muted)" strokeDasharray="4 4" />
                <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10 }} />
                <Area type="monotone" dataKey="drawdown" stroke="var(--negative)" strokeWidth={2} fill="url(#drawdownFill)" animationDuration={500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : <div className="empty-state">No drawdown data available.</div>}
    </QueryState>
  );
}
