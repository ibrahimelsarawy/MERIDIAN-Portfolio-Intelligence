export type BacktestResult = {
  strategy: string;
  finalValue: number;
  cagr: number;
  maxDrawdown: number;
  volatility: number;
  sharpe: number;
};

export type QualityCheck = {
  id: string;
  label: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  detail: string;
};

export type Rule = {
  id: string;
  label: string;
  enabled: boolean;
  threshold: number;
  metric: 'technologyWeight' | 'varUtilization' | 'drawdown';
};
