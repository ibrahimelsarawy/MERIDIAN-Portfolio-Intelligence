# Performance Notes

The project is structured to keep expensive concerns isolated:

- Widgets are lazy loaded.
- API state is cached through React Query.
- Layout state is persisted separately from server state.
- Search/sort computations in the holdings widget use `useMemo`.
- Dashboard layout changes are handled by the grid library rather than custom DOM measurement loops.
- Widgets are isolated by error boundaries so one failure does not collapse the dashboard.

Before final submission, run production profiling, Lighthouse, bundle analysis and the full test suite in the target environment.
