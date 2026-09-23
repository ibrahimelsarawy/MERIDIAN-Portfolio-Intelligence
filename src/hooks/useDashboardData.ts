import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { mockApi } from '../data/mockApi';

type QueryOptions<T> = Omit<UseQueryOptions<T, Error, T, readonly string[]>, 'queryKey' | 'queryFn'> & {
  queryKey: readonly string[];
  queryFn: () => Promise<T>;
};

const queryOptions = <T>(queryKey: readonly string[], queryFn: () => Promise<T>, refetchInterval?: number): QueryOptions<T> => ({
  queryKey,
  queryFn,
  staleTime: 5_000,
  refetchInterval,
});

export const useAllocation = () => useQuery(queryOptions(['allocation'], mockApi.getAllocation));
export const usePerformance = () => useQuery(queryOptions(['performance'], mockApi.getPerformance));
export const useSectors = () => useQuery(queryOptions(['sectors'], mockApi.getSectors));
export const useHoldings = () => useQuery(queryOptions(['holdings'], mockApi.getHoldings));
export const useNewsFeed = () => useQuery(queryOptions(['news'], mockApi.getNews, 20_000));
export const useAlerts = () => useQuery(queryOptions(['alerts'], mockApi.getAlerts, 15_000));
export const useRiskMetrics = () => useQuery(queryOptions(['risk'], mockApi.getRiskMetrics, 10_000));
export const useCorrelation = () => useQuery(queryOptions(['correlation'], mockApi.getCorrelation));
export const useAttribution = () => useQuery(queryOptions(['attribution'], mockApi.getAttribution));
export const useMarketOverview = () => useQuery(queryOptions(['market'], mockApi.getMarketOverview, 5_000));

export const useDrawdown = () => useQuery(queryOptions(['drawdown'], mockApi.getDrawdown, 60_000));
export const useExposureTreemap = () => useQuery(queryOptions(['exposure-treemap'], mockApi.getExposureTreemap, 30_000));
