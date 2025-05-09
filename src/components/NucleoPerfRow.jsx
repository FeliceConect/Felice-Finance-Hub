// src/components/NucleoPerfRow.jsx
export default function NucleoPerfRow({ row }) {
    if (!row) return null;
  
    const { nome, receita, margem, share, variacao } = row;
  
    const pct = (v) =>
      v === null || v === undefined ? '-' : `${v.toFixed(1)}%`;
  
    const variacaoStyle = {
      color: variacao >= 0 ? '#059669' : '#b91c1c',
      fontWeight: 500,
    };
  
    return (
      <tr>
        <td>{nome}</td>
        <td>R$ {Number(receita).toLocaleString('pt-BR')}</td>
        <td>{pct(margem)}</td>          {/* ← voltou */}
        <td>{pct(share)}</td>           {/* ← voltou */}
        <td style={variacaoStyle}>{pct(variacao)}</td>
      </tr>
    );
  }