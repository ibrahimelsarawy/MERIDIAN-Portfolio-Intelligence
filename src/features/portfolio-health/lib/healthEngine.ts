import type { AllocationItem, CorrelationCell, DrawdownPoint, Holding, SectorItem } from '../../../types/domain';
import type { HealthFinding, HealthRule, PortfolioHealthInput, PortfolioHealthResult } from '../types/health';

export const DEFAULT_HEALTH_RULES: HealthRule[] = [
  { id: 'risk-utilization', label: 'Risk utilization', description: 'VaR usage should stay below the configured risk budget.', threshold: 80, unit: '%' },
  { id: 'holding-concentration', label: 'Top holding', description: 'Single-name concentration should remain below the configured limit.', threshold: 10, unit: '%' },
  { id: 'sector-concentration', label: 'Sector concentration', description: 'Sector exposure should remain below the configured limit.', threshold: 30, unit: '%' },
  { id: 'allocation-drift', label: 'Allocation drift', description: 'Asset-class drift should remain inside the rebalance tolerance.', threshold: 5, unit: '%' },
  { id: 'drawdown', label: 'Drawdown', description: 'Peak-to-trough loss should remain below the configured monitoring level.', threshold: 10, unit: '%' },
  { id: 'correlation', label: 'Correlation', description: 'High pairwise correlation can reduce diversification benefits.', threshold: 0.8, unit: 'ratio' },
];

const finding = (id: HealthFinding['id'], label: string, observed: number, rule: HealthRule, explanation: string, action: string): HealthFinding => {
  const breached = observed > rule.threshold;
  return { id, label, severity: breached ? (observed > rule.threshold * 1.15 ? 'critical' : 'warning') : 'clear', observed: Number(observed.toFixed(2)), threshold: rule.threshold, unit: rule.unit, explanation, action };
};

export function deriveHealthInput(holdings: Holding[], allocation: AllocationItem[], _sectors: SectorItem[], drawdown: DrawdownPoint[], correlation: CorrelationCell[], riskUtilization: number): PortfolioHealthInput {
  const topHoldingWeight = Math.max(0, ...holdings.map((holding) => holding.weight));
  const sectorWeights = holdings.reduce<Record<string, number>>((acc, holding) => { acc[holding.sector] = (acc[holding.sector] ?? 0) + holding.weight; return acc; }, {});
  const topSectorWeight = Math.max(0, ...Object.values(sectorWeights));
  const targetByAssetClass: Record<string, number> = { Equities: 50, 'Fixed Income': 25, Derivatives: 15, Alternatives: 10 };
  const maxAllocationDrift = Math.max(0, ...allocation.map((item) => Math.abs(item.value - (targetByAssetClass[item.name] ?? item.value))));
  const maxDrawdown = Math.abs(Math.min(0, ...drawdown.map((point) => point.drawdown)));
  const maxCorrelation = Math.max(0, ...correlation.filter((cell) => cell.row !== cell.column).map((cell) => cell.value));
  return { riskUtilization, topHoldingWeight, topSectorWeight, maxAllocationDrift, maxDrawdown, maxCorrelation };
}

export function evaluatePortfolioHealth(input: PortfolioHealthInput, rules = DEFAULT_HEALTH_RULES): PortfolioHealthResult {
  const byId = new Map(rules.map((rule) => [rule.id, rule]));
  const findings = [
    finding('risk-utilization', 'Risk utilization', input.riskUtilization, byId.get('risk-utilization')!, 'VaR budget is being consumed faster than the configured policy level.', 'Review risk drivers and test a lower-risk scenario.'),
    finding('holding-concentration', 'Top holding', input.topHoldingWeight, byId.get('holding-concentration')!, 'One position represents a meaningful share of total portfolio weight.', 'Review single-name exposure and concentration tolerance.'),
    finding('sector-concentration', 'Sector concentration', input.topSectorWeight, byId.get('sector-concentration')!, 'The largest sector is carrying a material share of portfolio risk.', 'Compare sector exposure with the portfolio mandate.'),
    finding('allocation-drift', 'Allocation drift', input.maxAllocationDrift, byId.get('allocation-drift')!, 'At least one asset class has moved away from its reference allocation.', 'Open Rebalance Planner to inspect the required trade set.'),
    finding('drawdown', 'Drawdown', input.maxDrawdown, byId.get('drawdown')!, 'The portfolio has experienced a drawdown beyond the monitoring threshold.', 'Use Drawdown Analysis and Scenario Lab to investigate the path.'),
    finding('correlation', 'Correlation', input.maxCorrelation, byId.get('correlation')!, 'Highly correlated exposures may reduce diversification during stress.', 'Inspect the correlation matrix before increasing correlated exposures.'),
  ];
  const breachedRules = findings.filter((item) => item.severity !== 'clear').length;
  const weightedPenalty = findings.reduce((sum, item) => item.severity === 'critical' ? sum + 24 : item.severity === 'warning' ? sum + 12 : sum, 0);
  const score = Math.max(0, Math.min(100, 100 - weightedPenalty));
  const status = score >= 80 ? 'Healthy' : score >= 60 ? 'Watch' : 'Action required';
  return { score, status, findings, breachedRules };
}
