import { widgetRegistry } from './src/registry/WidgetRegistry';
import { registerWidgets } from './src/registry/registerWidgets';
if (widgetRegistry.getAll().length === 0) registerWidgets();
