import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDashboardStore } from './dashboardStore';

const initial = () => useDashboardStore.getState().resetDashboard();

describe('dashboardStore', () => {
  beforeEach(() => { initial(); vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-id'); });
  it('adds a widget as a full-width row at the visible bottom', () => {
    const state = useDashboardStore.getState();
    const id = state.addWidget('news-feed');
    expect(id).toBe('test-id');
    const next = useDashboardStore.getState();
    const item = next.layout.find((x) => x.i === id)!;
    expect(item.w).toBe(12);
    expect(item.x).toBe(0);
    expect(next.widgets.some((x) => x.instanceId === id)).toBe(true);
  });
  it('returns null for an unknown widget', () => expect(useDashboardStore.getState().addWidget('missing')).toBeNull());
  it('removes widgets and their layout item', () => {
    const id = useDashboardStore.getState().widgets[0].instanceId;
    useDashboardStore.getState().removeWidget(id);
    const state = useDashboardStore.getState();
    expect(state.widgets.some((x) => x.instanceId === id)).toBe(false);
    expect(state.layout.some((x) => x.i === id)).toBe(false);
  });
  it('updates configuration without mutating other widgets', () => {
    const id = useDashboardStore.getState().widgets[0].instanceId;
    useDashboardStore.getState().updateWidgetConfig(id, { range: '1Y' });
    expect(useDashboardStore.getState().widgets.find((x) => x.instanceId === id)?.config).toEqual({ range: '1Y' });
  });
  it('exports and imports a snapshot and creates a saved layout', () => {
    const snapshot = useDashboardStore.getState().exportCurrentSnapshot();
    useDashboardStore.getState().importSnapshot(snapshot, 'Imported');
    expect(useDashboardStore.getState().savedLayouts[0].name).toBe('Imported');
    useDashboardStore.getState().saveCurrentLayout('My Layout', 'desc');
    expect(useDashboardStore.getState().savedLayouts.some((x) => x.name === 'My Layout')).toBe(true);
  });
  it('loads and restores versions and handles unknown ids', () => {
    useDashboardStore.getState().saveCurrentLayout('One', '');
    const saved = useDashboardStore.getState().savedLayouts[0];
    expect(useDashboardStore.getState().loadSavedLayout(saved.id)).toBe(true);
    expect(useDashboardStore.getState().loadSavedLayout('missing')).toBe(false);
    expect(useDashboardStore.getState().restoreVersion(saved.id, saved.versions[0].id)).toBe(true);
    expect(useDashboardStore.getState().restoreVersion(saved.id, 'missing')).toBe(false);
    useDashboardStore.getState().deleteSavedLayout(saved.id);
    expect(useDashboardStore.getState().savedLayouts).toHaveLength(0);
  });
});
