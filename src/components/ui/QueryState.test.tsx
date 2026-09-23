import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { QueryState } from './QueryState';
describe('QueryState',()=>{ it('renders loading state',()=>expect(renderToStaticMarkup(<QueryState isLoading>ok</QueryState>)).toContain('Loading data')); it('renders error state',()=>expect(renderToStaticMarkup(<QueryState error={new Error('Network')}>ok</QueryState>)).toContain('Unable to load this widget')); it('renders children when ready',()=>expect(renderToStaticMarkup(<QueryState>Ready</QueryState>)).toContain('Ready')); });
