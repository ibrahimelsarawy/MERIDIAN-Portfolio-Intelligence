'use client';

import type { ReactNode } from 'react';

type QueryStateProps = { isLoading?: boolean; error?: Error | null; children: ReactNode; onRetry?: () => void };
export function QueryState({ isLoading, error, children, onRetry }: QueryStateProps) {
  if (isLoading) return <div className="widget-loading" aria-busy="true">Loading data…</div>;
  if (error) return <div className="widget-error" role="alert"><strong>Unable to load this widget.</strong><span>{error.message || 'Please try again.'}</span><button className="secondary-button" onClick={onRetry ?? (() => window.location.reload())}>Retry</button></div>;
  return <>{children}</>;
}
