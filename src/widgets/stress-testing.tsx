'use client';

import { RotateCcw, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useHoldings } from '../hooks/useDashboardData';
import { QueryState } from '../components/ui/QueryState';
import type { WidgetComponentProps } from '../types/widgets';
import { calculateScenario } from '../features/stress-testing/lib/scenarioEngine';
import { SCENARIO_PRESETS } from '../features/stress-testing/lib/presets';
import type { ScenarioPreset, SectorShock } from '../features/stress-testing/types/scenario';
import { ScenarioMetric } from '../features/stress-testing/components/ScenarioMetric';
import { ScenarioPresetCard } from '../features/stress-testing/components/ScenarioPresetCard';
import { ShockControl } from '../features/stress-testing/components/ShockControl';

const SECTORS = ['Technology', 'Financials', 'Energy', 'Healthcare', 'Industrials'];

const normalizeShocks = (shocks: SectorShock[]) => SECTORS.map((sector) => shocks.find((shock) => shock.sector === sector) ?? { sector, shock: 0 });

export default function StressTestingWidget(_: WidgetComponentProps<Record<string, unknown>, unknown>) {
  const query = useHoldings();
  const [selectedPreset, setSelectedPreset] = useState<ScenarioPreset | null>(SCENARIO_PRESETS[0]);
  const [shocks, setShocks] = useState<SectorShock[]>(normalizeShocks(SCENARIO_PRESETS[0].shocks));

  const result = useMemo(() => calculateScenario(query.data ?? [], shocks), [query.data, shocks]);
  const hasShock = shocks.some(({ shock }) => shock !== 0);

  const selectPreset = (preset: ScenarioPreset) => {
    setSelectedPreset(preset);
    setShocks(normalizeShocks(preset.shocks));
  };

  const updateShock = (sector: string, shock: number) => {
    setSelectedPreset(null);
    setShocks((current) => current.map((item) => item.sector === sector ? { ...item, shock } : item));
  };

  const reset = () => selectPreset(SCENARIO_PRESETS[0]);

  return (
    <QueryState isLoading={query.isLoading} error={query.error} onRetry={() => query.refetch()}>
      {query.data && (
        <div className="stress-widget">
          <div className="stress-toolbar">
            <div>
              <span className="stress-kicker"><ShieldAlert size={13} /> WHAT-IF ANALYSIS</span>
              <strong>Model portfolio response before the market moves.</strong>
            </div>
            <button type="button" className="secondary-button" onClick={reset} title="Reset scenario"><RotateCcw size={14} />Reset</button>
          </div>

          <div className="scenario-presets" aria-label="Scenario presets">
            {SCENARIO_PRESETS.map((preset) => <ScenarioPresetCard key={preset.id} preset={preset} active={selectedPreset?.id === preset.id} onSelect={selectPreset} />)}
          </div>

          <div className="stress-main">
            <section className="shock-panel">
              <div className="scenario-section-heading"><div><span className="eyebrow">SCENARIO INPUTS</span><h3>Sector shocks</h3></div><SlidersHorizontal size={17} /></div>
              <div className="shock-list">{shocks.map((shock) => <ShockControl key={shock.sector} shock={shock} onChange={(value) => updateShock(shock.sector, value)} />)}</div>
              {!hasShock && <p className="scenario-hint">Set at least one sector shock to model a scenario.</p>}
            </section>

            <section className="scenario-result">
              <div className="scenario-section-heading"><div><span className="eyebrow">PROJECTED OUTCOME</span><h3>Portfolio impact</h3></div><span className={`scenario-badge ${result.portfolioImpact < 0 ? 'negative' : 'positive'}`}>{result.portfolioImpact > 0 ? '+' : ''}{result.portfolioImpact}%</span></div>
              <div className="scenario-metrics">
                <ScenarioMetric label="Projected value" value={`$${(result.projectedValue / 1_000_000).toFixed(2)}M`} helper="after scenario" tone={result.portfolioImpact < 0 ? 'negative' : 'positive'} />
                <ScenarioMetric label="Projected loss" value={`$${(result.projectedLoss / 1_000_000).toFixed(2)}M`} helper="capital at risk" tone={result.projectedLoss > 0 ? 'negative' : 'positive'} />
                <ScenarioMetric label="Drawdown" value={`${result.projectedDrawdown}%`} helper="estimated peak-to-trough" tone="warning" />
                <ScenarioMetric label="Risk utilization" value={`${result.riskUtilization}%`} helper={`${result.affectedHoldings} holdings affected`} tone={result.riskUtilization >= 90 ? 'negative' : 'warning'} />
              </div>
              <div className="scenario-bar"><span style={{ width: `${Math.min(result.projectedDrawdown, 100)}%` }} /></div>
              <p className="scenario-disclaimer">Illustrative stress test using portfolio weights and sector-level shocks. It is a decision-support simulation, not a forecast.</p>
            </section>
          </div>
        </div>
      )}
    </QueryState>
  );
}
