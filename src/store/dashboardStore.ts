import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Layout } from 'react-grid-layout';
import { widgetDefinitions } from '../widgets/definitions';
import type { LayoutSnapshot, SavedLayout, SavedLayoutVersion } from '../types/layouts';

const MAX_VERSIONS = 10;
const GRID_COLUMNS = 12;

const createInitialState = (): LayoutSnapshot => ({
  widgets: widgetDefinitions.map((definition, index) => ({
    instanceId: `w-${index + 1}`,
    widgetId: definition.id,
    config: definition.defaultConfig,
  })),
  layout: [
    { i: 'w-10', x: 0, y: 0, w: 12, h: 1, minW: 6, minH: 1 },
    { i: 'w-1', x: 0, y: 1, w: 5, h: 4, minW: 3, minH: 3 },
    { i: 'w-2', x: 5, y: 1, w: 7, h: 4, minW: 4, minH: 3 },
    { i: 'w-4', x: 0, y: 5, w: 12, h: 4, minW: 6, minH: 3 },
    { i: 'w-7', x: 0, y: 9, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'w-3', x: 6, y: 9, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'w-5', x: 0, y: 13, w: 12, h: 4, minW: 6, minH: 3 },
    { i: 'w-6', x: 0, y: 17, w: 12, h: 4, minW: 6, minH: 3 },
    { i: 'w-8', x: 0, y: 21, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'w-9', x: 6, y: 21, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'w-11', x: 0, y: 25, w: 12, h: 4, minW: 6, minH: 3 },
    { i: 'w-12', x: 0, y: 29, w: 12, h: 4, minW: 6, minH: 3 },
    { i: 'w-13', x: 0, y: 33, w: 12, h: 6, minW: 8, minH: 5 },
    { i: 'w-14', x: 0, y: 39, w: 12, h: 6, minW: 8, minH: 5 },
    { i: 'w-15', x: 0, y: 45, w: 12, h: 6, minW: 8, minH: 5 },
    { i: 'w-16', x: 0, y: 51, w: 12, h: 6, minW: 8, minH: 5 },
  ],
});
const createVersion = (snapshot: LayoutSnapshot): SavedLayoutVersion => ({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), widgets: snapshot.widgets, layout: snapshot.layout });

const cloneSnapshot = (snapshot: LayoutSnapshot): LayoutSnapshot => structuredClone(snapshot);

type DashboardState = LayoutSnapshot & {
  savedLayouts: SavedLayout[];
  setLayout: (layout: Layout[]) => void;
  addWidget: (widgetId: string) => string | null;
  removeWidget: (instanceId: string) => void;
  updateWidgetConfig: (instanceId: string, config: Record<string, unknown>) => void;
  resetDashboard: () => void;
  saveCurrentLayout: (name: string, description: string) => void;
  loadSavedLayout: (layoutId: string) => boolean;
  deleteSavedLayout: (layoutId: string) => void;
  restoreVersion: (layoutId: string, versionId: string) => boolean;
  exportCurrentSnapshot: () => LayoutSnapshot;
  importSnapshot: (snapshot: LayoutSnapshot, name?: string) => void;
};

export const useDashboardStore = create<DashboardState>()(persist((set, get) => ({
  ...createInitialState(),
  savedLayouts: [],
  setLayout: (layout) => set((state) => {
    if (JSON.stringify(state.layout) === JSON.stringify(layout)) return state;
    return { layout };
  }),
  addWidget: (widgetId) => {
    const definition = widgetDefinitions.find((widget) => widget.id === widgetId);
    if (!definition) return null;

    const instanceId = crypto.randomUUID();
    set((state) => {
      const nextY = state.layout.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0);

      // A newly added widget always gets a complete row. This guarantees that
      // the catalogue action is immediately visible and prevents empty space
      // beside wide tables, feeds and charts. Users can still resize it later.
      const nextLayoutItem: Layout = {
        i: instanceId,
        x: 0,
        y: nextY,
        w: GRID_COLUMNS,
        h: Math.max(definition.defaultSize.h, 3),
        minW: Math.min(definition.minSize.w, GRID_COLUMNS),
        minH: definition.minSize.h,
      };

      return {
        widgets: [...state.widgets, { instanceId, widgetId, config: definition.defaultConfig }],
        layout: [...state.layout, nextLayoutItem],
      };
    });

    return instanceId;
  },
  removeWidget: (instanceId) => set((state) => ({ widgets: state.widgets.filter((widget) => widget.instanceId !== instanceId), layout: state.layout.filter((item) => item.i !== instanceId) })),
  updateWidgetConfig: (instanceId, config) => set((state) => ({ widgets: state.widgets.map((widget) => widget.instanceId === instanceId ? { ...widget, config } : widget) })),
  resetDashboard: () => set(createInitialState()),
  saveCurrentLayout: (name, description) => {
    const snapshot = cloneSnapshot({ widgets: get().widgets, layout: get().layout });
    const now = new Date().toISOString();
    const saved: SavedLayout = { id: crypto.randomUUID(), name: name.trim() || 'Untitled layout', description: description.trim(), createdAt: now, updatedAt: now, versions: [createVersion(snapshot)] };
    set((state) => ({ savedLayouts: [saved, ...state.savedLayouts] }));
  },
  loadSavedLayout: (layoutId) => {
    const saved = get().savedLayouts.find((item) => item.id === layoutId);
    const latest = saved?.versions.at(-1);
    if (!latest) return false;
    set(cloneSnapshot(latest));
    return true;
  },
  deleteSavedLayout: (layoutId) => set((state) => ({ savedLayouts: state.savedLayouts.filter((item) => item.id !== layoutId) })),
  restoreVersion: (layoutId, versionId) => {
    const saved = get().savedLayouts.find((item) => item.id === layoutId);
    const version = saved?.versions.find((item) => item.id === versionId);
    if (!saved || !version) return false;
    const snapshot = cloneSnapshot(version);
    set((state) => ({ ...snapshot, savedLayouts: state.savedLayouts.map((item) => item.id !== layoutId ? item : { ...item, updatedAt: new Date().toISOString(), versions: [...item.versions, createVersion(snapshot)].slice(-MAX_VERSIONS) }) }));
    return true;
  },
  exportCurrentSnapshot: () => cloneSnapshot({ widgets: get().widgets, layout: get().layout }),
  importSnapshot: (snapshot, name = 'Imported layout') => {
    const safeSnapshot = cloneSnapshot(snapshot);
    const now = new Date().toISOString();
    const saved: SavedLayout = { id: crypto.randomUUID(), name, description: 'Imported from a Meridian JSON file.', createdAt: now, updatedAt: now, versions: [createVersion(safeSnapshot)] };
    set((state) => ({ ...safeSnapshot, savedLayouts: [saved, ...state.savedLayouts] }));
  },
}), {
  name: 'meridian-dashboard-layout',
  version: 11,
  migrate: () => ({ ...createInitialState(), savedLayouts: [] }),
}));
