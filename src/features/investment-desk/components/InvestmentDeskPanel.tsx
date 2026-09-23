'use client';

import { ArrowRight, CalendarDays, CircleDollarSign, Gauge, Goal, ShieldCheck, Target } from 'lucide-react';
import { portfolios } from '../data/mockDeskData';
import { useInvestmentDeskStore } from '../store';

const money = (value: number) => `$${(value / 1_000_000).toFixed(2)}M`;

export function InvestmentDeskPanel() {
  const selectedPortfolioId = useInvestmentDeskStore((state) => state.selectedPortfolioId);
  const selectPortfolio = useInvestmentDeskStore((state) => state.selectPortfolio);
  const portfolio = portfolios.find((item) => item.id === selectedPortfolioId) ?? portfolios[0];

  const jump = (widgetId: string) => document.querySelector<HTMLElement>(`[data-widget-id=\"${widgetId}\"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <section id="investment-desk-workspace" className="investment-desk-panel" aria-label="Investment Desk workspace">
      <div className="desk-context">
        <div>
          <span className="feature-kicker"><Target size={12} /> INVESTMENT DESK</span>
          <h2>Analyst workspace</h2>
          <p>{portfolio.description}</p>
        </div>
        <label className="portfolio-switcher">
          <span>Active portfolio</span>
          <select value={portfolio.id} onChange={(event) => selectPortfolio(event.target.value)} aria-label="Select active portfolio">
            {portfolios.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </label>
      </div>
      <div className="desk-profile-grid">
        <div className="desk-stat"><CircleDollarSign size={15}/><span>Mandate</span><strong>{money(portfolio.value)}</strong><small>{portfolio.objective}</small></div>
        <div className="desk-stat"><Goal size={15}/><span>Return target</span><strong>{portfolio.targetReturn.toFixed(1)}%</strong><small>through {portfolio.targetDate}</small></div>
        <div className="desk-stat"><ShieldCheck size={15}/><span>Risk budget</span><strong>{portfolio.riskBudget}%</strong><small>max drawdown {portfolio.maxDrawdown}%</small></div>
        <div className="desk-stat"><CalendarDays size={15}/><span>Next review</span><strong>{portfolio.reviewDate.slice(5)}</strong><small>scheduled desk review</small></div>
      </div>
      <div className="desk-actions">
        <span><Gauge size={13}/> Workflow</span>
        <button onClick={() => jump('portfolio-health')}>Review health <ArrowRight size={13}/></button>
        <button onClick={() => jump('rebalance-planner')}>Plan rebalance <ArrowRight size={13}/></button>
        <button onClick={() => jump('stress-testing')}>Run scenario <ArrowRight size={13}/></button>
        <button onClick={() => jump('decision-journal')}>Log decision <ArrowRight size={13}/></button>
      </div>
    </section>
  );
}
