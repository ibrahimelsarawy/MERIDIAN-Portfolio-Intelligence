export type ScenarioId = 'market-selloff' | 'rate-shock' | 'sector-rotation' | 'custom';

export type SectorShock = {
  sector: string;
  shock: number;
};

export type ScenarioPreset = {
  id: Exclude<ScenarioId, 'custom'>;
  name: string;
  description: string;
  shocks: SectorShock[];
};

export type ScenarioResult = {
  portfolioImpact: number;
  projectedValue: number;
  projectedLoss: number;
  projectedDrawdown: number;
  riskUtilization: number;
  affectedHoldings: number;
};
