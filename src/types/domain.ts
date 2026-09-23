export type AllocationItem = { name: string; value: number; change: number };
export type PerformancePoint = { date: string; portfolio: number; benchmark: number };
export type Holding = { ticker: string; name: string; quantity: number; price: number; weight: number; pnl: number; sector: string };
export type NewsItem = { id: string; title: string; source: string; sentiment: 'positive' | 'neutral' | 'negative'; minutesAgo: number; summary: string };
export type AlertItem = { id: string; level: 'critical' | 'warning' | 'info'; text: string; createdAt: string };
export type MarketQuote = { symbol: string; name: string; price: number; changePercent: number };
export type RiskMetrics = { varPercent: number; estimatedLoss: number; confidence: number };
export type SectorItem = { name: string; value: number };
export type AttributionItem = { name: string; allocation: number; selection: number; interaction: number };
export type CorrelationCell = { row: string; column: string; value: number };

export type DrawdownPoint = { date: string; drawdown: number; recovery?: boolean };
export type ExposureNode = { name: string; value: number; children?: ExposureNode[] };
