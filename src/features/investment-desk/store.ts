'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_PORTFOLIO = 'core-growth';

type InvestmentDeskState = {
  selectedPortfolioId: string;
  selectPortfolio: (portfolioId: string) => void;
};

export const useInvestmentDeskStore = create<InvestmentDeskState>()(
  persist(
    (set) => ({ selectedPortfolioId: DEFAULT_PORTFOLIO, selectPortfolio: (selectedPortfolioId) => set({ selectedPortfolioId }) }),
    { name: 'meridian-investment-desk' },
  ),
);
