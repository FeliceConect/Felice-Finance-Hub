// src/pages/Relatorios.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supa';
import * as XLSX from 'xlsx';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

/* nomes dos meses */
const MONTHS_PT = ['janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro'];

/* definição de relatórios */
const REPORTS = {
  rel_prod_nucleo_meta: {
    label: 'Produção por Núcleo',
    filters: ['mes','nucleo'],
    chart: true,
    sumCols: ['receita_profissional','receita_complexo'],
    mapHead: {
      mes:'Mês', nucleo:'Núcleo',
      receita_profissional:'Receita Profissional',
      receita_complexo:'Receita Complexo',
      meta_mensal_bruta:'Meta Mensal',
      pct_meta:'% Meta'
    }
  },
  rel_prod_procedimento: {
    label: 'Produção por Procedimento',
    filters: ['mes','procedimento'],
    chart: true,
    sumCols: ['receita_bruta','receita_liquida','custo_total','quantidade'],
    mapHead: {
      mes:'Mês', procedimento:'Procedimento', quantidade:'Qtd',
      receita_bruta:'Receita Bruta', receita_liquida:'Receita Líquida',
      custo_total:'Custo Total'
    }
  },
  rel_repasses_mes: {
    label: 'Repasses a Profissionais',
    filters: ['mes','profissional'],
    sumCols: ['valor_repassar'],
    mapHead: {
      mes:'Mês', profissional:'Profissional',
      valor_repassar:'Valor a Repassar', repassado:'Repassado?'
    }
  },
  rel_top_rentabilidade: {
    label: 'Top Rentabilidade',
    filters: ['mes'],
    topN: true,
    sumCols: ['margem_total'],
    mapHead: { mes:'Mês', procedimento:'Procedimento',
      margem_total:'Margem Total' }
  }
};

/* helpers */
const prettyMonth = iso => {
  const [y,m]=iso.split('-');
  return MONTHS_PT[Number(m)-1]+' '+y;
};
const fmtNum = v => typeof v==='number'
  ? v.toLocaleString('pt-BR',{minimumFractionDigits:2})
  : v;

