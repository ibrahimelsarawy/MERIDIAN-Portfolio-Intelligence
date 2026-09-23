import type { RebalanceRow } from '../types/rebalancing';

export function RebalanceTable({ rows }: { rows: RebalanceRow[] }) {
  return <div className="rebalance-table-wrap"><table className="rebalance-table"><thead><tr><th>Exposure</th><th>Current</th><th>Target</th><th>Drift</th><th>Action</th><th>Trade</th></tr></thead><tbody>{rows.map((row) => <tr key={row.name}><td><strong>{row.name}</strong></td><td>{row.current.toFixed(1)}%</td><td>{row.target.toFixed(1)}%</td><td className={Math.abs(row.drift) > 1 ? 'negative' : ''}>{row.drift > 0 ? '+' : ''}{row.drift.toFixed(1)}%</td><td><span className={`rebalance-action ${row.action.toLowerCase()}`}>{row.action}</span></td><td>${row.tradeValue.toLocaleString()}</td></tr>)}</tbody></table></div>;
}
