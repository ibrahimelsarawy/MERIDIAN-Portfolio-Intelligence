import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
vi.mock('../lib/feedback', () => ({ showSuccess: vi.fn(), showError: vi.fn(), confirmDestructiveAction: vi.fn().mockResolvedValue(false) }));
import { WidgetCatalogue } from './WidgetCatalogue';
import { WidgetShell } from './WidgetShell';
import { WidgetErrorBoundary } from './WidgetErrorBoundary';
import { LayoutManager } from './layouts/LayoutManager';
import { themes } from '../theme/themes';

describe('core UI rendering', () => {
  it('renders widget catalogue with registered widgets', () => { const html=renderToStaticMarkup(<WidgetCatalogue/>); expect(html).toContain('Widget Catalogue'); expect(html).toContain('available'); });
  it('renders widget shell and actions', () => { const html=renderToStaticMarkup(<WidgetShell title="Risk" subtitle="GAUGE" onRemove={()=>{}}>Body</WidgetShell>); expect(html).toContain('Risk'); expect(html).toContain('Configure Risk'); expect(html).toContain('Body'); });
  it('renders layout controls', () => { const html=renderToStaticMarkup(<LayoutManager/>); expect(html).toContain('Layouts'); expect(html).toContain('Export'); expect(html).toContain('Import'); });
  it('error boundary renders children by default and fallback state is derivable', () => { const html=renderToStaticMarkup(<WidgetErrorBoundary widgetName="Risk"><span>ok</span></WidgetErrorBoundary>); expect(html).toContain('ok'); expect(WidgetErrorBoundary.getDerivedStateFromError()).toEqual({hasError:true}); });
  it('ships all preset themes', () => { expect(Object.keys(themes)).toEqual(expect.arrayContaining(['dark','light','high-contrast'])); expect(themes.dark['--bg']).toMatch(/^#/); });
});
