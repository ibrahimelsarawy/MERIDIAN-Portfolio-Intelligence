import { useMarketOverview } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import { dashboardEventBus } from '../events/EventBus';
import type { WidgetComponentProps } from '../types/widgets';

export default function MarketTicker(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useMarketOverview();
  return <QueryState isLoading={query.isLoading} error={query.error}>{query.data && <div className="ticker">{query.data.map((quote) => <button key={quote.symbol} className="ticker-item" onClick={() => dashboardEventBus.publish('SYMBOL_SELECTED', { symbol: quote.symbol })}><span><strong>{quote.name}</strong><small>{quote.symbol}</small></span><b>{quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b><em className={quote.changePercent >= 0 ? 'positive' : 'negative'}>{quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%</em></button>)}</div>}</QueryState>;
}
