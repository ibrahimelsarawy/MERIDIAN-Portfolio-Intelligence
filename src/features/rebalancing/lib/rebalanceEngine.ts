import type { AllocationTarget, RebalanceRow } from '../types/rebalancing';

export function calculateRebalance(items: AllocationTarget[], tolerance = 1): RebalanceRow[] {
  return items.map((item) => {
    const drift = Number((item.current - item.target).toFixed(2));
    const action = Math.abs(drift) <= tolerance ? 'HOLD' : drift > 0 ? 'SELL' : 'BUY';
    const tradeValue = Number((Math.abs(drift) / 100 * item.value).toFixed(0));
    return { ...item, drift, action, tradeValue };
  });
}

export function summarizeRebalance(rows: RebalanceRow[]) {
  const trades = rows.filter((row) => row.action !== 'HOLD');
  return {
    tradeCount: trades.length,
    turnover: trades.reduce((sum, row) => sum + row.tradeValue, 0),
    maxDrift: rows.reduce((max, row) => Math.max(max, Math.abs(row.drift)), 0),
  };
}
