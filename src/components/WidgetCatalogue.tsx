'use client';

import { useMemo, useState } from 'react';
import { LayoutGrid, Plus, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { widgetRegistry } from '../registry/WidgetRegistry';
import { useDashboardStore } from '../store/dashboardStore';
import { showSuccess } from '../lib/feedback';
import type { WidgetCategory } from '../types/widgets';

const categories: Array<'ALL' | WidgetCategory> = ['ALL', 'CHART', 'TABLE', 'FEED', 'GAUGE', 'ANALYSIS'];

export function WidgetCatalogue() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | WidgetCategory>('ALL');
  const addWidget = useDashboardStore((state) => state.addWidget);
  const widgets = widgetRegistry.getAll();

  const filteredWidgets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return widgets.filter((widget) => {
      const matchesCategory = activeCategory === 'ALL' || widget.category === activeCategory;
      const matchesSearch = !query || `${widget.name} ${widget.description} ${widget.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, widgets]);

  const handleAddWidget = (widgetId: string, name: string) => {
    const instanceId = addWidget(widgetId);
    if (!instanceId) return;

    // Wait for React Grid Layout to mount and compact the new item, then move
    // the user directly to it so adding a widget never feels like a no-op.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(`widget-${instanceId}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
    });

    void showSuccess('Widget added', `${name} was added to the dashboard.`);
  };

  return (
    <aside className="catalogue" aria-label="Widget catalogue">
      <div className="catalogue-heading">
        <LayoutGrid size={18} />
        <div><strong>Widget Catalogue</strong><span>{widgets.length} available</span></div>
      </div>

      <label className="catalogue-search">
        <Search size={15} aria-hidden="true" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search widgets" aria-label="Search widgets" />
        {search && <button type="button" className="icon-button compact-icon" onClick={() => setSearch('')} aria-label="Clear widget search"><X size={14} /></button>}
      </label>

      <div className="catalogue-filters" role="tablist" aria-label="Widget categories">
        {categories.map((category) => (
          <button key={category} type="button" className={activeCategory === category ? 'catalogue-filter active' : 'catalogue-filter'} onClick={() => setActiveCategory(category)}>
            {category === 'ALL' ? 'All' : category}
          </button>
        ))}
      </div>

      <div className="catalogue-list">
        {filteredWidgets.map((widget, index) => (
          <motion.button
            key={widget.id}
            type="button"
            className="catalogue-item"
            onClick={() => handleAddWidget(widget.id, widget.name)}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.025, duration: 0.18 }}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="catalogue-item-copy"><strong>{widget.name}</strong><small>{widget.description}</small></span>
            <Plus size={17} aria-hidden="true" />
          </motion.button>
        ))}
        {filteredWidgets.length === 0 && <div className="catalogue-empty"><strong>No widgets found</strong><span>Try another search or category.</span></div>}
      </div>
    </aside>
  );
}