export default function Relatorios(){
  const [repKey,setRepKey]=useState('rel_prod_nucleo_meta');
  const rpt=REPORTS[repKey];

  const [rows,setRows]=useState([]);
  const [meses,setMeses]=useState([]);
  const [extras,setExtras]=useState([]);

  const [mesFiltro,setMesFiltro]=useState('Todos');
  const [extraFiltro,setExtraFiltro]=useState('Todos');
  const [topN,setTopN]=useState('Todos');

  const [page,setPage]=useState(0);
  const PAGE_SIZE=25;

  const [msg,setMsg]=useState('');

  /* carregar dados */
  useEffect(()=>{ load(); },[repKey]);

  async function load(){
    const {data,error}=await supabase.from(repKey).select('*');
    if(error){ setMsg(error.message); return;}
    setRows(data);

    const ms=[...new Set(data.map(r=>r.mes.slice(0,7)))].sort().reverse();
    setMeses(ms);

    if(rpt.filters[1]){
      const f=rpt.filters[1];
      setExtras([...new Set(data.map(r=>r[f])).filter(Boolean)].sort());
    }
    setMesFiltro('Todos'); setExtraFiltro('Todos');
    setTopN('Todos'); setPage(0); setMsg('');
  }

  /* aplica filtros */
  const filtRows=rows.filter(r=>{
    let ok=true;
    if(mesFiltro!=='Todos') ok=ok && r.mes.startsWith(mesFiltro.slice(0,7));
    if(ok && extraFiltro!=='Todos'){
      const field=rpt.filters[1];
      ok = ok && r[field]===extraFiltro;
    }
    return ok;
  });

  /* Top‑N */
  const rowsTop = rpt.topN && topN!=='Todos'
    ? [...filtRows].sort((a,b)=>b.margem_total-a.margem_total).slice(0,Number(topN))
    : filtRows;

  /* paginação */
  const totalPages=Math.ceil(rowsTop.length/PAGE_SIZE)||1;
  const pageRows=rowsTop.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);

  /* totais rodapé */
  const totals = {};
  rpt.sumCols?.forEach(c=>{
    totals[c]=rowsTop.reduce((s,r)=>s+Number(r[c]||0),0);
  });

  /* exportar Excel */
  function exportExcel(){
    if(!rowsTop.length) return;
    const ws=XLSX.utils.json_to_sheet(rowsTop);
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Relatório');
    XLSX.writeFile(wb,`${rpt.label}.xlsx`);
  }

  const cols = pageRows[0]?Object.keys(pageRows[0]):[];

  return(
    <div style={{padding:'2rem'}}>
      <h2>Relatórios</h2>

      {/* Seletores */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <select value={repKey} onChange={e=>setRepKey(e.target.value)}>
          {Object.entries(REPORTS).map(([k,v])=> <option key={k} value={k}>{v.label}</option>)}
        </select>

        {rpt.filters.includes('mes') &&
          <select value={mesFiltro} onChange={e=>setMesFiltro(e.target.value)}>
            <option>Todos</option>
            {meses.map(mIso=>{
              const iso=mIso+'-01';
              return <option key={mIso} value={iso}>{prettyMonth(mIso)}</option>;
            })}
          </select>}

        {rpt.filters.length>1 &&
          <select value={extraFiltro} onChange={e=>setExtraFiltro(e.target.value)}>
            <option>Todos</option>
            {extras.map(v=><option key={v}>{v}</option>)}
          </select>}

        {rpt.topN &&
          <select value={topN} onChange={e=>setTopN(e.target.value)}>
            <option>Todos</option><option>5</option><option>10</option><option>20</option>
          </select>}

        <button onClick={exportExcel}>⭳ Excel</button>
      </div>

      {msg && <p style={{color:'red'}}>{msg}</p>}

      {/* mini‑gráfico */}
      {rpt.chart && rowsTop.length>0 && (
        <div style={{height:200,marginTop:20}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rowsTop}>
              <CartesianGrid vertical={false} strokeDasharray="3 3"/>
              <XAxis dataKey={rpt.filters[1] || 'procedimento'} hide />
              <YAxis hide />
              <Tooltip formatter={v=>v.toLocaleString('pt-BR')}/>
              <Bar dataKey={rpt.sumCols[0]} fill="#4f8ef7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* tabela */}
      {pageRows.length>0 && (
        <table border="1" cellPadding="6" style={{borderCollapse:'collapse',marginTop:12,width:'100%'}}>
          <thead>
            <tr>{cols.map(h=><th key={h}>{rpt.mapHead[h]||h.replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase())}</th>)}</tr>
          </thead>
          <tbody>
            {pageRows.map((r,i)=>(
              <tr key={i}>
                {cols.map(c=>{
                  let v=r[c];
                  if(c==='mes') v=prettyMonth(v.slice(0,7));
                  if(typeof v==='number') v=v.toLocaleString('pt-BR',{minimumFractionDigits:2});
                  if(typeof v==='boolean') v=v?'Sim':'Não';
                  return <td key={c}>{v}</td>;
                })}
              </tr>
            ))}
            {/* rodapé totais */}
            {rpt.sumCols && (
              <tr style={{fontWeight:600,background:'#f6f6f6'}}>
                {cols.map(c=>{
                  if(rpt.sumCols.includes(c))
                    return <td key={c}>{totals[c].toLocaleString('pt-BR',{minimumFractionDigits:2})}</td>;
                  return <td key={c}></td>;
                })}
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* paginação */}
      {totalPages>1 && (
        <div style={{marginTop:8}}>
          <button disabled={page===0} onClick={()=>setPage(p=>p-1)}>« Anterior</button>
          <span style={{margin:'0 8px'}}> {page+1} / {totalPages} </span>
          <button disabled={page===totalPages-1} onClick={()=>setPage(p=>p+1)}>Próxima »</button>
        </div>
      )}
    </div>
  );
}