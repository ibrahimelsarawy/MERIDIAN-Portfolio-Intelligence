import { describe, expect, it } from 'vitest';
import { runDataQualityChecks } from './qualityEngine';

describe('runDataQualityChecks', () => {
  it('flags allocation totals that do not reconcile to 100%', () => {
    const checks = runDataQualityChecks(
      [{ ticker: 'AAA', name: 'AAA', quantity: 1, price: 100, weight: 60, pnl: 1, sector: 'Technology' }, { ticker: 'BBB', name: 'BBB', quantity: 1, price: 100, weight: 30, pnl: 1, sector: 'Financials' }],
      [{ name: 'Equities', value: 90, change: 0 }],
      [{ date: 'D1', portfolio: 100, benchmark: 100 }, { date: 'D2', portfolio: 101, benchmark: 100.5 }],
    );
    expect(checks.find((item) => item.id === 'weights')?.status).toBe('FAIL');
    expect(checks.find((item) => item.id === 'allocation')?.status).toBe('FAIL');
  });
});
