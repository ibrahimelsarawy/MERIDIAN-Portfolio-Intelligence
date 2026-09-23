import type { Holding } from '../../../types/domain';
import type { ScenarioResult, SectorShock } from '../types/scenario';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function calculateScenario(holdings: Holding[], shocks: SectorShock[]): ScenarioResult {
  const shockMap = new Map(shocks.map(({ sector, shock }) => [sector, shock]));
  const portfolioValue = holdings.reduce((sum, holding) => sum + holding.quantity * holding.price, 0);

  const weightedImpact = holdings.reduce((sum, holding) => {
    const shock = shockMap.get(holding.sector) ?? 0;
    return sum + (holding.weight / 100) * shock;
  }, 0);

  const normalizedImpact = Number(weightedImpact.toFixed(2));
  const projectedValue = portfolioValue * (1 + normalizedImpact / 100);
  const projectedLoss = Math.max(0, portfolioValue - projectedValue);
  const projectedDrawdown = Number(clamp(Math.abs(normalizedImpact) * 1.18, 0, 100).toFixed(2));
  const riskUtilization = Number(clamp(82 + Math.abs(normalizedImpact) * 1.6, 0, 100).toFixed(1));
  const affectedHoldings = holdings.filter((holding) => (shockMap.get(holding.sector) ?? 0) !== 0).length;

  return {
    portfolioImpact: normalizedImpact,
    projectedValue,
    projectedLoss,
    projectedDrawdown,
    riskUtilization,
    affectedHoldings,
  };
}
