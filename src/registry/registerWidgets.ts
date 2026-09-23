import { widgetRegistry } from './WidgetRegistry';
import { widgetDefinitions } from '../widgets/definitions';
export function registerWidgets() { widgetDefinitions.forEach((widget) => { if (!widgetRegistry.get(widget.id)) widgetRegistry.register(widget); }); }
