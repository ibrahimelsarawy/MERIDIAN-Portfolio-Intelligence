'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Download, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHoldings } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import { dashboardEventBus } from '../events/EventBus';
import type { Holding } from '../types/domain';
import type { WidgetComponentProps } from '../types/widgets';

type ColumnKey = 'ticker' | 'name' | 'weight' | 'pnl' | 'price' | 'quantity';
type SortKey = ColumnKey;
const columnLabels: Record<ColumnKey, string> = { ticker: 'Ticker', name: 'Name', weight: 'Weight', pnl: 'P&L', price: 'Price', quantity: 'Qty' };

export default function HoldingsTable(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useHoldings();
  const [search, setSearch] = useState(''); const [sortKey, setSortKey] = useState<SortKey>('weight'); const [ascending, setAscending] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(Object.keys(columnLabels) as ColumnKey[]);
  const rows = useMemo(() => (query.data ?? []).filter((holding) => `${holding.ticker} ${holding.name} ${holding.sector}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
    const aValue = a[sortKey]; const bValue = b[sortKey]; const comparison = typeof aValue === 'number' && typeof bValue === 'number' ? aValue - bValue : String(aValue).localeCompare(String(bValue)); return ascending ? comparison : -comparison;
  }), [query.data, search, sortKey, ascending]);
  const toggleSort = (key: SortKey) => { if (key === sortKey) setAscending((value) => !value); else { setSortKey(key); setAscending(true); } };
  const selectHolding = (symbol: string) => { setSelectedSymbol(symbol); dashboardEventBus.publish('SYMBOL_SELECTED', { symbol }); };
  const toggleColumn = (key: ColumnKey) => setVisibleColumns((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const exportCsv = () => { const headers = visibleColumns.map((key) => columnLabels[key]); const lines = rows.map((row) => visibleColumns.map((key) => JSON.stringify(row[key])).join(',')); const blob = new Blob([[headers.join(','), ...lines].join('\n')], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'meridian-holdings.csv'; link.click(); URL.revokeObjectURL(url); };
  return <QueryState isLoading={query.isLoading} error={query.error} onRetry={() => query.refetch()}><div className="table-widget"><div className="table-toolbar"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search holdings" /></label><div className="table-toolbar-actions"><details className="column-menu"><summary><Eye size={15}/>Columns</summary><div>{(Object.keys(columnLabels) as ColumnKey[]).map((key) => <label key={key}><input type="checkbox" checked={visibleColumns.includes(key)} onChange={() => toggleColumn(key)} />{columnLabels[key]}</label>)}</div></details><button className="secondary-button" onClick={exportCsv}><Download size={15}/>CSV</button></div></div><div className="table-scroll"><table className="table"><thead><tr>{visibleColumns.map((key) => <th key={key}><button onClick={() => toggleSort(key)}>{columnLabels[key]}{sortKey === key && (ascending ? <ArrowUp size={13} /> : <ArrowDown size={13} />)}</button></th>)}</tr></thead><tbody>{rows.map((holding) => <motion.tr key={`${holding.ticker}-${holding.quantity}`} layout whileHover={{ scale: 1.005 }} className={selectedSymbol === holding.ticker ? 'row-selected' : ''} onClick={() => selectHolding(holding.ticker)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') selectHolding(holding.ticker); }}>
  {visibleColumns.map((key) => <td key={key}>{key === 'ticker' ? <strong>{holding.ticker}</strong> : key === 'name' ? <>{holding.name}<small>{holding.sector}</small></> : key === 'weight' ? `${holding.weight.toFixed(1)}%` : key === 'pnl' ? <span className={holding.pnl >= 0 ? 'positive' : 'negative'}>{holding.pnl > 0 ? '+' : ''}{holding.pnl.toFixed(2)}%</span> : key === 'price' ? `$${holding.price.toLocaleString()}` : holding.quantity.toLocaleString()}</td>)}
</motion.tr>)}</tbody></table></div></div></QueryState>;
}
