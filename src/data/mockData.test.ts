import { describe, expect, it } from 'vitest';
import { drawdown, exposureTreemap } from './mockData';

describe('distinction mock data', () => {
  it('keeps drawdown values at or below zero', () => {
    expect(drawdown.length).toBeGreaterThan(20);
    expect(drawdown.every((point) => point.drawdown <= 0)).toBe(true);
  });

  it('provides a hierarchical exposure tree with a 100% top-level allocation', () => {
    const total = exposureTreemap.reduce((sum, node) => sum + node.value, 0);
    expect(total).toBe(100);
    expect(exposureTreemap.some((node) => node.children?.length)).toBe(true);
  });
});
