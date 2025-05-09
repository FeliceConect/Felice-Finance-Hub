// src/components/RepassesTable.jsx
export default function RepassesTable({ dados }) {
  /* ----- cabeçalhos e chaves ----- */
  const meses = [
    'Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez',
  ];
  const keys = [
    'jan','fev','mar','abr','mai','jun',
    'jul','ago','setr','outu','nov','dez',
  ];

  /* ----- helpers ----- */
  const fmt = (v) =>
    v && Number(v) !== 0
      ? `R$ ${Number(v).toLocaleString('pt-BR')}`
      : '-';

  /* ----- totais por mês / geral ----- */
  const totaisMes  = keys.map((k) =>
    dados.reduce((s, r) => s + Number(r[k] || 0), 0)
  );
  const totalGeral = totaisMes.reduce((s, v) => s + v, 0);

  return (
    <div className="repasses-box">
      <table className="rep-table">
        <thead>
          <tr>
            <th>Profissional</th>
            <th>Núcleo</th>
            {meses.map((m) => <th key={m}>{m}</th>)}
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {dados.map((r) => {
            const total = keys.reduce((s, k) => s + Number(r[k] || 0), 0);
            return (
              <tr key={`${r.profissional}-${r.nucleo}`}>
                <td>{r.profissional}</td>
                <td>{r.nucleo}</td>
                {keys.map((k) => <td key={k}>{fmt(r[k])}</td>)}
                <td style={{ fontWeight: 600 }}>{fmt(total)}</td>
              </tr>
            );
          })}
        </tbody>

        {/* ------ LINHA TOTAL GERAL ------ */}
        <tfoot>
          <tr>
            <td colSpan={2} style={{ fontWeight: 700, textAlign: 'right' }}>
              Total&nbsp;Geral
            </td>
            {totaisMes.map((v, i) => (
              <td key={i} style={{ fontWeight: 700 }}>{fmt(v)}</td>
            ))}
            <td style={{ fontWeight: 700 }}>{fmt(totalGeral)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}