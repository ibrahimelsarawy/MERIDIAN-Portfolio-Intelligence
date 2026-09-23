import type { AlertItem, AllocationItem, AttributionItem, CorrelationCell, Holding, MarketQuote, NewsItem, PerformancePoint, RiskMetrics, SectorItem } from '../types/domain';

export const allocation: AllocationItem[] = [
  { name: 'Equities', value: 52, change: 1.8 },
  { name: 'Fixed Income', value: 23, change: -0.6 },
  { name: 'Derivatives', value: 15, change: 0.9 },
  { name: 'Alternatives', value: 10, change: 0.4 },
];

export const performance: PerformancePoint[] = Array.from({ length: 30 }, (_, index) => ({
  date: `D${index + 1}`,
  portfolio: Number((100 + index * 0.38 + Math.sin(index / 2) * 2.4).toFixed(2)),
  benchmark: Number((100 + index * 0.29 + Math.cos(index / 3) * 1.7).toFixed(2)),
}));

export const sectors: SectorItem[] = ['Technology', 'Financials', 'Energy', 'Healthcare', 'Industrials', 'Utilities'].map((name, index) => ({
  name,
  value: Number((Math.sin(index * 1.7) * 4).toFixed(2)),
}));

const holdingSymbols = [
  ['AAPL', 'Apple Inc.', 'Technology'], ['MSFT', 'Microsoft Corp.', 'Technology'], ['JPM', 'JPMorgan Chase', 'Financials'],
  ['XOM', 'Exxon Mobil', 'Energy'], ['LLY', 'Eli Lilly', 'Healthcare'], ['CAT', 'Caterpillar', 'Industrials'],
] as const;

const rawHoldings = Array.from({ length: 24 }, (_, index) => {
  const [ticker, name, sector] = holdingSymbols[index % holdingSymbols.length];
  const quantity = 1000 + index * 70;
  const price = 85 + index * 13;
  return { ticker, name, sector, quantity, price, value: quantity * price, pnl: Number((Math.sin(index) * 2.4).toFixed(2)) };
});

const totalHoldingValue = rawHoldings.reduce((sum, holding) => sum + holding.value, 0);

export const holdings: Holding[] = rawHoldings.map(({ value, ...holding }) => ({
  ...holding,
  weight: Number(((value / totalHoldingValue) * 100).toFixed(2)),
}));

export const news: NewsItem[] = [
  { id: 'n1', title: 'Central banks signal a cautious rate path', source: 'Market Wire', sentiment: 'neutral', minutesAgo: 12, summary: 'Policymakers continue to balance inflation risks with slowing growth.' },
  { id: 'n2', title: 'Technology earnings beat expectations', source: 'Research Desk', sentiment: 'positive', minutesAgo: 19, summary: 'Large-cap technology companies reported resilient revenue and margin expansion.' },
  { id: 'n3', title: 'Energy volatility rises on supply uncertainty', source: 'Market Monitor', sentiment: 'negative', minutesAgo: 26, summary: 'Supply concerns pushed energy markets higher during the latest trading session.' },
  { id: 'n4', title: 'Portfolio flows rotate into defensives', source: 'Fund Monitor', sentiment: 'neutral', minutesAgo: 33, summary: 'Investors increased allocations to quality and lower-volatility exposures.' },
];

export const alerts: AlertItem[] = [
  { id: 'a1', level: 'critical', text: 'VaR limit at 82% of threshold', createdAt: '2 min ago' },
  { id: 'a2', level: 'warning', text: 'Correlation regime change detected', createdAt: '18 min ago' },
  { id: 'a3', level: 'info', text: 'NAV refresh completed', createdAt: '35 min ago' },
];

const correlationNames = sectors.map((sector) => sector.name);
export const correlation: CorrelationCell[] = correlationNames.flatMap((row, rowIndex) =>
  correlationNames.map((column, columnIndex) => ({
    row,
    column,
    value: rowIndex === columnIndex ? 1 : Number((Math.cos((rowIndex - columnIndex) * 1.3) * 0.82).toFixed(2)),
  })),
);

export const attribution: AttributionItem[] = sectors.slice(0, 5).map(({ name }, index) => ({
  name,
  allocation: Number((Math.sin(index) * 1.3).toFixed(2)),
  selection: Number((Math.cos(index) * 1.1).toFixed(2)),
  interaction: Number((Math.sin(index * 1.7) * 0.6).toFixed(2)),
}));

export const marketQuotes: MarketQuote[] = [
  { symbol: 'SPX', name: 'S&P 500', price: 5146.21, changePercent: 0.42 },
  { symbol: 'NDX', name: 'NASDAQ', price: 16138.42, changePercent: 0.76 },
  { symbol: 'NIFTY', name: 'NIFTY 50', price: 22470.5, changePercent: 0.31 },
  { symbol: 'BRN', name: 'BRENT', price: 82.11, changePercent: -0.28 },
  { symbol: 'XAU', name: 'GOLD', price: 2041.3, changePercent: 0.18 },
];

export const riskMetrics: RiskMetrics = { varPercent: 82, estimatedLoss: 4_820_000, confidence: 99 };

export const drawdown: import('../types/domain').DrawdownPoint[] = Array.from({ length: 36 }, (_, index) => {
  const cycle = Math.sin(index / 4) * 5 + Math.sin(index / 9) * 3;
  const value = Math.min(0, Number((cycle - 8).toFixed(2)));
  return { date: `D${index + 1}`, drawdown: value, recovery: index > 28 && value > -2 };
});

export const exposureTreemap: import('../types/domain').ExposureNode[] = [
  { name: 'Equities', value: 52, children: [
    { name: 'Technology', value: 22 }, { name: 'Financials', value: 14 }, { name: 'Healthcare', value: 9 }, { name: 'Industrials', value: 7 },
  ] },
  { name: 'Fixed Income', value: 23, children: [
    { name: 'Government', value: 12 }, { name: 'Investment Grade', value: 8 }, { name: 'High Yield', value: 3 },
  ] },
  { name: 'Derivatives', value: 15, children: [
    { name: 'Options', value: 9 }, { name: 'Futures', value: 6 },
  ] },
  { name: 'Alternatives', value: 10, children: [
    { name: 'Real Assets', value: 6 }, { name: 'Private Markets', value: 4 },
  ] },
];
