import { describe, expect, it } from 'vitest';
import { runBacktest } from './backtestEngine';

describe('runBacktest', () => {
  it('returns comparable strategy profiles from performance observations', () => {
    const result = runBacktest([
      { date: 'D1', portfolio: 100, benchmark: 100 },
      { date: 'D2', portfolio: 102, benchmark: 101 },
      { date: 'D3', portfolio: 101, benchmark: 100.5 },
      { date: 'D4', portfolio: 104, benchmark: 102 },
    ]);
    expect(result).toHaveLength(3);
    expect(result[0].finalValue).toBeGreaterThan(100_000);
    expect(result[0].maxDrawdown).toBeLessThanOrEqual(0);
  });
});
