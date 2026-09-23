import { describe, expect, it, vi } from 'vitest';
import type { UseQueryResult } from '@tanstack/react-query';

const mocks = vi.hoisted(() => ({ useQuery: vi.fn((options) => options) }));
vi.mock('@tanstack/react-query', () => ({ useQuery: mocks.useQuery }));
vi.mock('../data/mockApi', () => ({ mockApi: {
  getAllocation: vi.fn(), getPerformance: vi.fn(), getSectors: vi.fn(), getHoldings: vi.fn(),
  getNews: vi.fn(), getAlerts: vi.fn(), getRiskMetrics: vi.fn(), getCorrelation: vi.fn(),
  getAttribution: vi.fn(), getMarketOverview: vi.fn(), getDrawdown: vi.fn(), getExposureTreemap: vi.fn(),
} }));
import * as hooks from './useDashboardData';

const cases: Array<[keyof typeof hooks, string, number | undefined]> = [
  ['useAllocation','allocation',undefined], ['usePerformance','performance',undefined], ['useSectors','sectors',undefined],
  ['useHoldings','holdings',undefined], ['useNewsFeed','news',20000], ['useAlerts','alerts',15000],
  ['useRiskMetrics','risk',10000], ['useCorrelation','correlation',undefined], ['useAttribution','attribution',undefined],
  ['useMarketOverview','market',5000], ['useDrawdown','drawdown',60000], ['useExposureTreemap','exposure-treemap',30000],
];

describe('dashboard data hooks', () => {
  it.each(cases)('%s configures query options', (hookName, key, interval) => {
    mocks.useQuery.mockClear();
    const result = (hooks[hookName] as () => UseQueryResult<unknown, Error>)();
    expect(result.queryKey).toEqual([key]);
    expect(result.staleTime).toBe(5000);
    if (interval === undefined) expect(result.refetchInterval).toBeUndefined(); else expect(result.refetchInterval).toBe(interval);
    expect(typeof result.queryFn).toBe('function');
  });
});
