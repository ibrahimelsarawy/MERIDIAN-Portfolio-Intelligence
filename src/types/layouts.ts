import type { Layout } from 'react-grid-layout';
import type { WidgetInstance } from './widgets';

export type SavedLayoutVersion = {
  id: string;
  createdAt: string;
  widgets: WidgetInstance[];
  layout: Layout[];
};

export type SavedLayout = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  versions: SavedLayoutVersion[];
};

export type LayoutSnapshot = Pick<SavedLayoutVersion, 'widgets' | 'layout'>;
