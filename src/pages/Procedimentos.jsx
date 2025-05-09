// src/pages/Procedimentos.jsx
import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2 }   from 'react-icons/fi';
import { supabase }            from '../lib/supa';

export default function Procedimentos() {
  const [rows, setRows] = useState([]);
  const [nucs, setNucs] = useState([]);

  /* ---------- Carrega procedimentos e núcleos ---------- */
  const loadProcedures = async () => {
    const { data, error } = await supabase
      .from('custos_view')
      .select('*')
      .order('descricao', { ascending: true });
    if (error) console.error(error);
    else setRows(data);
  };

  const loadNuclei = async () => {
    const { data, error } = await supabase
      .from('nucleo')
      .select('id,nome')
      .eq('is_active', true)
      .order('nome', { ascending: true });
    if (error) console.error(error);
    else setNucs(data);
  };

  useEffect(() => {
    loadProcedures();
    loadNuclei();
  }, []);

  /* ---------- formata moeda ---------- */
  const fmtR$ = (v) =>
    v == null
      ? '—'
      : `R$ ${Number(v).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
        })}`;

  /* ---------- Ações ---------- */
  const toggleProcedure = async (id, status) => {
    const novoStatus = status === 'Ativo' ? 'Inativo' : 'Ativo';
    const { error } = await supabase
      .from('procedure_type')
      .update({ status: novoStatus })
      .eq('id', id);
    if (error) console.error(error);
    await loadProcedures();
  };

  const editCost = async (id, current) => {
    const entrada = prompt('Digite o novo custo (R$):', current || '');
    if (entrada === null) return;
    const valor = Number(entrada.replace(',', '.'));
    if (isNaN(valor)) {
      alert('Valor inválido');
      return;
    }
    const { error } = await supabase.from('procedure_cost').insert({
      procedure_type_id: id,
      vigencia_inicio: new Date().toISOString(),
      custo_unitario: valor,
    });
    if (error) console.error(error);
    await loadProcedures();
  };

  const deleteProcedure = async (id, status) => {
    // tenta deletar; se falhar com FK, apenas desativa
    const { error } = await supabase
      .from('procedure_type')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('FK detectada, alternando apenas o status:', error.message);
      // alterna para inativo
      if (status === 'Ativo') {
        await supabase
          .from('procedure_type')
          .update({ status: 'Inativo' })
          .eq('id', id);
      }
    }
    await loadProcedures();
  };

  const addProcedure = async () => {
    const descricao = prompt('Descrição do procedimento');
    if (!descricao) return;

    const escolha = prompt(
      'ID do núcleo:\n' + nucs.map((n) => `${n.id} – ${n.nome}`).join('\n')
    );
    const nucleo_id = Number(escolha);
    if (!nucleo_id) return;

    const custoStr = prompt('Custo unitário (R$)');
    if (!custoStr) return;
    const custo = Number(custoStr.replace(',', '.'));
    if (isNaN(custo)) {
      alert('Custo inválido');
      return;
    }

    // insere tipo
    const { data: tipo, error: e1 } = await supabase
      .from('procedure_type')
      .insert({
        descricao,
        nucleo_id,
        status: 'Ativo',
      })
      .select('id')
      .single();

    if (e1 || !tipo) {
      alert('Não foi possível criar o procedimento.');
      console.error(e1);
      return;
    }

    // insere custo inicial
    const { error: e2 } = await supabase.from('procedure_cost').insert({
      procedure_type_id: tipo.id,
      vigencia_inicio: new Date().toISOString(),
      custo_unitario: custo,
    });
    if (e2) {
      alert('Procedimento criado, mas falha ao salvar o custo.');
      console.error(e2);
    }

    await loadProcedures();
  };

  /* ---------- Render ---------- */
  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 className="page-title">Procedimentos</h1>
          <p className="subtitle">Gerencie os procedimentos disponíveis</p>
        </div>
        <button onClick={addProcedure} className="btn-primary">
          + Novo Procedimento
        </button>
      </div>

      {/* Tabela */}
      <h3 style={{ margin: '24px 0 12px' }}>Lista de Procedimentos</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="rep-table" style={{ minWidth: 860 }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Núcleo</th>
              <th>Custo Atual (R$)</th>
              <th>Status</th>
              <th>Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: 'center', padding: '1rem' }}
                >
                  (nenhum procedimento cadastrado)
                </td>
              </tr>
            )}

            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.descricao}</td>
                <td>{r.nucleo || '—'}</td>
                <td>{fmtR$(r.custo)}</td>
                <td>
                  <span
                    className={
                      r.status === 'Ativo' ? 'badge ativo' : 'badge inativo'
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString('pt-BR')
                    : '—'}
                </td>
                <td style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
                  <button
                    className="btn-ghost"
                    title="Editar custo"
                    onClick={() => editCost(r.id, r.custo)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className={
                      'btn-ghost ' +
                      (r.status === 'Ativo'
                        ? 'text-red-600 hover:text-red-700'
                        : 'text-green-600 hover:text-green-700')
                    }
                    onClick={() => toggleProcedure(r.id, r.status)}
                  >
                    {r.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    className="btn-ghost text-red-600 hover:text-red-700"
                    title="Excluir"
                    onClick={() => deleteProcedure(r.id, r.status)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}