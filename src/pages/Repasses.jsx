// src/pages/Repasses.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supa';
import { utils, writeFile } from 'xlsx';

import RepassesFilterBar from '../components/RepassesFilterBar';
import RepassesTable from '../components/RepassesTable';

export default function Repasses() {
  const anoAtual = new Date().getFullYear();

  const [filtros, setFiltros] = useState({ ano: anoAtual, nucleo: null });
  const [dados, setDados] = useState([]);
  const [nucleos, setNucleos] = useState([]);

  /* carregar núcleos uma vez */
  useEffect(() => {
    supabase
      .from('nucleo')
      .select('nome')
      .order('nome')
      .then(({ data }) => setNucleos(data.map((n) => n.nome)));
  }, []);

  /* carregar dados sempre que filtros mudam */
  useEffect(() => {
    supabase
      .rpc('repasse_ano', {
        in_ano: Number(filtros.ano),
        in_nucleo: filtros.nucleo,
      })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setDados(data);
      });
  }, [filtros]);

  /* ---------- EXPORTAR EXCEL ---------- */
  const exportarExcel = () => {
    const meses = [
      'Jan','Fev','Mar','Abr','Mai','Jun',
      'Jul','Ago','Set','Out','Nov','Dez',
    ];
    const keys = [
      'jan','fev','mar','abr','mai','jun',
      'jul','ago','setr','outu','nov','dez',
    ];

    /* header */
    const aoa = [
      ['Profissional', 'Núcleo', ...meses, 'Total'],
    ];

    /* linhas de profissionais */
    dados.forEach((r) => {
      const linha = [
        r.profissional,
        r.nucleo,
        ...keys.map((k) => Number(r[k] || 0)),
      ];
      linha.push(linha.slice(2).reduce((s, v) => s + v, 0)); // total linha
      aoa.push(linha);
    });

    /* linha total geral */
    const totaisMes = keys.map((k) =>
      dados.reduce((s, r) => s + Number(r[k] || 0), 0)
    );
    aoa.push([
      'Total Geral',
      '',
      ...totaisMes,
      totaisMes.reduce((s, v) => s + v, 0),
    ]);

    /* gerar e baixar */
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet(aoa);
    utils.book_append_sheet(wb, ws, 'Repasses');
    writeFile(wb, `repasses_${filtros.ano}.xlsx`);
  };

  /* ---------- RENDER ---------- */
  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="page-title">Filtros</h2>
      <RepassesFilterBar
        filtros={filtros}
        setFiltros={setFiltros}
        nucleos={nucleos}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="page-title">
          Repasses por Profissional – {filtros.ano}
        </h2>
        <button onClick={exportarExcel} style={{ padding: '8px 14px' }}>
          Exportar Excel
        </button>
      </div>
      <p className="subtitle">
        Valores de repasse mensais para cada profissional
      </p>

      <RepassesTable dados={dados} />
    </div>
  );
}