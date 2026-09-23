'use client';

import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, BookOpen, CheckCircle2, Download, FileText, FlaskConical, History, Play, RefreshCcw, ShieldCheck, SlidersHorizontal, Sparkles, Target, TrendingUp, XCircle } from 'lucide-react';
import { useAllocation, useDrawdown, useHoldings, usePerformance, useRiskMetrics } from '../../../hooks/useDashboardData';
import { portfolios, decisions } from '../../investment-desk/data/mockDeskData';
import { useInvestmentDeskStore } from '../../investment-desk/store';
import { runBacktest } from '../lib/backtestEngine';
import { runDataQualityChecks } from '../lib/qualityEngine';
import type { Rule } from '../types';

const money = (value: number) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const scrollTo = (widgetId: string) => document.querySelector<HTMLElement>(`[data-widget-id=\"${widgetId}\"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

const defaultRules: Rule[] = [
  { id: 'r1', label: 'Technology concentration > 35%', enabled: true, threshold: 35, metric: 'technologyWeight' },
  { id: 'r2', label: 'VaR utilization > 75%', enabled: true, threshold: 75, metric: 'varUtilization' },
  { id: 'r3', label: 'Drawdown < -10%', enabled: true, threshold: -10, metric: 'drawdown' },
];

export function AnalystCommandCenter() {
  const portfolioId = useInvestmentDeskStore((state) => state.selectedPortfolioId);
  const portfolio = portfolios.find((item) => item.id === portfolioId) ?? portfolios[0];
  const holdings = useHoldings();
  const allocation = useAllocation();
  const performance = usePerformance();
  const drawdown = useDrawdown();
  const risk = useRiskMetrics();
  const [tab, setTab] = useState('control');
  const [rules, setRules] = useState(defaultRules);
  const [thesis, setThesis] = useState('');
  const [subject, setSubject] = useState('');
  const [savedThesis, setSavedThesis] = useState(false);

  const backtests = useMemo(() => performance.data ? runBacktest(performance.data) : [], [performance.data]);
  const quality = useMemo(() => holdings.data && allocation.data && performance.data ? runDataQualityChecks(holdings.data, allocation.data, performance.data) : [], [holdings.data, allocation.data, performance.data]);
  const techWeight = useMemo(() => holdings.data?.filter((item) => item.sector === 'Technology').reduce((sum, item) => sum + item.weight, 0) ?? 0, [holdings.data]);
  const currentDrawdown = drawdown.data?.at(-1)?.drawdown ?? 0;
  const firedRules = rules.filter((rule) => rule.enabled && ((rule.metric === 'technologyWeight' && techWeight > rule.threshold) || (rule.metric === 'varUtilization' && (risk.data?.varPercent ?? 0) > rule.threshold) || (rule.metric === 'drawdown' && currentDrawdown < rule.threshold))).length;

  const downloadReport = () => {
    const report = [
      'MERIDIAN PORTFOLIO REVIEW',
      `Portfolio: ${portfolio.name}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      `Portfolio value: ${money(portfolio.value)}`,
      `Objective: ${portfolio.objective}`,
      `Health rules fired: ${firedRules}`,
      `Technology exposure: ${techWeight.toFixed(1)}%`,
      `VaR utilization: ${risk.data?.varPercent ?? '—'}%`,
      `Current drawdown: ${currentDrawdown.toFixed(2)}%`,
      '',
      'BACKTEST SNAPSHOT',
      ...backtests.map((item) => `${item.strategy}: ${item.finalValue} final value, ${item.cagr}% CAGR, ${item.maxDrawdown}% max drawdown, Sharpe ${item.sharpe}`),
      '',
      'DECISION JOURNAL',
      ...decisions.filter((item) => item.portfolioId === portfolio.id).map((item) => `${item.date} | ${item.action} | ${item.subject}`),
      '',
      'SIMULATED DATA — decision support only.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([report], { type: 'text/plain' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `meridian-${portfolio.id}-review.txt`; anchor.click(); URL.revokeObjectURL(url);
  };

  const saveThesis = () => { if (!subject.trim() || !thesis.trim()) return; setSavedThesis(true); setTimeout(() => setSavedThesis(false), 1800); setSubject(''); setThesis(''); };

  return <section className="analyst-command-center" aria-label="Meridian analyst command center">
    <div className="command-center-head">
      <div><span className="feature-kicker"><Sparkles size={12}/> DECISION INTELLIGENCE</span><h2>Analyst Command Center</h2><p>One workspace to monitor, diagnose, simulate, document, and review portfolio decisions.</p></div>
      <button className="secondary-button" type="button" onClick={downloadReport}><Download size={14}/> Export review</button>
    </div>
    <div className="command-tabs" role="tablist">
      {[['control','Control Room'],['backtest','Backtesting Lab'],['thesis','Thesis Builder'],['rules','Rules & Alerts'],['quality','Data Quality'],['audit','Audit Trail']].map(([id,label]) => <button key={id} className={tab === id ? 'command-tab active' : 'command-tab'} onClick={() => setTab(id)} type="button" role="tab" aria-selected={tab === id}>{label}</button>)}
    </div>

    {tab === 'control' && <div className="control-grid">
      <article className="command-card-large command-primary"><div className="command-icon"><Activity size={17}/></div><div><span>PORTFOLIO HEALTH</span><strong>{firedRules === 0 ? 'Within policy' : `${firedRules} rule${firedRules === 1 ? '' : 's'} require review`}</strong><p>Health is derived from explicit monitoring rules, not a decorative score.</p></div><button onClick={() => scrollTo('portfolio-health')}>Open health <TrendingUp size={13}/></button></article>
      <article className="command-card-large"><div className="command-icon"><ShieldCheck size={17}/></div><div><span>RISK BUDGET</span><strong>{risk.data?.varPercent ?? '—'}% utilized</strong><p>Configured budget: {portfolio.riskBudget}% for {portfolio.name}.</p></div><button onClick={() => scrollTo('var-gauge')}>Review risk <ShieldCheck size={13}/></button></article>
      <article className="command-card-large"><div className="command-icon"><BarChart3 size={17}/></div><div><span>PERFORMANCE ATTRIBUTION</span><strong>Find what drove returns</strong><p>Allocation, selection, and interaction effects are available below.</p></div><button onClick={() => scrollTo('attribution')}>Open attribution <BarChart3 size={13}/></button></article>
      <article className="command-card-large"><div className="command-icon"><SlidersHorizontal size={17}/></div><div><span>SCENARIO LAB</span><strong>Stress the portfolio</strong><p>Test sector shocks before turning a market view into a decision.</p></div><button onClick={() => scrollTo('stress-testing')}>Run scenario <Play size={13}/></button></article>
      <article className="command-card-large"><div className="command-icon"><Target size={17}/></div><div><span>REBALANCING</span><strong>Turn drift into a plan</strong><p>Compare current exposure with targets and inspect trade requirements.</p></div><button onClick={() => scrollTo('rebalance-planner')}>Plan rebalance <Target size={13}/></button></article>
      <article className="command-card-large"><div className="command-icon"><FileText size={17}/></div><div><span>REPORTING</span><strong>Portfolio review ready</strong><p>Export a text review containing risk, backtest, and decision context.</p></div><button onClick={downloadReport}>Generate report <Download size={13}/></button></article>
      <article className="command-card-large"><div className="command-icon"><Activity size={17}/></div><div><span>DATA QUALITY</span><strong>{quality.filter((item) => item.status === 'PASS').length}/{quality.length || 0} checks passing</strong><p>Validate weights, prices, duplicates, and timeline integrity before analysis.</p></div><button onClick={() => setTab('quality')}>Inspect quality <RefreshCcw size={13}/></button></article>
      <article className="command-card-large"><div className="command-icon"><Target size={17}/></div><div><span>PORTFOLIO CONTEXT</span><strong>{portfolios.length} active portfolio profiles</strong><p>Switch mandates in Investment Desk and keep risk, goals, and decisions contextual.</p></div><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Review context <Target size={13}/></button></article>
    </div>}

    {tab === 'backtest' && <div className="tool-panel"><div className="tool-panel-heading"><div><span className="feature-kicker"><FlaskConical size={12}/> RESEARCH LAB</span><h3>Backtesting Lab</h3><p>Compare simulated strategy profiles across the same observation window.</p></div><span className="simulation-pill">SIMULATED</span></div><div className="backtest-grid">{backtests.map((item) => <article className="backtest-card" key={item.strategy}><strong>{item.strategy}</strong><span>Final value</span><b>{money(item.finalValue)}</b><div className="backtest-stats"><span>CAGR <b>{item.cagr}%</b></span><span>Drawdown <b>{item.maxDrawdown}%</b></span><span>Volatility <b>{item.volatility}%</b></span><span>Sharpe <b>{item.sharpe}</b></span></div></article>)}</div><p className="tool-note">Backtesting is illustrative and uses the project's simulated time series. Results are not forecasts.</p></div>}

    {tab === 'thesis' && <div className="tool-panel"><div className="tool-panel-heading"><div><span className="feature-kicker"><BookOpen size={12}/> DECISION JOURNAL</span><h3>Investment Thesis Builder</h3><p>Record the rationale and invalidation trigger before an action becomes a decision.</p></div></div><div className="thesis-layout"><div className="thesis-form"><label>Decision subject<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Reduce technology concentration" /></label><label>Investment thesis<textarea value={thesis} onChange={(e) => setThesis(e.target.value)} placeholder="What evidence supports the decision?" rows={5}/></label><div className="thesis-row"><label>Expected outcome<input placeholder="e.g. Lower concentration risk" /></label><label>Review trigger<input placeholder="e.g. Sector weight > 35%" /></label></div><button className="primary-button" onClick={saveThesis} disabled={!subject.trim() || !thesis.trim()}>{savedThesis ? <CheckCircle2 size={14}/> : <BookOpen size={14}/>} {savedThesis ? 'Saved to journal' : 'Save thesis'}</button></div><div className="thesis-guidance"><h4>Decision checklist</h4><p><CheckCircle2 size={13}/> State the evidence, not just the opinion.</p><p><CheckCircle2 size={13}/> Define what would prove the thesis wrong.</p><p><CheckCircle2 size={13}/> Attach a review date or measurable trigger.</p><p><CheckCircle2 size={13}/> Revisit the outcome after the decision.</p></div></div></div>}

    {tab === 'rules' && <div className="tool-panel"><div className="tool-panel-heading"><div><span className="feature-kicker"><AlertTriangle size={12}/> RULE ENGINE</span><h3>Alerts & Policy Rules</h3><p>Turn portfolio limits into explicit, auditable monitoring rules.</p></div><span className={firedRules ? 'rule-status warning' : 'rule-status'}>{firedRules} fired</span></div><div className="rules-list">{rules.map((rule) => { const fired = rule.metric === 'technologyWeight' ? techWeight > rule.threshold : rule.metric === 'varUtilization' ? (risk.data?.varPercent ?? 0) > rule.threshold : currentDrawdown < rule.threshold; return <article className="rule-row" key={rule.id}><button className={`rule-toggle ${rule.enabled ? 'on' : ''}`} onClick={() => setRules((current) => current.map((item) => item.id === rule.id ? { ...item, enabled: !item.enabled } : item))} aria-label={`Toggle ${rule.label}`}><span/></button><div><strong>{rule.label}</strong><small>{fired && rule.enabled ? 'Condition currently triggered' : 'Monitoring condition is clear'}</small></div><span className={fired && rule.enabled ? 'rule-result fired' : 'rule-result'}>{fired && rule.enabled ? 'TRIGGERED' : 'CLEAR'}</span></article>; })}</div></div>}

    {tab === 'quality' && <div className="tool-panel"><div className="tool-panel-heading"><div><span className="feature-kicker"><RefreshCcw size={12}/> DATA GOVERNANCE</span><h3>Data Quality Center</h3><p>Validate the simulated dataset before analytics consume it.</p></div><span className="quality-summary">{quality.filter((item) => item.status === 'PASS').length}/{quality.length} checks pass</span></div><div className="quality-grid">{quality.map((item) => <article className={`quality-card ${item.status.toLowerCase()}`} key={item.id}>{item.status === 'PASS' ? <CheckCircle2 size={17}/> : item.status === 'WARN' ? <AlertTriangle size={17}/> : <XCircle size={17}/>}<div><strong>{item.label}</strong><span>{item.status}</span><p>{item.detail}</p></div></article>)}</div></div>}

    {tab === 'audit' && <div className="tool-panel"><div className="tool-panel-heading"><div><span className="feature-kicker"><History size={12}/> GOVERNANCE</span><h3>Audit Trail</h3><p>Trace the sequence of analytical actions in the current desk session.</p></div></div><div className="audit-list"><div><time>11:42</time><strong>Scenario Lab</strong><span>Stress scenario evaluated for {portfolio.name}.</span></div><div><time>11:31</time><strong>Rebalance Planner</strong><span>Allocation drift reviewed against target policy.</span></div><div><time>11:17</time><strong>Health Center</strong><span>Portfolio policy checks refreshed.</span></div><div><time>10:58</time><strong>Decision Journal</strong><span>{decisions.filter((item) => item.portfolioId === portfolio.id).length} existing decisions loaded for active portfolio.</span></div><div><time>10:41</time><strong>Data Quality</strong><span>{quality.filter((item) => item.status !== 'FAIL').length} of {quality.length} data checks currently non-blocking.</span></div></div></div>}
  </section>;
}
