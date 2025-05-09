import { useState }   from 'react';
import { supabase }   from '../lib/supa';
import { FiTrash2 }   from 'react-icons/fi';

export default function CardFeeRow({ fee, onReload }) {
  /* --------------------------------------------------- state & helpers */
  const [edit, setEdit]         = useState(false);
  const [valor, setValor]       = useState(String(fee.fee_pct).replace('.', ','));

  const salvar = async () => {
    const novo = Number(valor.replace(',', '.'));
    if (Number.isNaN(novo)) return alert('Valor inválido');

    const { error } = await supabase
      .from('card_fee')
      .update({ fee_pct: novo })
      .eq('id', fee.id);

    error ? alert(error.message) : onReload();
    setEdit(false);
  };

  const deletar = async () => {
    if (!confirm('Excluir esta taxa?')) return;
    const { error } = await supabase.from('card_fee').delete().eq('id', fee.id);
    error ? alert(error.message) : onReload();
  };

  /* ------------------------------------------------------------- view */
  return (
    <tr>
      <td style={{ textAlign: 'center' }}>{fee.installments}</td>

      <td style={{ textAlign: 'center' }}>
        {edit ? (
          <input
            type="text"
            value={valor}
            onChange={e => setValor(e.target.value)}
            style={{
              width: 80, textAlign: 'center',
              border: '1px solid #d0d5dd', borderRadius: 6, padding: '4px 6px',
            }}
          />
        ) : (
          Number(fee.fee_pct).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        )}
      </td>

      <td style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {edit ? (
          <>
            <button className="btn-primary-sm" onClick={salvar}>Salvar</button>
            <button className="btn-secondary-sm" onClick={() => { setEdit(false); setValor(String(fee.fee_pct).replace('.', ',')); }}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-link-sm"
              style={{ color: '#0f62fe' }}
              onClick={() => setEdit(true)}
            >
              Editar
            </button>

            <button
              className="btn-icon-danger"
              onClick={deletar}
              title="Excluir taxa"
            >
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}