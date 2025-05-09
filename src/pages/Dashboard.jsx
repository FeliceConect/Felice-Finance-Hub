import { useEffect, useState } from "react";
import { supabase }            from "../lib/supa";

import MonthSelector   from "../components/MonthSelector";
import KpiCard         from "../components/KpiCard";
import NucleoPerfRow   from "../components/NucleoPerfRow";
import MetaMensalChart from "../components/MetaMensalChart";
import MetaVsChart     from "../components/MetaVsChart";

export default function Dashboard() {
  const [mes,   setMes]  = useState(() =>
    new Date().toISOString().slice(0, 7)
  );
  const [dados, setDados] = useState(null);
  const [prev,  setPrev ] = useState(null);

  const mesAnterior = (m) => {
    const d = new Date(`${m}-01`);
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 7);
  };
  const pctDiff = (a, b) => (b && b !== 0 ? ((a - b) / b) * 100 : 0);
  const fmtR$   = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR")}`;

  useEffect(() => {
    const load = async (m) =>
      (await supabase.rpc("dashboard_mes", { in_mes: `${m}-01` })).data;

    (async () => {
      setDados(await load(mes));
      setPrev(await load(mesAnterior(mes)));
    })();
  }, [mes]);

  if (!dados || !prev) return <p style={{ padding: "2rem" }}>Carregando…</p>;

  const k  = dados.kpi[0] || {};
  const pk = prev.kpi [0] || {};

  const total = dados.nuc.reduce((s, n) => s + n.receita, 0) || 1;
  const nExt  = dados.nuc.map((n) => {
    const pv = prev.nuc.find((x) => x.nome === n.nome) || {};
    return {
      ...n,
      share:    (n.receita / total) * 100,
      variacao: pctDiff(n.receita, pv.receita || 0),
    };
  });

  const pct = dados.meta.map((m) => ({
    nome: m.nome,
    pct:  m.meta_bruta
          ? Math.round((m.realizado_bruta / m.meta_bruta) * 100)
          : 0,
  }));

  return (
    <div style={{ padding: "2rem" }}>
      {/* cabeçalho */}
      <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center" }}>
        <h2>Dashboard</h2>
        <MonthSelector value={mes} onChange={setMes} />
      </div>

      {/* KPIs */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem",
                    marginTop:"1rem" }}>
        <KpiCard label="Receita Bruta"   value={fmtR$(k.receita_bruta)}
                 subtitle={`Total ${mes}`}
                 deltaPct={pctDiff(k.receita_bruta, pk.receita_bruta)} />
        <KpiCard label="Receita Líquida" value={fmtR$(k.receita_liquida)}
                 subtitle="Após taxas"
                 deltaPct={pctDiff(k.receita_liquida, pk.receita_liquida)} />
        <KpiCard label="Total Repasses"  value={fmtR$(k.total_repasses)}
                 subtitle="A profissionais"
                 deltaPct={pctDiff(k.total_repasses, pk.total_repasses)} />
        <KpiCard label="Lucro Complexo"  value={fmtR$(k.lucro_complexo)}
                 deltaPct={pctDiff(k.lucro_complexo, pk.lucro_complexo)} />
      </div>

      {/* Tabela + gráfico */}
      <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap",
                    alignItems:"flex-start", marginTop:"2rem" }}>
        {/* tabela */}
        <div style={{ flex:"1 1 380px", minWidth:360, overflowX:"auto" }}>
          <h3>Desempenho por Núcleo</h3>
          <table className="rep-table nucleo-table" style={{ minWidth:540 }}>
            <thead>
              <tr>
                <th>Núcleo</th>
                <th>Receita</th>
                <th>Margem</th>
                <th>Share</th>
                <th>Var. M/M-1</th>
              </tr>
            </thead>
            <tbody>
              {nExt.map((n) => (
                <NucleoPerfRow key={n.nome} row={n} />
              ))}
            </tbody>
          </table>
        </div>

        {/* gráfico % meta */}
        <div style={{ flex:"1 1 380px", minWidth:300 }}>
          <h3>Meta Mensal (%)</h3>
          <MetaMensalChart data={pct} />
        </div>
      </div>

      {/* gráfico meta vs realizado */}
      <div style={{ marginTop:"3rem" }}>
        <h3>Meta vs Realizado (R$)</h3>
        <MetaVsChart data={dados.meta} />
      </div>
    </div>
  );
}