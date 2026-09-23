'use client';

import { useMemo, useState } from 'react';
import { useExposureTreemap } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { ExposureNode } from '../types/domain';
import type { WidgetComponentProps } from '../types/widgets';

const tones = ['var(--accent)', 'var(--positive)', 'var(--warning)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)'];

export default function ExposureTreemap(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useExposureTreemap();
  const [path, setPath] = useState<string | null>(null);
  const active = useMemo<ExposureNode[]>(() => {
    if (!path) return query.data ?? [];
    return query.data?.find((node) => node.name === path)?.children ?? [];
  }, [path, query.data]);
  const total = active.reduce((sum, node) => sum + node.value, 0) || 1;

  return <QueryState isLoading={query.isLoading} error={query.error}>
    <div className="exposure-widget">
      <div className="treemap-toolbar"><div><span>Exposure hierarchy</span><strong>{path ?? 'All asset classes'}</strong></div>{path && <button className="secondary-button" onClick={() => setPath(null)}>Back to overview</button>}</div>
      {active.length > 0 ? <div className="exposure-map" role="list" aria-label="Portfolio exposure treemap">
        {active.map((node, index) => <button key={node.name} role="listitem" className="exposure-node" style={{ flexGrow: node.value, background: `color-mix(in srgb, ${tones[index % tones.length]} 72%, var(--panel))` }} onClick={() => !path && node.children && setPath(node.name)} aria-label={`${node.name} exposure ${node.value}%`}>
          <strong>{node.name}</strong><span>{node.value}%</span><small>{((node.value / total) * 100).toFixed(1)}% of view</small>
        </button>)}
      </div> : <div className="empty-state">No exposure data available.</div>}
    </div>
  </QueryState>;
}
