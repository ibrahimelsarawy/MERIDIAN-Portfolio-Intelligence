import { describe, expect, it } from 'vitest';
import { widgetDefinitions } from '../widgets/definitions';
import { widgetRegistry } from './WidgetRegistry';
import { registerWidgets } from './registerWidgets';

describe('WidgetRegistry', () => {
  it('registers all built-in widgets idempotently', () => {
    registerWidgets();
    registerWidgets();
    expect(widgetRegistry.getAll()).toHaveLength(widgetDefinitions.length);
  });

  it('looks up widgets by category', () => {
    registerWidgets();
    expect(widgetRegistry.getByCategory('CHART').length).toBeGreaterThan(0);
  });
});
