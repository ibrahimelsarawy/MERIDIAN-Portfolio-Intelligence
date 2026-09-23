'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertTriangle, BellRing, Info, OctagonAlert } from 'lucide-react';
import { useAlerts } from '../hooks/useDashboardData';
import { dashboardEventBus } from '../events/EventBus';
import { QueryState } from '../components/ui/QueryState';
import type { AlertItem } from '../types/domain';
import type { WidgetComponentProps } from '../types/widgets';

const alertIcons = { critical: OctagonAlert, warning: AlertTriangle, info: Info } satisfies Record<AlertItem['level'], typeof Info>;
const snoozeOptions = ['15 min', '1 hour', 'End of day'];

export default function Alerts(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useAlerts(); const [dismissed, setDismissed] = useState<string[]>([]); const [snoozed, setSnoozed] = useState<string[]>([]);
  const visibleAlerts = (query.data ?? []).filter((alert) => !dismissed.includes(alert.id) && !snoozed.includes(alert.id));
  return <QueryState isLoading={query.isLoading} error={query.error} onRetry={() => query.refetch()}><div className="alerts-widget"><div className="alerts-summary"><BellRing size={15}/><span>{visibleAlerts.length} active</span><small>Rules: price, VaR, drawdown</small></div><div className="alerts-list" aria-label="Portfolio alerts"><AnimatePresence initial={false}>{visibleAlerts.map((alert) => { const Icon = alertIcons[alert.level]; return <motion.article layout key={alert.id} className={`alert alert-${alert.level}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24, height: 0 }} onClick={() => dashboardEventBus.publish('ALERT_CLICKED', { alertId: alert.id })}><span className="alert-icon" aria-hidden="true"><Icon size={16}/></span><div className="alert-copy"><div className="alert-meta"><strong>{alert.level}</strong><small>{alert.createdAt}</small></div><p>{alert.text}</p><div className="alert-snooze-row">{snoozeOptions.map((option) => <button key={option} onClick={(event) => { event.stopPropagation(); setSnoozed((items) => [...items, alert.id]); }}>{option}</button>)}</div></div><button className="icon-button alert-dismiss" aria-label={`Dismiss ${alert.level} alert`} onClick={(event) => { event.stopPropagation(); setDismissed((items) => [...items, alert.id]); }}><Check size={15}/></button></motion.article>; })}</AnimatePresence>{visibleAlerts.length === 0 && <div className="alerts-empty">All alerts have been reviewed or snoozed.</div>}</div></div></QueryState>;
}
