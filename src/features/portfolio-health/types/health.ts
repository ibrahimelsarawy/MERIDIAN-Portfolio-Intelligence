export type HealthSeverity = 'critical' | 'warning' | 'info' | 'clear';
export type HealthRuleId = 'risk-utilization' | 'holding-concentration' | 'sector-concentration' | 'allocation-drift' | 'drawdown' | 'correlation';
export type HealthRule = { id: HealthRuleId; label: string; description: string; threshold: number; unit: '%' | 'ratio' };
export type HealthFinding = { id: HealthRuleId; label: string; severity: HealthSeverity; observed: number; threshold: number; unit: '%' | 'ratio'; explanation: string; action: string };
export type PortfolioHealthInput = { riskUtilization: number; topHoldingWeight: number; topSectorWeight: number; maxAllocationDrift: number; maxDrawdown: number; maxCorrelation: number };
export type PortfolioHealthResult = { score: number; status: 'Healthy' | 'Watch' | 'Action required'; findings: HealthFinding[]; breachedRules: number };
