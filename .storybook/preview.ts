import '../app/globals.css';
import { themes } from '../src/theme/themes';
Object.entries(themes.dark).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
export const parameters = { controls: { expanded: true } };
