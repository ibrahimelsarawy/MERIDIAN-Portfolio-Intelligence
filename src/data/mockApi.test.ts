import { describe, expect, it, vi, afterEach } from 'vitest';
import { mockApi } from './mockApi';
import { allocation } from './mockData';

describe('mockApi', () => {
  afterEach(() => vi.restoreAllMocks());

  const runImmediately = (callback: Parameters<typeof setTimeout>[0]) => {
    callback();
    return 1 as ReturnType<typeof setTimeout>;
  };

  it('returns cloned data for each endpoint', async () => {
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(runImmediately);
    const result = await mockApi.getAllocation();
    expect(result).toEqual(allocation);
    expect(result).not.toBe(allocation);
  });

  it('exposes every dashboard data source', async () => {
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(runImmediately);
    const values = await Promise.all([
      mockApi.getPerformance(), mockApi.getSectors(), mockApi.getHoldings(), mockApi.getNews(),
      mockApi.getAlerts(), mockApi.getRiskMetrics(), mockApi.getCorrelation(), mockApi.getAttribution(),
      mockApi.getMarketOverview(), mockApi.getDrawdown(), mockApi.getExposureTreemap(),
    ]);
    expect(values.every(Boolean)).toBe(true);
  });
});
