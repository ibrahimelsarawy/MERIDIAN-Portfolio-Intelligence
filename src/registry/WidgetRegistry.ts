import type { WidgetCategory, WidgetDefinition } from '../types/widgets';

class WidgetRegistry {
  private readonly definitions = new Map<string, WidgetDefinition>();

  register(definition: WidgetDefinition) {
    if (this.definitions.has(definition.id)) {
      throw new Error(`Widget already registered: ${definition.id}`);
    }
    this.definitions.set(definition.id, definition);
  }

  get(id: string) {
    return this.definitions.get(id);
  }

  getAll() {
    return [...this.definitions.values()];
  }

  getByCategory(category: WidgetCategory) {
    return this.getAll().filter((widget) => widget.category === category);
  }

  unregister(id: string) {
    return this.definitions.delete(id);
  }
}

export const widgetRegistry = new WidgetRegistry();
