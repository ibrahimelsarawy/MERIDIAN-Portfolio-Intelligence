export type DashboardEventMap = {
  SYMBOL_SELECTED: { symbol: string };
  DATE_RANGE_CHANGED: { start: string; end: string };
  ALERT_CLICKED: { alertId: string };
};

type Listener<T> = (payload: T) => void;

class EventBus<TEvents extends Record<string, unknown>> {
  private listeners = new Map<keyof TEvents, Set<Listener<unknown>>>();

  subscribe<TKey extends keyof TEvents>(event: TKey, listener: Listener<TEvents[TKey]>) {
    const listeners = this.listeners.get(event) ?? new Set();
    listeners.add(listener as Listener<unknown>);
    this.listeners.set(event, listeners);
    return () => listeners.delete(listener as Listener<unknown>);
  }

  publish<TKey extends keyof TEvents>(event: TKey, payload: TEvents[TKey]) {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  }
}

export const dashboardEventBus = new EventBus<DashboardEventMap>();
