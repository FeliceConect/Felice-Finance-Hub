import { useEffect, useState } from 'react';
import { supabase }            from '../lib/supa';
import CardFeeRow              from '../components/CardFeeRow';

export default function TaxasCartao() {
  const [lista, setLista] = useState([]);

  /* ---------- carregar lista ---------- */
  const load = async () => {
    const { data, error } = await supabase
      .from('card_fee')
      .select('*')
      .order('installments');
    if (!error) setLista(data ?? []);
  };

  useEffect(() => {             // NÃO devolvemos nada → sem “destroy is not a function”
    load();
  }, []);

  /* ---------- criar nova taxa ---------- */
  const nova = async () => {
    const parcelas = Number(prompt('Número de parcelas'));
    if (!parcelas) return;

    const pctStr = prompt('Taxa % (use ponto ou vírgula)');
    if (!pctStr) return;
    const feePct = Number(pctStr.replace(',', '.'));

    const { error } = await supabase
      .from('card_fee')
      .insert({ installments: parcelas, fee_pct: feePct });
    if (error) return alert(error.message);

    load();
  };

  /* ---------- render ---------- */
  return (
    <div style={{ padding: '2rem', maxWidth: 640 }}>
      {/* cabeçalho -------------------------------------------------------- */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h1 className="page-title">Lista de Taxas</h1>
          <p className="subtitle">Taxas configuradas por número de parcelas</p>
        </div>

        <button onClick={nova} className="btn-primary">+ Nova Taxa</button>
      </div>

      {/* tabela ----------------------------------------------------------- */}
      <table className="rep-table" style={{ marginTop: '1.5rem', minWidth: 420 }}>
        <thead>
          <tr>
            <th style={{ width: 120 }}>Parcelas</th>
            <th style={{ width: 140 }}>Taxa (%)</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {lista.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>
                (nenhuma taxa cadastrada)
              </td>
            </tr>
          )}

          {lista.map(fee => (
            <CardFeeRow key={fee.id} fee={fee} onReload={load} />
          ))}
        </tbody>
      </table>
    </div>
  );
}