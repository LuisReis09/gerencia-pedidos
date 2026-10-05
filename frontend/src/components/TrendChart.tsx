import type { DashboardPoint } from '../api';

type Props = { points: DashboardPoint[]; loading: boolean };
type Metric = 'revenue' | 'cost' | 'profit';
const colors: Record<Metric, string> = { revenue: '#7062df', cost: '#dc9b32', profit: '#2ca579' };
const labels: Record<Metric, string> = { revenue: 'Vendas', cost: 'Custos', profit: 'Lucro' };
const chartWidth = 760;
const chartHeight = 240;
const padding = { top: 20, right: 20, bottom: 34, left: 42 };

export function TrendChart({ points, loading }: Props) {
  if (loading) return <div className="chart-loading"><span /><span /><span /></div>;
  if (points.length === 0) return <div className="chart-empty"><span>Sem movimentações no período</span><small>Escolha outro período ou produto para visualizar a evolução.</small></div>;

  const values = points.flatMap((point) => [point.revenue, point.cost, point.profit]);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 1);
  const range = maxValue - minValue || 1;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const x = (index: number) => padding.left + (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
  const y = (value: number) => padding.top + innerHeight - ((value - minValue) / range) * innerHeight;
  const line = (metric: Metric) => points.map((point, index) => `${x(index)},${y(point[metric])}`).join(' ');
  const formatDay = (value: string) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`)).replace('.', '');

  return <div className="trend-chart-wrap"><div className="chart-legend">{(['revenue', 'cost', 'profit'] as Metric[]).map((metric) => <span key={metric}><i style={{ background: colors[metric] }} />{labels[metric]}</span>)}</div><svg className="trend-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Evolução de vendas, custos e lucro"><line className="chart-axis" x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} /><line className="chart-axis" x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} />{[0, .5, 1].map((ratio) => { const value = minValue + range * ratio; return <g key={ratio}><line className="chart-grid" x1={padding.left} y1={y(value)} x2={chartWidth - padding.right} y2={y(value)} /><text className="chart-label" x={padding.left - 8} y={y(value) + 4} textAnchor="end">{Math.round(value).toLocaleString('pt-BR')}</text></g>; })}{(['revenue', 'cost', 'profit'] as Metric[]).map((metric) => <g key={metric}><polyline className="chart-line" points={line(metric)} stroke={colors[metric]} />{points.map((point, index) => <circle key={`${metric}-${point.date}`} className="chart-point" cx={x(index)} cy={y(point[metric])} r="3.5" fill={colors[metric]}><title>{`${labels[metric]} · ${formatDay(point.date)}: ${point[metric].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</title></circle>)}</g>)}{points.map((point, index) => <text key={point.date} className="chart-label" x={x(index)} y={chartHeight - 10} textAnchor="middle">{formatDay(point.date)}</text>)}</svg></div>;
}
