# Meridian — Portfolio Decision Intelligence Workbench

Meridian is a portfolio analytics and decision-support workspace built with **Next.js, React, TypeScript, Zustand, React Query, Recharts, Vitest, and Storybook**.

It is designed as a realistic frontend engineering project rather than a static dashboard. The product connects portfolio monitoring, risk diagnostics, scenario analysis, rebalancing, research workflows, governance, and reporting in one analyst workspace.

> **Data notice:** Meridian currently uses simulated data. It is a portfolio analytics and software-engineering demonstration, not a brokerage, execution platform, or source of live market data or investment advice.

## Why Meridian exists

Traditional portfolio dashboards answer **"what happened?"** Meridian is designed around a broader decision workflow:

**Monitor → Diagnose → Simulate → Plan → Decide → Review**

That workflow is reflected directly in the product architecture.

## Core capabilities

### Portfolio management
- Multiple portfolio contexts with objectives, risk budgets, target returns, drawdown limits, and review dates.
- Holdings, allocation, performance, drawdown, market activity, and correlation views.
- Persistent, responsive dashboard layouts with widget discovery and lazy loading.

### Risk & diagnostics
- Portfolio Health Center with explainable policy findings.
- Value-at-Risk monitoring and risk-budget utilization.
- Concentration and sector exposure analysis.
- Attribution analysis to explain performance drivers.
- Data Quality Center for allocation, price, duplicate-instrument, and timeline checks.

### Decision support
- Scenario Lab for sector-level stress testing and what-if analysis.
- Rebalancing Planner for target-vs-current allocation drift and trade actions.
- Investment Thesis / Decision Journal for recording rationale and review triggers.
- Rules & Alerts engine for explicit portfolio policy conditions.
- Investment Desk as the central analyst workspace connecting these workflows.

### Research & governance
- Backtesting Lab for illustrative strategy comparisons.
- Portfolio review report generation.
- Audit Trail for analytical actions within the desk session.
- Clear simulated-data labeling and non-forecast disclaimers.

## Product workflow

```text
Portfolio Context
      ↓
Monitor
  ├── Performance
  ├── Holdings
  └── Allocation
      ↓
Diagnose
  ├── Portfolio Health
  ├── Risk / VaR
  ├── Exposure
  ├── Attribution
  └── Data Quality
      ↓
Simulate
  ├── Scenario Lab
  └── Backtesting Lab
      ↓
Plan
  └── Rebalancing Planner
      ↓
Decide
  └── Investment Thesis / Decision Journal
      ↓
Review
  ├── Alerts & Rules
  ├── Audit Trail
  └── Portfolio Report
```

## Architecture

```text
app/
├── layout.tsx
├── page.tsx
├── dashboard-client.tsx
├── providers.tsx
└── globals.css

src/
├── components/          # reusable UI and dashboard primitives
├── data/                # simulated API and domain fixtures
├── events/              # typed cross-widget event bus
├── features/            # domain-specific workflows and engines
│   ├── analyst-command-center/
│   ├── investment-desk/
│   ├── layouts/
│   ├── portfolio-health/
│   ├── rebalancing/
│   └── stress-testing/
├── grid/                # responsive dashboard workspace
├── hooks/               # data and dashboard hooks
├── lib/                 # shared utilities
├── registry/            # widget discovery and registration
├── store/               # persistent dashboard state
├── theme/               # theme tokens and theme provider
├── types/               # shared domain types
└── widgets/             # independently registered dashboard widgets
```

### Engineering principles

- **Domain logic is isolated from presentation.** Calculation engines are pure TypeScript modules where possible.
- **Feature boundaries are explicit.** Complex workflows live under `src/features` rather than inside giant page components.
- **Widgets are independently registered.** New widgets can be added without rewriting the dashboard shell.
- **State ownership is intentional.** Zustand handles user-controlled workspace state while React Query models server-style data access.
- **Typed communication.** The EventBus provides a controlled boundary for cross-widget interactions.
- **Theme tokens drive the UI.** Dark, light, high-contrast, and custom themes share the same component system.
- **Scrollable surfaces are intentional.** Dense tables, feeds, and analytical panels use internal overflow instead of clipping content.
- **Testing is part of the feature.** Domain engines and important UI/state behavior include Vitest coverage.

## Project structure for a new feature

A feature should generally follow this shape:

```text
src/features/example-feature/
├── components/      # feature-specific presentation
├── lib/             # pure calculations, policies, helpers
└── types/           # feature domain types
```

Widgets should consume those feature modules rather than owning business logic themselves.

## Development

```bash
npm install
npm run dev
```

Open the local development server shown by Next.js.

### Quality checks

```bash
npm run build
npm test
npm run test:coverage
npm run storybook
npm run build-storybook
```

## Simulated data

The current repository intentionally uses local fixtures and simulated market activity so the application can run without credentials or external services. This keeps the demo reproducible and safe to publish publicly.

Scenario analysis and backtesting are illustrative calculations over the simulated dataset. They should not be interpreted as forecasts or investment recommendations.

## GitHub / portfolio focus

Meridian demonstrates:

- Production-minded React architecture
- Next.js App Router structure
- TypeScript domain modeling
- Feature-based code organization
- Reusable and accessible UI components
- Zustand state management
- React Query data boundaries
- Data visualization with Recharts
- Responsive drag-and-resize workspaces
- Theme systems and accessibility considerations
- Pure analytical engines with automated tests
- Scenario modeling and policy rules
- Error/loading states and widget boundaries
- Storybook-ready component development

## License

MIT — see `LICENSE`.
