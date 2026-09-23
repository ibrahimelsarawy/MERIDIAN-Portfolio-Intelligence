import { describe, expect, it, vi } from 'vitest';
import { dashboardEventBus } from './EventBus';

describe('dashboardEventBus', () => {
  it('delivers payloads to subscribers and stops after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = dashboardEventBus.subscribe('SYMBOL_SELECTED', listener);
    dashboardEventBus.publish('SYMBOL_SELECTED', { symbol: 'AAPL' });
    expect(listener).toHaveBeenCalledWith({ symbol: 'AAPL' });
    unsubscribe();
    dashboardEventBus.publish('SYMBOL_SELECTED', { symbol: 'MSFT' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('supports independent event channels', () => {
    const listener = vi.fn();
    const unsubscribe = dashboardEventBus.subscribe('DATE_RANGE_CHANGED', listener);
    dashboardEventBus.publish('ALERT_CLICKED', { alertId: 'a-1' });
    expect(listener).not.toHaveBeenCalled();
    dashboardEventBus.publish('DATE_RANGE_CHANGED', { start: '2026-01-01', end: '2026-01-31' });
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
