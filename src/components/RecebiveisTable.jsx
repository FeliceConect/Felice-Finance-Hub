export default function RecebiveisTable({ dados, onConfirmar, onEstornar }) {
  const fmt = n=>`R$ ${Number(n).toLocaleString('pt-BR')}`;

  return (
    <table className="rec-table">
      <thead>
        <tr>
          <th>Data</th><th>Núcleo</th><th>Procedimento</th>
          <th>Forma</th><th>Valor Prof. (R$)</th><th>Valor Complexo (R$)</th>
          <th>Status</th><th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {dados.map(r=>(
          <tr key={r.parcela_id} className={r.status==='Recebida'?'linha-ok':''}>
            <td>{new Date(r.data_ref).toLocaleDateString('pt-BR')}</td>
            <td>{r.nucleo}</td>
            <td>{r.procedimento}</td>
            <td>{r.forma}</td>
            <td>{fmt(r.valor_prof)}</td>
            <td>{fmt(r.valor_complexo)}</td>
            <td><span className={`tag ${r.status.toLowerCase()}`}>{r.status}</span></td>
            <td>
              {r.status==='Prevista' && (
                <button onClick={()=>onConfirmar(r.parcela_id)}>Confirmar</button>
              )}
              {r.status==='Recebida' && (
                <button onClick={()=>onEstornar(r.parcela_id)}>Estornar</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}