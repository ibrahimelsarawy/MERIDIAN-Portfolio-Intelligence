'use client';

type ScenarioMetricProps = {
  label: string;
  value: string;
  helper: string;
  tone?: 'neutral' | 'positive' | 'negative' | 'warning';
};

export function ScenarioMetric({ label, value, helper, tone = 'neutral' }: ScenarioMetricProps) {
  return (
    <article className={`scenario-metric scenario-metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </article>
  );
}
