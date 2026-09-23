'use client';

import { BookOpen, CircleDot, Plus, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { decisions } from '../features/investment-desk/data/mockDeskData';
import { useInvestmentDeskStore } from '../features/investment-desk/store';
import type { WidgetComponentProps } from '../types/widgets';

export default function DecisionJournal(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const portfolioId = useInvestmentDeskStore((state) => state.selectedPortfolioId);
  const [subject, setSubject] = useState('');
  const [thesis, setThesis] = useState('');
  const [saved, setSaved] = useState(false);
  const visible = useMemo(() => decisions.filter((item) => item.portfolioId === portfolioId), [portfolioId]);

  const saveDecision = () => {
    if (!subject.trim() || !thesis.trim()) return;
    setSaved(true);
    setSubject('');
    setThesis('');
    window.setTimeout(() => setSaved(false), 2200);
  };

  return <div className="decision-journal">
    <div className="journal-intro"><div><span className="feature-kicker"><BookOpen size={12}/> DECISION LOG</span><h3>Investment thesis & follow-up</h3><p>Capture why a decision was made, what should trigger a review, and whether the thesis remains valid.</p></div><span className="journal-count">{visible.length} active records</span></div>
    <div className="decision-list">{visible.map((item) => <article className="decision-card" key={item.id}><div className="decision-card-top"><span className={`decision-action ${item.action.toLowerCase()}`}>{item.action}</span><span>{item.date}</span><span className="decision-status"><CircleDot size={10}/>{item.status}</span></div><strong>{item.subject}</strong><p>{item.thesis}</p><small>Review trigger · {item.trigger}</small></article>)}</div>
    <div className="decision-form"><div><label htmlFor="decision-subject">New decision</label><input id="decision-subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="What changed?" /></div><div><label htmlFor="decision-thesis">Thesis</label><input id="decision-thesis" value={thesis} onChange={(event) => setThesis(event.target.value)} placeholder="Why does it matter?" /></div><button className="primary-button" onClick={saveDecision} disabled={!subject.trim() || !thesis.trim()}>{saved ? <Save size={13}/> : <Plus size={13}/>} {saved ? 'Saved' : 'Log decision'}</button></div>
  </div>;
}
