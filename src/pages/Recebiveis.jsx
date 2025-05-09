// src/pages/Recebiveis.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supa';

import FilterBar from '../components/FilterBar';
import RecebiveisTable from '../components/RecebiveisTable';

export default function Recebiveis() {
  const [filtros, setFiltros] = useState({
    mes: new Date().toISOString().slice(0, 7),
    nucleo: null,
    forma: null,
    status: null,
  });
  const [dados, setDados] = useState([]);
  const [nucleos, setNucleos] = useState([]);

  /* carregar opções de núcleo uma vez */
  useEffect(() => {
    supabase
      .from('nucleo')
      .select('nome')
      .order('nome')
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setNucleos(data.map((n) => n.nome));
      });
  }, []);

  /* carregar dados sempre que filtros mudam */
  useEffect(() => {
    supabase
      .rpc('list_recebiveis', {
        in_mes: filtros.mes,
        in_nucleo: filtros.nucleo,
        in_forma: filtros.forma,
        in_status: filtros.status,
      })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setDados(data);
      });
  }, [filtros]);

  /* confirmar / estornar ações */
  const atualizarStatus = async (id, novoStatus) => {
    const { error } = await supabase.rpc('update_recebivel', {
      p_parcela_id: id,
      p_novo_status: novoStatus,
    });
    if (error) console.error(error);
    else {
      setDados((atual) =>
        atual.map((r) =>
          r.parcela_id === id ? { ...r, status: novoStatus } : r
        )
      );
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Filtros</h2>
      <FilterBar filtros={filtros} setFiltros={setFiltros} nucleos={nucleos} />

      <h2 style={{ marginTop: '2rem' }}>
        Recebíveis{' '}
        {new Date(filtros.mes + '-01').toLocaleString('default', {
          month: 'long',
        })}
      </h2>
      <p>Lista de recebíveis para o período selecionado</p>

      <RecebiveisTable
        dados={dados}
        onConfirmar={(id) => atualizarStatus(id, 'Recebida')}
        onEstornar={(id) => atualizarStatus(id, 'Estornada')}
      />
    </div>
  );
}