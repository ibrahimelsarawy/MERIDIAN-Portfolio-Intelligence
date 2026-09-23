import type { Meta, StoryObj } from '@storybook/react';
import { WidgetCatalogue } from './WidgetCatalogue';
import { registerWidgets } from '../registry/registerWidgets';
registerWidgets();
const meta = { title: 'Dashboard/WidgetCatalogue', component: WidgetCatalogue } satisfies Meta<typeof WidgetCatalogue>;
export default meta; type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SearchReady: Story = {};
