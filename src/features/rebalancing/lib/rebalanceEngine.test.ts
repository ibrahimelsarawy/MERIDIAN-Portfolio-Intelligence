import { describe, expect, it } from 'vitest';
import { calculateRebalance, summarizeRebalance } from './rebalanceEngine';

describe('rebalance engine', () => {
  it('classifies drift into buy, sell and hold', () => {
    const rows = calculateRebalance([
      { name: 'Equities', current: 58, target: 52, value: 1_000_000 },
      { name: 'Bonds', current: 20, target: 25, value: 1_000_000 },
      { name: 'Cash', current: 10, target: 10, value: 1_000_000 },
    ]);
    expect(rows.map((row) => row.action)).toEqual(['SELL', 'BUY', 'HOLD']);
    expect(summarizeRebalance(rows).tradeCount).toBe(2);
  });
});
