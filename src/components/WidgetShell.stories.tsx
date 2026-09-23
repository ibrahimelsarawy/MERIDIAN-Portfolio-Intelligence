import type { Meta, StoryObj } from '@storybook/react';
import { WidgetShell } from './WidgetShell';
const meta = { title: 'Core/WidgetShell', component: WidgetShell, args: { title: 'Portfolio Allocation', subtitle: 'CHART', onRemove: () => {}, children: <div style={{ padding: 16 }}>Widget content</div> } } satisfies Meta<typeof WidgetShell>;
export default meta; type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Configured: Story = { args: { config: { grouping: 'sector', donut: true }, onConfigChange: () => {} } };
