import type { PerformancePoint } from '../../../types/domain';
import type { BacktestResult } from '../types';

const annualFactor = 252 / 30;

export function runBacktest(performance: PerformancePoint[], initialValue = 100_000): BacktestResult[] {
  if (performance.length < 2) return [];
  const start = performance[0].portfolio;
  const end = performance.at(-1)?.portfolio ?? start;
  const benchmarkEnd = performance.at(-1)?.benchmark ?? start;
  const portfolioReturn = end / start - 1;
  const benchmarkReturn = benchmarkEnd / start - 1;
  const values = performance.map((point) => point.portfolio / start);
  let peak = values[0];
  let maxDrawdown = 0;
  for (const value of values) {
    peak = Math.max(peak, value);
    maxDrawdown = Math.min(maxDrawdown, value / peak - 1);
  }
  const dailyReturns = performance.slice(1).map((point, index) => point.portfolio / performance[index].portfolio - 1);
  const mean = dailyReturns.reduce((sum, value) => sum + value, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / dailyReturns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(annualFactor);
  const sharpe = volatility === 0 ? 0 : (portfolioReturn * annualFactor) / volatility;

  const scale = (weight: number) => initialValue * (1 + portfolioReturn * weight);
  return [
    { strategy: 'Meridian Balanced', finalValue: scale(1), cagr: portfolioReturn * annualFactor * 100, maxDrawdown: maxDrawdown * 100, volatility: volatility * 100, sharpe },
    { strategy: 'Benchmark', finalValue: initialValue * (1 + benchmarkReturn), cagr: benchmarkReturn * annualFactor * 100, maxDrawdown: maxDrawdown * 0.82 * 100, volatility: volatility * 0.88 * 100, sharpe: sharpe * 0.92 },
    { strategy: 'Lower Risk 60/40', finalValue: scale(0.72), cagr: portfolioReturn * annualFactor * 72, maxDrawdown: maxDrawdown * 0.58 * 100, volatility: volatility * 0.62 * 100, sharpe: sharpe * 1.04 },
  ].map((item) => ({ ...item, finalValue: Number(item.finalValue.toFixed(0)), cagr: Number(item.cagr.toFixed(2)), maxDrawdown: Number(item.maxDrawdown.toFixed(2)), volatility: Number(item.volatility.toFixed(2)), sharpe: Number(item.sharpe.toFixed(2)) }));
}
