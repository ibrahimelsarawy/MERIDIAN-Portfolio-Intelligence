import type { ComponentType, LazyExoticComponent } from 'react';

export type WidgetCategory = 'CHART' | 'TABLE' | 'FEED' | 'GAUGE' | 'ANALYSIS';
export type WidgetSize = { w: number; h: number };
export type DataSourceConfig = { key: string; refreshMs?: number };

export type WidgetComponentProps<TConfig, TData> = {
  config: TConfig;
  data?: TData;
  onConfigChange?: (next: TConfig) => void;
};

export type WidgetDefinition<TConfig = Record<string, unknown>, TData = unknown> = {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  defaultSize: WidgetSize;
  minSize: WidgetSize;
  maxSize?: WidgetSize;
  configSchema: Record<string, unknown>;
  defaultConfig: TConfig;
  component: LazyExoticComponent<ComponentType<WidgetComponentProps<TConfig, TData>>>;
  dataSource: DataSourceConfig;
};

export type WidgetInstance = {
  instanceId: string;
  widgetId: string;
  config: Record<string, unknown>;
};
