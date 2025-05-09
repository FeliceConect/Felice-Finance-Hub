// src/pages/Costs.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supa';

const currency = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Costs() {
  const [rows, setRows] = useState([]);
  const [nucleos, setNucleos] = useState([]);
  const [msg, setMsg] = useState('');

  /* carregar linhas e núcleos */
  const fetchRows = async () => {
    const { data, error } = await supabase.from('custos_view').select('*');
    if (error) setMsg('Erro: ' + error.message);
    else setRows(data);
  };
  useEffect(() => {
    fetchRows();
    supabase
      .from('nucleo')
      .select('id,nome')
      .order('nome')
      .then(({ data }) => setNucleos(data || []));
  }, []);

  /* ─────────── ações ─────────── */

  /* criar procedimento */
  async function novoProcedimento() {
    const nome = prompt('Nome do novo procedimento:');
    if (!nome) return;

    /* escolher núcleo (obrigatório) */
    const lista = nucleos.map((n) => `${n.id}: ${n.nome}`).join('\n');
    const nucleoIdStr = prompt(
      `Informe o ID do núcleo (obrigatório):\n${lista}`
    );
    const nucleoId = Number(nucleoIdStr);
    if (!nucleoId || !nucleos.find((n) => n.id === nucleoId)) {
      alert('Núcleo inválido ou não informado. Operação cancelada.');
      return;
    }

    const custo = prompt('Custo inicial (R$):', '0');
    if (custo === null) return;

    const { data: proc, error: err1 } = await supabase
      .from('procedure_type')
      .insert({
        descricao: nome,
        nucleo_id: nucleoId,
        status: 'Ativo',
      })
      .select('id')
      .single();
    if (err1) {
      alert(err1.message);
      return;
    }

    const { error: err2 } = await supabase.from('procedure_cost').insert({
      procedure_type_id: proc.id,
      vigencia_inicio: new Date().toISOString().slice(0, 10),
      custo_unitario: Number(custo),
    });
    if (err2) alert(err2.message);
    fetchRows();
  }

  /* editar custo */
  async function editarCusto(id) {
    const novo = prompt('Novo custo unitário (R$):');
    if (!novo) return;
    await supabase.from('procedure_cost').insert({
      procedure_type_id: id,
      vigencia_inicio: new Date().toISOString().slice(0, 10),
      custo_unitario: Number(novo),
    });
    fetchRows();
  }

  /* ativar / desativar */
  async function toggleStatus(id, para) {
    await supabase.from('procedure_type').update({ status: para }).eq('id', id);
    fetchRows();
  }

  /* ─────────── UI ─────────── */
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Procedimentos</h2>
      <button onClick={novoProcedimento} style={{ marginBottom: 12 }}>
        ➕ Novo Procedimento
      </button>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <tr>
            <th>Nome</th>
            <th>Núcleo</th>
            <th>Custo Atual</th>
            <th>Status</th>
            <th>Data de Cadastro</th>
            <th colSpan={2}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.procedure_type_id}>
              <td>{r.procedimento}</td>
              <td>{r.nucleo || '—'}</td>
              <td>{r.custo_unitario ? currency(r.custo_unitario) : '—'}</td>
              <td>{r.status}</td>
              <td>
                {r.created_at
                  ? new Date(r.created_at).toLocaleDateString('pt-BR')
                  : '—'}
              </td>
              <td>
                <button onClick={() => editarCusto(r.procedure_type_id)}>
                  Editar custo
                </button>
              </td>
              <td>
                {r.status === 'Ativo' ? (
                  <button
                    onClick={() =>
                      toggleStatus(r.procedure_type_id, 'Inativo')
                    }
                  >
                    Desativar
                  </button>
                ) : (
                  <button
                    onClick={() => toggleStatus(r.procedure_type_id, 'Ativo')
                    }
                  >
                    Ativar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}