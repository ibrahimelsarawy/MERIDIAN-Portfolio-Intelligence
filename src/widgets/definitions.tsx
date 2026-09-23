import { lazy, type ComponentType } from 'react';
import type { WidgetComponentProps } from '../types/widgets';
import type { WidgetCategory, WidgetDefinition, WidgetSize } from '../types/widgets';

type WidgetModule = { default: ComponentType<WidgetComponentProps<Record<string, unknown>, unknown>> };

type DefinitionInput = {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  size: WidgetSize;
  dataSource: string;
  loader: () => Promise<WidgetModule>;
};

const createDefinition = ({ id, name, description, category, size, dataSource, loader }: DefinitionInput): WidgetDefinition => ({
  id,
  name,
  description,
  category,
  defaultSize: size,
  minSize: { w: 2, h: 2 },
  configSchema: { type: 'object', properties: {} },
  defaultConfig: {},
  component: lazy(loader),
  dataSource: { key: dataSource },
});

export const widgetDefinitions: WidgetDefinition[] = [
  createDefinition({ id: 'portfolio-allocation', name: 'Portfolio Allocation', description: 'Allocation by asset class', category: 'CHART', size: { w: 4, h: 3 }, dataSource: 'allocation', loader: () => import('./portfolio-allocation') }),
  createDefinition({ id: 'performance-line', name: 'Performance', description: 'Portfolio versus benchmark performance', category: 'CHART', size: { w: 12, h: 4 }, dataSource: 'performance', loader: () => import('./performance-line') }),
  createDefinition({ id: 'sector-heatmap', name: 'Sector Heat Map', description: 'Sector P&L intensity', category: 'CHART', size: { w: 4, h: 4 }, dataSource: 'sectors', loader: () => import('./sector-heatmap') }),
  createDefinition({ id: 'holdings-table', name: 'Holdings', description: 'Sortable portfolio holdings', category: 'TABLE', size: { w: 12, h: 4 }, dataSource: 'holdings', loader: () => import('./holdings-table') }),
  createDefinition({ id: 'news-feed', name: 'News & Research', description: 'Market research feed', category: 'FEED', size: { w: 12, h: 4 }, dataSource: 'news', loader: () => import('./news-feed') }),
  createDefinition({ id: 'alerts', name: 'Alerts', description: 'Portfolio notifications', category: 'FEED', size: { w: 12, h: 4 }, dataSource: 'alerts', loader: () => import('./alerts') }),
  createDefinition({ id: 'var-gauge', name: 'Value at Risk', description: 'Risk utilization gauge', category: 'GAUGE', size: { w: 3, h: 3 }, dataSource: 'risk', loader: () => import('./var-gauge') }),
  createDefinition({ id: 'correlation-matrix', name: 'Correlation Matrix', description: 'Asset relationship matrix', category: 'ANALYSIS', size: { w: 4, h: 4 }, dataSource: 'correlation', loader: () => import('./correlation-matrix') }),
  createDefinition({ id: 'attribution', name: 'Performance Attribution', description: 'Allocation, selection and interaction effects', category: 'CHART', size: { w: 5, h: 3 }, dataSource: 'attribution', loader: () => import('./attribution') }),
  createDefinition({ id: 'market-ticker', name: 'Market Overview', description: 'Simulated market ticker', category: 'FEED', size: { w: 12, h: 1 }, dataSource: 'market', loader: () => import('./market-ticker') }),
  createDefinition({ id: 'drawdown-chart', name: 'Drawdown Analysis', description: 'Portfolio drawdown and recovery analysis', category: 'ANALYSIS', size: { w: 12, h: 4 }, dataSource: 'drawdown', loader: () => import('./drawdown-chart') }),
  createDefinition({ id: 'exposure-treemap', name: 'Exposure Treemap', description: 'Hierarchical portfolio exposure explorer', category: 'ANALYSIS', size: { w: 12, h: 4 }, dataSource: 'exposure-treemap', loader: () => import('./exposure-treemap') }),
  createDefinition({ id: 'rebalance-planner', name: 'Rebalance Planner', description: 'Target allocation drift and trade planning', category: 'ANALYSIS', size: { w: 12, h: 6 }, dataSource: 'allocation', loader: () => import('./rebalance-planner') }),
  createDefinition({ id: 'stress-testing', name: 'Scenario Lab', description: 'What-if portfolio stress testing by sector', category: 'ANALYSIS', size: { w: 12, h: 6 }, dataSource: 'holdings', loader: () => import('./stress-testing') }),
  createDefinition({ id: 'portfolio-health', name: 'Portfolio Health Center', description: 'Rules-based policy monitoring and explainable risk findings', category: 'ANALYSIS', size: { w: 12, h: 6 }, dataSource: 'portfolio-health', loader: () => import('./portfolio-health') }),
  createDefinition({ id: 'decision-journal', name: 'Decision Journal', description: 'Investment thesis, review triggers and decision follow-up', category: 'ANALYSIS', size: { w: 12, h: 6 }, dataSource: 'decision-journal', loader: () => import('./decision-journal') }),
];
