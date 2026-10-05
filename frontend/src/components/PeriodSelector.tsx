import { CalendarDays, Check, ChevronDown } from 'lucide-react';

export type PeriodPreset = 7 | 30 | 90 | 'custom';
export type Period = { startDate: string; endDate: string; preset: PeriodPreset };

type Props = {
  period: Period;
  loading: boolean;
  onChange: (period: Period) => void;
  onApply: () => void;
  onPreset: (days: 7 | 30 | 90) => void;
};

export function PeriodSelector({ period, loading, onChange, onApply, onPreset }: Props) {
  return <div className="period-selector">
    <div className="preset-group" aria-label="Período de consulta">
      {([7, 30, 90] as const).map((days) => <button key={days} className={period.preset === days ? 'preset active' : 'preset'} onClick={() => onPreset(days)}>{days} dias</button>)}
    </div>
    <div className="custom-period">
      <label><CalendarDays size={15} /><span>De</span><input aria-label="Data inicial" type="date" value={period.startDate} max={period.endDate || undefined} onChange={(event) => onChange({ ...period, preset: 'custom', startDate: event.target.value })} /></label>
      <span className="period-separator">até</span>
      <label><CalendarDays size={15} /><span>Até</span><input aria-label="Data final" type="date" min={period.startDate || undefined} value={period.endDate} onChange={(event) => onChange({ ...period, preset: 'custom', endDate: event.target.value })} /></label>
      <button className="button primary small" onClick={onApply} disabled={loading}><Check size={15} />{loading ? 'Consultando' : 'Aplicar'}</button>
    </div>
    <ChevronDown className="period-chevron" size={15} />
  </div>;
}
