import type { ScenarioPreset } from '../types/scenario';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'market-selloff',
    name: 'Global Sell-off',
    description: 'Broad equity drawdown with defensive sectors holding up better.',
    shocks: [
      { sector: 'Technology', shock: -12 },
      { sector: 'Financials', shock: -9 },
      { sector: 'Energy', shock: -7 },
      { sector: 'Healthcare', shock: -4 },
      { sector: 'Industrials', shock: -8 },
    ],
  },
  {
    id: 'rate-shock',
    name: 'Rate Shock',
    description: 'Higher rates pressure growth and cyclical exposures.',
    shocks: [
      { sector: 'Technology', shock: -10 },
      { sector: 'Financials', shock: 2 },
      { sector: 'Energy', shock: -3 },
      { sector: 'Healthcare', shock: -2 },
      { sector: 'Industrials', shock: -5 },
    ],
  },
  {
    id: 'sector-rotation',
    name: 'Sector Rotation',
    description: 'Capital rotates away from technology into defensive exposures.',
    shocks: [
      { sector: 'Technology', shock: -8 },
      { sector: 'Financials', shock: 5 },
      { sector: 'Energy', shock: 4 },
      { sector: 'Healthcare', shock: 6 },
      { sector: 'Industrials', shock: 3 },
    ],
  },
];
