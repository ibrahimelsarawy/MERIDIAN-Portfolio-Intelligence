import { describe, expect, it } from 'vitest';
import { evaluatePortfolioHealth } from './healthEngine';

describe('portfolio health engine', () => {
  it('marks a clean portfolio as healthy', () => {
    const result = evaluatePortfolioHealth({ riskUtilization: 55, topHoldingWeight: 6, topSectorWeight: 22, maxAllocationDrift: 2, maxDrawdown: 5, maxCorrelation: 0.62 });
    expect(result.status).toBe('Healthy');
    expect(result.breachedRules).toBe(0);
  });
  it('flags policy breaches and provides explanations', () => {
    const result = evaluatePortfolioHealth({ riskUtilization: 96, topHoldingWeight: 15, topSectorWeight: 38, maxAllocationDrift: 8, maxDrawdown: 14, maxCorrelation: 0.91 });
    expect(result.breachedRules).toBe(6);
    expect(result.findings.every((finding) => finding.action.length > 0)).toBe(true);
    expect(result.status).toBe('Action required');
  });
});
