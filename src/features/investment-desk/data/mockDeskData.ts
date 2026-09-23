import type { InvestmentDecision, PortfolioProfile } from '../types/investmentDesk';

export const portfolios: PortfolioProfile[] = [
  { id: 'core-growth', name: 'Core Growth', description: 'Long-horizon growth portfolio with diversified equity exposure.', value: 1248000, objective: 'Growth', targetReturn: 9, maxDrawdown: 18, riskBudget: 12, targetDate: '2032', reviewDate: '2026-10-01', owner: 'Investment Desk' },
  { id: 'income', name: 'Income Reserve', description: 'Income-oriented portfolio focused on stability and cash generation.', value: 684000, objective: 'Income', targetReturn: 5.5, maxDrawdown: 9, riskBudget: 7, targetDate: '2030', reviewDate: '2026-10-08', owner: 'Investment Desk' },
  { id: 'capital-preservation', name: 'Capital Preservation', description: 'Lower-volatility allocation designed to protect capital.', value: 412000, objective: 'Capital Preservation', targetReturn: 3.8, maxDrawdown: 6, riskBudget: 4, targetDate: '2029', reviewDate: '2026-09-30', owner: 'Investment Desk' },
];

export const decisions: InvestmentDecision[] = [
  { id: 'd-024', portfolioId: 'core-growth', date: '2026-09-23', action: 'Reduce', subject: 'Technology concentration', thesis: 'Technology exposure is above the target band and is driving a disproportionate share of portfolio risk.', trigger: 'Sector weight > 35%', status: 'Monitoring' },
  { id: 'd-023', portfolioId: 'core-growth', date: '2026-09-18', action: 'Increase', subject: 'Fixed income sleeve', thesis: 'Increase ballast while equity volatility remains elevated.', trigger: 'VaR utilization > 75%', status: 'Open' },
  { id: 'd-021', portfolioId: 'income', date: '2026-09-12', action: 'Hold', subject: 'Dividend allocation', thesis: 'Maintain income sleeve while monitoring payout sustainability.', trigger: 'Yield remains above 4%', status: 'Monitoring' },
  { id: 'd-019', portfolioId: 'capital-preservation', date: '2026-09-05', action: 'Watch', subject: 'Duration exposure', thesis: 'Watch duration sensitivity ahead of the next rate decision.', trigger: '10Y yield > 4.5%', status: 'Open' },
];
