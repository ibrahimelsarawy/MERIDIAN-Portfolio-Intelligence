import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement, type ComponentType } from 'react';
import type { WidgetComponentProps } from '../types/widgets';
import PortfolioAllocation from './portfolio-allocation';
import PerformanceLine from './performance-line';
import SectorHeatMap from './sector-heatmap';
import HoldingsTable from './holdings-table';
import NewsFeed from './news-feed';
import Alerts from './alerts';
import VarGauge from './var-gauge';
import CorrelationMatrix from './correlation-matrix';
import Attribution from './attribution';
import MarketTicker from './market-ticker';
import DrawdownChart from './drawdown-chart';
import ExposureTreemap from './exposure-treemap';
import { widgetDefinitions } from './definitions';
import { allocation, alerts, attribution, correlation, drawdown, exposureTreemap, holdings, marketQuotes, news, performance, riskMetrics, sectors } from '../data/mockData';

vi.mock('../hooks/useDashboardData', () => ({
  useAllocation: () => ({ data: allocation, isLoading: false, error: null }), usePerformance: () => ({ data: performance, isLoading: false, error: null }),
  useSectors: () => ({ data: sectors, isLoading: false, error: null }), useHoldings: () => ({ data: holdings, isLoading: false, error: null }),
  useNewsFeed: () => ({ data: news, isLoading: false, error: null }), useAlerts: () => ({ data: alerts, isLoading: false, error: null }),
  useRiskMetrics: () => ({ data: riskMetrics, isLoading: false, error: null }), useCorrelation: () => ({ data: correlation, isLoading: false, error: null }),
  useAttribution: () => ({ data: attribution, isLoading: false, error: null }), useMarketOverview: () => ({ data: marketQuotes, isLoading: false, error: null }),
  useDrawdown: () => ({ data: drawdown, isLoading: false, error: null }), useExposureTreemap: () => ({ data: exposureTreemap, isLoading: false, error: null }),
}));
vi.mock('../hooks/useDashboardEvent', () => ({ useDashboardEvent: () => undefined }));

const widgets = [PortfolioAllocation, PerformanceLine, SectorHeatMap, HoldingsTable, NewsFeed, Alerts, VarGauge, CorrelationMatrix, Attribution, MarketTicker, DrawdownChart, ExposureTreemap];

describe('widgets', () => {
  it('defines all registered widgets with unique ids', () => { expect(widgetDefinitions).toHaveLength(16); expect(new Set(widgetDefinitions.map((w) => w.id)).size).toBe(16); });
  for (const [index, Widget] of widgets.entries()) {
    it(`renders widget ${index + 1} with dashboard data`, () => {
      const html = renderToStaticMarkup(createElement(Widget as ComponentType<WidgetComponentProps<Record<string, unknown>, unknown>>, { config: {}, data: undefined }));
      expect(html).toBeTruthy();
    });
  }
});
