import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNewsFeed } from '../hooks/useDashboardData';
import { useDashboardEvent } from '../hooks/useDashboardEvent';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';

export default function NewsFeed(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useNewsFeed(); const [search, setSearch] = useState(''); const [expandedId, setExpandedId] = useState<string | null>(null);
  const selectedSymbol = useDashboardEvent('SYMBOL_SELECTED');
  const items = useMemo(() => (query.data ?? []).filter((item) => {
    const text = `${item.title} ${item.summary}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (!selectedSymbol || text.includes(selectedSymbol.symbol.toLowerCase()) || selectedSymbol.symbol.length < 2);
  }), [query.data, search, selectedSymbol]);
  return <QueryState isLoading={query.isLoading} error={query.error}><div className="news-widget"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={selectedSymbol ? `News for ${selectedSymbol.symbol}` : 'Search research'} /></label><div className="feed"><AnimatePresence initial={false}>{items.map((item) => <motion.article className="feed-item clickable" key={item.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -12 }} onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}><div className="feed-meta"><span className={`sentiment ${item.sentiment}`}>{item.sentiment}</span><span>{item.source}</span><span>{item.minutesAgo}m ago</span></div><strong>{item.title}</strong><p>{item.summary}</p>{expandedId === item.id && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="feed-details">Research detail expanded for review.</motion.div>}</motion.article>)}</AnimatePresence></div></div></QueryState>;
}
