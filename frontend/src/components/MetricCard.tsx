import type { ReactNode } from 'react';

type Props = { label: string; value: string; tone: 'blue' | 'violet' | 'amber' | 'green'; icon: ReactNode };

export function MetricCard({ label, value, tone, icon }: Props) {
  return <article className={`metric-card ${tone}`}><div className="metric-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></article>;
}
