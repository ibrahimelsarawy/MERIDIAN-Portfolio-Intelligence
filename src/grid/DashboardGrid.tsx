'use client';

import { Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Responsive, type Layouts } from 'react-grid-layout';
import { useDashboardStore } from '../store/dashboardStore';
import { widgetRegistry } from '../registry/WidgetRegistry';
import { WidgetShell } from '../components/WidgetShell';
import { WidgetErrorBoundary } from '../components/WidgetErrorBoundary';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => setWidth(Math.floor(element.getBoundingClientRect().width));
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

export function DashboardGrid() {
  const widgets = useDashboardStore((state) => state.widgets);
  const layout = useDashboardStore((state) => state.layout);
  const setLayout = useDashboardStore((state) => state.setLayout);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const updateWidgetConfig = useDashboardStore((state) => state.updateWidgetConfig);
  const resetDashboard = useDashboardStore((state) => state.resetDashboard);
  const { ref, width } = useContainerWidth<HTMLElement>();
  const [breakpoint, setBreakpoint] = useState<'lg' | 'md' | 'sm'>('lg');

  const layouts = useMemo<Layouts>(() => ({
    lg: layout,
    md: layout.map((item) => ({ ...item, x: Math.min(item.x, 5), w: Math.min(item.w, 6) })),
    sm: layout.map((item) => ({ ...item, x: 0, w: 1 })),
  }), [layout]);

  if (widgets.length === 0) {
    return <section ref={ref} className="dashboard-area dashboard-empty-state" aria-label="Portfolio dashboard"><div className="dashboard-empty-card"><span className="eyebrow">EMPTY WORKSPACE</span><h2>Build the dashboard you need</h2><p>Add widgets from the catalogue or restore the Meridian default workspace.</p><button className="primary-button" onClick={resetDashboard}>Restore default dashboard</button></div></section>;
  }

  return (
    <section ref={ref} className="dashboard-area" aria-label="Portfolio dashboard">
      {width > 0 && (
        <Responsive
          className="layout"
          width={width}
          layouts={layouts}
          breakpoints={{ lg: 1280, md: 768, sm: 0 }}
          cols={{ lg: 12, md: 6, sm: 1 }}
          rowHeight={60}
          margin={[8, 8]}
          containerPadding={[0, 0]}
          compactType="vertical"
          preventCollision={false}
          draggableHandle=".widget-header"
          resizeHandles={['se']}
          isDraggable={breakpoint !== 'sm'}
          isResizable={breakpoint !== 'sm'}
          onBreakpointChange={(nextBreakpoint) => {
            if (nextBreakpoint === 'lg' || nextBreakpoint === 'md' || nextBreakpoint === 'sm') setBreakpoint(nextBreakpoint);
          }}
          onLayoutChange={(nextLayout, allLayouts) => {
            // Persist only the canonical desktop layout. The md/sm layouts are
            // responsive projections and must never overwrite the desktop grid.
            setLayout(allLayouts.lg ?? nextLayout);
          }}
        >
          {widgets.map((instance) => {
            const definition = widgetRegistry.get(instance.widgetId);
            if (!definition) {
              return <div key={instance.instanceId} id={`widget-${instance.instanceId}`} data-widget-id={instance.widgetId} className="dashboard-grid-item"><div className="missing-widget">Unknown widget: {instance.widgetId}</div></div>;
            }

            const WidgetComponent = definition.component;
            return (
              <div key={instance.instanceId} id={`widget-${instance.instanceId}`} data-widget-id={instance.widgetId} className="dashboard-grid-item">
                <WidgetShell title={definition.name} subtitle={definition.category} config={instance.config} onConfigChange={(config) => updateWidgetConfig(instance.instanceId, config)} onRemove={() => removeWidget(instance.instanceId)}>
                  <WidgetErrorBoundary widgetName={definition.name}>
                    <Suspense fallback={<div className="widget-loading">Loading widget…</div>}>
                      <WidgetComponent config={instance.config} onConfigChange={(config) => updateWidgetConfig(instance.instanceId, config)} />
                    </Suspense>
                  </WidgetErrorBoundary>
                </WidgetShell>
              </div>
            );
          })}
        </Responsive>
      )}
    </section>
  );
}
