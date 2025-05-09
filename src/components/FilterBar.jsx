// src/components/FilterBar.jsx
import React from 'react';

export default function FilterBar({ filtros, setFiltros, nucleos }) {
  const onChange = e => {
    const { name, value } = e.target;
    setFiltros(f => ({
      ...f,
      // se escolher a opção em branco, manda null pro RPC
      [name]: value === '' ? null : value,
    }));
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      alignItems: 'flex-end',
    }}>
      {/* Mês */}
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Mês</label>
        <input
          type="month"
          name="mes"
          value={filtros.mes}
          onChange={onChange}
          style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #d1d5db' }}
        />
      </div>

      {/* Núcleo */}
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Núcleo</label>
        <select
          name="nucleo"
          value={filtros.nucleo || ''}
          onChange={onChange}
          style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #d1d5db' }}
        >
          <option value="">Todos</option>
          {nucleos.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Forma de Pagamento */}
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Forma de Pagamento</label>
        <select
          name="forma"
          value={filtros.forma || ''}
          onChange={onChange}
          style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #d1d5db' }}
        >
          <option value="">Todas</option>
          <option value="Cartão">Cartão</option>
          <option value="Pix">Pix</option>
          <option value="Dinheiro">Dinheiro</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Status</label>
        <select
          name="status"
          value={filtros.status || ''}
          onChange={onChange}
          style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #d1d5db' }}
        >
          <option value="">Todos</option>
          <option value="Prevista">Prevista</option>
          <option value="Recebida">Recebida</option>
          <option value="Estornada">Estornada</option>
        </select>
      </div>
    </div>
  );
}