type Props = { label: string; value: string; hint: string };
export function RebalanceMetric({ label, value, hint }: Props) {
  return <div className="rebalance-metric"><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>;
}
