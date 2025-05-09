import './KpiCard.css';

export default function KpiCard({ label, value, subtitle, deltaPct }) {
  const pct = typeof deltaPct === 'number' && !Number.isNaN(deltaPct)
    ? deltaPct
    : 0;

  const deltaStr   = `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
  const deltaClass = pct > 0 ? 'up' : pct < 0 ? 'down' : '';

  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value || '—'}</div>
      <div className="kpi-sub">{subtitle}</div>
      <div className={`kpi-delta ${deltaClass}`}>
        {deltaStr} desde mês anterior
      </div>
    </div>
  );
}