import React from 'react';

export default function MonthSelector({ value, onChange }) {
  // Gera os últimos 12 meses
  const options = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const v = d.toISOString().slice(0, 7); // "YYYY-MM"
    const label = d.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short'
    });
    return { value: v, label };
  });

  return (
    <select
      className="month-selector"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}