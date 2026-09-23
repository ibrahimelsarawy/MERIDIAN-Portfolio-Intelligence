import { dashboardEventBus } from '../events/EventBus';

export function startMarketSimulation() {
  const symbols = ['AAPL', 'MSFT', 'JPM', 'XOM', 'LLY'];
  const interval = window.setInterval(() => {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    dashboardEventBus.publish('SYMBOL_SELECTED', { symbol });
  }, 30_000);

  return () => window.clearInterval(interval);
}
