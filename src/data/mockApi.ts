import { allocation, alerts, attribution, correlation, drawdown, exposureTreemap, holdings, marketQuotes, news, performance, riskMetrics, sectors } from './mockData';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => structuredClone(value);

export const mockApi = {
  async getAllocation() { await delay(); return clone(allocation); },
  async getPerformance() { await delay(); return clone(performance); },
  async getSectors() { await delay(); return clone(sectors); },
  async getHoldings() { await delay(); return clone(holdings); },
  async getNews() { await delay(); return clone(news); },
  async getAlerts() { await delay(); return clone(alerts); },
  async getRiskMetrics() { await delay(); return clone(riskMetrics); },
  async getCorrelation() { await delay(); return clone(correlation); },
  async getAttribution() { await delay(); return clone(attribution); },
  async getMarketOverview() { await delay(); return clone(marketQuotes); },
  async getDrawdown() { await delay(); return clone(drawdown); },
  async getExposureTreemap() { await delay(); return clone(exposureTreemap); },
};
