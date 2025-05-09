// src/pages/Profissionais.jsx
import { useEffect, useState } from 'react';
import { supabase }             from '../lib/supa';
import ProfRow                  from '../components/ProfRow';

export default function Profissionais() {
  /* ---------- state ---------- */
  const [lista,   setLista] = useState([]);
  const [nucleos, setNucs]  = useState([]);

  /* ---------- loaders ---------- */
  const loadProfissionais = async () => {
    const { data, error } = await supabase
      .from('v_profissional')         // view já inclui núcleo e data
      .select('*')
      .order('nome');
    if (!error) setLista(data);
  };

  const loadNucs = async () => {
    const { data } = await supabase
      .from('nucleo')
      .select('id,nome')
      .eq('is_active', true)
      .order('nome');
    setNucs(data);
  };

  useEffect(() => { loadProfissionais(); loadNucs(); }, []);

  /* ---------- ações ---------- */
  const novo = async () => {
    const nome = prompt('Nome do profissional'); if (!nome) return;
    const cons = prompt('Nº do conselho');       if (!cons) return;

    const nucleo_id = Number(
      prompt(
        'ID do Núcleo:\n' +
        nucleos.map(n => `${n.id} – ${n.nome}`).join('\n')
      )
    );
    if (!nucleo_id) return;

    const { error } = await supabase
      .from('professional')
      .insert({ nome, conselho_num: cons, nucleo_id });

    error ? alert(error.message) : loadProfissionais();
  };

  const toggleStatus = async (id, st) => {
    await supabase.from('professional').update({ is_active: st }).eq('id', id);
    loadProfissionais();
  };

  /* ---------- exclusão com fallback p/ soft-delete ---------- */
  const excluir = async (id) => {
    /* 1. verifica referências em procedure_record -------------------- */
    const pr = await supabase
      .from('procedure_record')
      .select('id', { head:true, count:'exact' })
      .eq('professional_id', id);

    /* 2. verifica referências em repasse_rule ------------------------ */
    const rr = await supabase
      .from('repasse_rule')
      .select('id', { head:true, count:'exact' })
      .eq('professional_id', id);

    if (pr.error || rr.error) {
      return alert(pr.error?.message || rr.error?.message);
    }

    const totalRefs = (pr.count||0) + (rr.count||0);

    if (totalRefs > 0) {
      /* ——— há registros vinculados → soft-delete ——— */
      const msg =
        `Há ${totalRefs} registro(s) vinculado(s) a este profissional.\n` +
        'Ele será apenas DESATIVADO para preservar o histórico.\n' +
        'Continuar?';
      if (!confirm(msg)) return;

      await supabase.from('professional')
        .update({ is_active:false })
        .eq('id', id);

    } else {
      /* ——— sem vínculo → exclusão definitiva ——— */
      if (!confirm('Excluir definitivamente este profissional?')) return;

      const { error } = await supabase
        .from('professional')
        .delete()
        .eq('id', id);

      if (error) return alert(error.message);
    }

    loadProfissionais();
  };

  /* ---------- render ---------- */
  return (
    <div style={{padding:'2rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 className="page-title">Profissionais</h1>
          <p className="subtitle">Gerencie os profissionais da clínica</p>
        </div>
        <button onClick={novo} className="btn-primary">+ Novo Profissional</button>
      </div>

      <h3 style={{margin:'24px 0 12px'}}>Lista de Profissionais</h3>

      <table className="rep-table" style={{minWidth:830}}>
        <thead>
          <tr>
            <th>Nome</th><th>Núcleo</th><th>Conselho</th>
            <th>Data de Cadastro</th><th>Status</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(p => (
            <ProfRow key={p.id}
                     item={p}
                     onToggle={toggleStatus}
                     onDelete={excluir} />
          ))}
        </tbody>
      </table>
    </div>
  );
}