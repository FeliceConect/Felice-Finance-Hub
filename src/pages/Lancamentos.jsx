// src/pages/Lancamentos.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supa'

export default function Lancamentos() {
  // listas
  const [nucleos, setNucleos]             = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [procedimentos, setProcedimentos] = useState([])
  const [parcelas, setParcelas]           = useState([])

  // formulário
  const [form, setForm] = useState({
    nucleo: null,
    profissional: null,
    procedimento: null,
    quantidade: 1,
    valorUnitario: '',
    data: '',
    pagamento: 'Cartão',
    parcela: null
  })

  // carrega núcleos + taxas de cartão
  useEffect(() => {
    supabase
      .from('nucleo')
      .select('id,nome')
      .eq('is_active', true)
      .order('nome')
      .then(({ data }) => setNucleos(data || []))

    supabase
      .from('card_fee')
      .select('installments,fee_pct')
      .order('installments')
      .then(({ data }) => setParcelas(data || []))
  }, [])

  // quando muda núcleo, recarrega profissionais e procedimentos
  useEffect(() => {
    if (!form.nucleo) {
      setProfissionais([])
      setProcedimentos([])
      setForm(f => ({ ...f, profissional: null, procedimento: null }))
      return
    }

    supabase
      .from('professional')
      .select('id,nome')
      .eq('nucleo_id', form.nucleo)
      .eq('is_active', true)
      .order('nome')
      .then(({ data }) => setProfissionais(data || []))

    supabase
      .from('procedure_type')
      .select('id,descricao')
      .eq('nucleo_id', form.nucleo)
      .eq('status', 'Ativo')
      .order('descricao')
      .then(({ data }) => setProcedimentos(data || []))
  }, [form.nucleo])

  // cálculos
  const bruto = form.quantidade * (parseFloat(form.valorUnitario.replace(',', '.')) || 0)
  const taxaPct =
    form.pagamento === 'Cartão' && form.parcela
      ? (parcelas.find(p => p.installments === +form.parcela)?.fee_pct || 0)
      : 0
  const taxaCartao = (bruto * taxaPct) / 100

  // custo direto simplificado (se tiver view, pode buscar aqui)
  const custoDireto = 0
  const liquido = bruto - taxaCartao - custoDireto

  // manipula mudança de campo
  const handle = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // salva lançamento
  const salvar = async () => {
    const payload = {
      nucleo_id:         form.nucleo,
      professional_id:   form.profissional,
      procedure_type_id: form.procedimento,
      quantidade:        form.quantidade,
      valor_unitario:    parseFloat(form.valorUnitario.replace(',', '.')),
      data_realizacao:   form.data,
      pagamento:         form.pagamento,
      parcelas:          form.pagamento === 'Cartão' ? form.parcela : null
    }
    const { error } = await supabase.from('procedure_record').insert(payload)
    if (error) alert('Erro ao salvar lançamento: ' + error.message)
    else {
      alert('Lançamento salvo com sucesso!')
      setForm({
        nucleo: null,
        profissional: null,
        procedimento: null,
        quantidade: 1,
        valorUnitario: '',
        data: '',
        pagamento: 'Cartão',
        parcela: null
      })
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lançamento de Procedimento</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: '2rem',
        marginTop: '1.5rem'
      }}>
        {/* DADOS DO PROCEDIMENTO */}
        <div style={{
          padding: '1.5rem',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3>Dados do Procedimento</h3>
          <label>Núcleo</label>
          <select
            name="nucleo"
            value={form.nucleo||''}
            onChange={handle}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option value="">Selecione um núcleo</option>
            {nucleos.map(n => (
              <option key={n.id} value={n.id}>{n.nome}</option>
            ))}
          </select>

          <label style={{ marginTop: '1rem' }}>Profissional</label>
          <select
            name="profissional"
            value={form.profissional||''}
            onChange={handle}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option value="">Selecione um profissional</option>
            {profissionais.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          <label style={{ marginTop: '1rem' }}>Procedimento</label>
          <select
            name="procedimento"
            value={form.procedimento||''}
            onChange={handle}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option value="">Selecione um procedimento</option>
            {procedimentos.map(p => (
              <option key={p.id} value={p.id}>{p.descricao}</option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Quantidade</label>
              <input
                type="number" name="quantidade" value={form.quantidade}
                onChange={handle} style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Valor Unitário (R$)</label>
              <input
                type="text" name="valorUnitario" value={form.valorUnitario}
                onChange={handle} placeholder="0,00"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
          </div>

          <label style={{ marginTop: '1rem' }}>Data de Realização</label>
          <input
            type="date" name="data" value={form.data} onChange={handle}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        {/* PAGAMENTO + BOTÃO SALVAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            padding: '1.5rem',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3>Pagamento</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {['Cartão','Pix','Dinheiro'].map(m => (
                <button
                  key={m}
                  onClick={() => setForm(f => ({ ...f, pagamento: m, parcela: null }))}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: form.pagamento === m ? '#3b82f6' : '#e5e7eb',
                    color:    form.pagamento === m ? '#fff'   : '#374151',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            {form.pagamento === 'Cartão' && (
              <>
                <label>Parcelas</label>
                <select
                  name="parcela" value={form.parcela||''} onChange={handle}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="">Selecione</option>
                  {parcelas.map(p => (
                    <option key={p.installments} value={p.installments}>
                      {p.installments}×
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* BOTÃO SALVAR próximo ao card de pagamento */}
          <button
            onClick={salvar}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          >
            Salvar Lançamento
          </button>
        </div>
      </div>
    </div>
  )
}
