// src/pages/Nucleos.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supa';
import NucleoRow from '../components/NucleoRow';

/**
 * Página: Núcleos
 * - Lista, cria, edita meta e ativa/desativa
 * - Sem exclusão e sem coluna “Meta Líquida”
 */

export default function Nucleos() {
  /* ---------- state ---------- */
  const [lista, setLista] = useState([]);

  /* ---------- helpers ---------- */
  const fetchNucleos = async () => {
    const { data, error } = await supabase
      .from('nucleo')
      .select('id,nome,meta_mensal_bruta,is_active,created_at')
      .order('id');

    if (!error) setLista(data);
  };

  /* ---------- load on mount ---------- */
  useEffect(() => {
    fetchNucleos();
  }, []);

  /* ---------- ações ---------- */
  const novoNucleo = async () => {
    const nome = prompt('Nome do novo Núcleo');
    if (!nome) return;

    const meta = Number(prompt('Meta Mensal (R$)', '0').replace(',', '.'));
    if (Number.isNaN(meta)) return alert('Meta inválida');

    const { error } = await supabase
      .from('nucleo')
      .insert({ nome, meta_mensal_bruta: meta });

    if (error) alert(error.message);
    else fetchNucleos();
  };

  const editarMeta = async (item) => {
    const meta = Number(
      prompt(`Nova Meta Mensal (R$) para ${item.nome}`, item.meta).replace(
        ',',
        '.'
      )
    );
    if (Number.isNaN(meta)) return;

    await supabase
      .from('nucleo')
      .update({ meta_mensal_bruta: meta })
      .eq('id', item.id);

    fetchNucleos();
  };

  const toggleStatus = async (id, novo) => {
    await supabase.from('nucleo').update({ is_active: novo }).eq('id', id);
    fetchNucleos();
  };

  /* ---------- render ---------- */
  return (
    <div style={{ padding: '2rem' }}>
      {/* cabeçalho */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 className="page-title">Núcleos</h1>
          <p className="subtitle">Gerencie os núcleos de serviço</p>
        </div>

        <button onClick={novoNucleo} className="btn-primary">
          + Novo Núcleo
        </button>
      </div>

      {/* tabela */}
      <h3 style={{ margin: '24px 0 12px' }}>Lista de Núcleos</h3>

      <table className="rep-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Meta Mensal (R$)</th>
            <th>Status</th>
            <th>Data de Criação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {lista
            .filter(Boolean) // remove possíveis entradas vazias
            .map((n) => (
              <NucleoRow
                key={n.id}
                item={{
                  id: n.id,
                  nome: n.nome,
                  meta: n.meta_mensal_bruta,
                  ativo: n.is_active,
                  criado: n.created_at,
                }}
                onEdit={editarMeta}
                onToggle={toggleStatus}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}