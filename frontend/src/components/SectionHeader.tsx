import type { ReactNode } from 'react';

type Props = { eyebrow: string; title: string; action?: ReactNode };

export function SectionHeader({ eyebrow, title, action }: Props) {
  return <div className="section-header"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action}</div>;
}
