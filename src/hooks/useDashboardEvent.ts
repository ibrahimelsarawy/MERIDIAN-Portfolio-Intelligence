import { useEffect, useState } from 'react';
import { dashboardEventBus, type DashboardEventMap } from '../events/EventBus';

/** Small reusable hook that keeps event-bus subscriptions inside React lifecycle. */
export function useDashboardEvent<TKey extends keyof DashboardEventMap>(event: TKey) {
  const [payload, setPayload] = useState<DashboardEventMap[TKey] | null>(null);
  useEffect(() => {
    const unsubscribe = dashboardEventBus.subscribe(event, setPayload);
    return () => { unsubscribe(); };
  }, [event]);
  return payload;
}
