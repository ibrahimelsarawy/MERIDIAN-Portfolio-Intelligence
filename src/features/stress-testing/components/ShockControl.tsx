'use client';

import type { SectorShock } from '../types/scenario';

type ShockControlProps = {
  shock: SectorShock;
  onChange: (next: number) => void;
};

export function ShockControl({ shock, onChange }: ShockControlProps) {
  return (
    <label className="shock-control">
      <span>{shock.sector}</span>
      <input type="range" min={-30} max={15} step={1} value={shock.shock} onChange={(event) => onChange(Number(event.target.value))} />
      <output className={shock.shock < 0 ? 'negative' : shock.shock > 0 ? 'positive' : ''}>{shock.shock > 0 ? '+' : ''}{shock.shock}%</output>
    </label>
  );
}
