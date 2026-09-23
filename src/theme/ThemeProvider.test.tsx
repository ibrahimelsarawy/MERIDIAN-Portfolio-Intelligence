import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider, useTheme } from './ThemeProvider';
function Probe(){ const {theme, customTheme}=useTheme(); return <span>{theme}:{Object.keys(customTheme).length}</span>; }
describe('ThemeProvider',()=>{ it('provides default theme context during render',()=>{ const html=renderToStaticMarkup(<ThemeProvider><Probe/></ThemeProvider>); expect(html).toContain('dark:0'); }); it('throws when hook is used outside provider',()=>{ expect(()=>renderToStaticMarkup(<Probe/>)).toThrow('ThemeProvider missing'); }); });
