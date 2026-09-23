export type PortfolioObjective = 'Growth' | 'Income' | 'Capital Preservation' | 'Balanced';

export type PortfolioProfile = {
  id: string;
  name: string;
  description: string;
  value: number;
  objective: PortfolioObjective;
  targetReturn: number;
  maxDrawdown: number;
  riskBudget: number;
  targetDate: string;
  reviewDate: string;
  owner: string;
};

export type InvestmentDecision = {
  id: string;
  portfolioId: string;
  date: string;
  action: 'Increase' | 'Reduce' | 'Hold' | 'Watch';
  subject: string;
  thesis: string;
  trigger: string;
  status: 'Open' | 'Monitoring' | 'Closed';
};
