# Meridian Architecture

## 1. Registry-driven widgets

The dashboard core does not import concrete widgets directly. A widget is described by a `WidgetDefinition` and registered in `WidgetRegistry`.

```text
WidgetDefinition
      ↓
WidgetRegistry → WidgetCatalogue
      ↓
DashboardGrid → Lazy Widget Component
```

This keeps the dashboard shell independent from individual analytics modules.

## 2. State boundaries

- **React Query:** asynchronous data, caching, stale times and polling.
- **Zustand:** user-controlled widgets, grid layout, saved layouts and widget configuration.
- **EventBus:** typed cross-widget communication without direct widget-to-widget imports.
- **Feature modules:** domain logic stays close to the feature instead of leaking into global UI code.

## 3. Scenario Lab architecture

```text
Holdings Query
     ↓
Scenario Widget
  ↙     ↓      ↘
Presets  Shock Controls  Metrics
     \      |      /
       Scenario Engine
             ↓
        ScenarioResult
```

`scenarioEngine.ts` is a pure function. It has no React dependency and can therefore be tested independently or reused by a future API/server workflow.

## 4. Component principles

- Keep widgets responsible for orchestration, not business calculations.
- Prefer typed props over `any`.
- Extract repeated visual patterns into reusable components.
- Keep feature-specific components under the feature boundary.
- Keep data access behind hooks/API modules.
- Make destructive or persistent actions explicit.
