import { describe, expect, it } from 'vitest';
import { calculateScenario } from './scenarioEngine';
import type { Holding } from '../../../types/domain';

const holdings: Holding[] = [
  { ticker: 'AAA', name: 'Alpha', sector: 'Technology', quantity: 100, price: 100, weight: 60, pnl: 0 },
  { ticker: 'BBB', name: 'Beta', sector: 'Healthcare', quantity: 100, price: 100, weight: 40, pnl: 0 },
];

describe('calculateScenario', () => {
  it('calculates a weighted portfolio shock', () => {
    const result = calculateScenario(holdings, [
      { sector: 'Technology', shock: -10 },
      { sector: 'Healthcare', shock: -5 },
    ]);

    expect(result.portfolioImpact).toBe(-8);
    expect(result.projectedValue).toBe(92_000);
    expect(result.projectedLoss).toBe(8_000);
    expect(result.affectedHoldings).toBe(2);
  });

  it('ignores sectors without a configured shock', () => {
    const result = calculateScenario(holdings, [{ sector: 'Technology', shock: -10 }]);

    expect(result.portfolioImpact).toBe(-6);
    expect(result.affectedHoldings).toBe(1);
  });

  it('supports positive scenarios without reporting a loss', () => {
    const result = calculateScenario(holdings, [{ sector: 'Healthcare', shock: 5 }]);

    expect(result.portfolioImpact).toBe(2);
    expect(result.projectedLoss).toBe(0);
  });
});
