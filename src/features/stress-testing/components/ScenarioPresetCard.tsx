'use client';

import type { ScenarioPreset } from '../types/scenario';

type ScenarioPresetCardProps = {
  preset: ScenarioPreset;
  active: boolean;
  onSelect: (preset: ScenarioPreset) => void;
};

export function ScenarioPresetCard({ preset, active, onSelect }: ScenarioPresetCardProps) {
  return (
    <button type="button" className={`scenario-preset ${active ? 'is-active' : ''}`} onClick={() => onSelect(preset)}>
      <span className="scenario-preset-title">{preset.name}</span>
      <span className="scenario-preset-description">{preset.description}</span>
    </button>
  );
}
