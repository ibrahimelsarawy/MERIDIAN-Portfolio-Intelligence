import type { Holding, PerformancePoint, AllocationItem } from '../../../types/domain';
import type { QualityCheck } from '../types';

export function runDataQualityChecks(holdings: Holding[], allocation: AllocationItem[], performance: PerformancePoint[]): QualityCheck[] {
  const weightTotal = holdings.reduce((sum, item) => sum + item.weight, 0);
  const allocationTotal = allocation.reduce((sum, item) => sum + item.value, 0);
  const duplicateTickers = new Set<string>();
  const duplicates = holdings.filter((item) => duplicateTickers.has(item.ticker) || !duplicateTickers.add(item.ticker)).length;
  const finitePrices = holdings.every((item) => Number.isFinite(item.price) && item.price > 0);
  const orderedDates = performance.every((item, index) => index === 0 || item.date !== performance[index - 1].date);
  return [
    { id: 'weights', label: 'Holding weights', status: Math.abs(weightTotal - 100) < 0.5 ? 'PASS' : 'FAIL', detail: `${weightTotal.toFixed(2)}% total weight; expected 100%.` },
    { id: 'allocation', label: 'Asset allocation', status: Math.abs(allocationTotal - 100) < 0.5 ? 'PASS' : 'FAIL', detail: `${allocationTotal.toFixed(2)}% total allocation; expected 100%.` },
    { id: 'duplicates', label: 'Duplicate instruments', status: duplicates === 0 ? 'PASS' : 'WARN', detail: duplicates === 0 ? 'No duplicate tickers detected.' : `${duplicates} duplicate rows detected.` },
    { id: 'prices', label: 'Price integrity', status: finitePrices ? 'PASS' : 'FAIL', detail: finitePrices ? 'All holding prices are positive and finite.' : 'One or more holding prices are invalid.' },
    { id: 'timeline', label: 'Performance timeline', status: orderedDates ? 'PASS' : 'WARN', detail: orderedDates ? 'No duplicate observation dates detected.' : 'Duplicate observation dates detected.' },
  ];
}
