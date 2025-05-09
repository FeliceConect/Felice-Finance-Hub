// src/components/ProfRow.jsx  (somente CSS e handler do delete mudaram)
import { FiTrash2 } from 'react-icons/fi';

export default function ProfRow({ item = {}, onToggle, onDelete }) {
  const {
    id, nome, nucleo = '-', conselho_num = '-',
    data_cadastro, is_active = false,
  } = item;

  const dataFmt = data_cadastro
    ? new Date(data_cadastro).toLocaleDateString('pt-BR')
    : '-';

  return (
    <tr>
      <td>{nome}</td>
      <td>{nucleo}</td>
      <td>{conselho_num}</td>
      <td>{dataFmt}</td>

      <td>
        <span className={is_active ? 'badge ativo' : 'badge inativo'}>
          {is_active ? 'Ativo' : 'Inativo'}
        </span>
      </td>

      <td style={{display:'flex',gap:6}}>
        <button
          className={
            'btn btn-xs ' +
            (is_active
              ? 'border-red-500 text-red-600 hover:bg-red-50'
              : 'border-green-500 text-green-600 hover:bg-green-50')
          }
          style={{background:'transparent'}}
          onClick={() => onToggle(id, !is_active)}
        >
          {is_active ? 'Desativar' : 'Ativar'}
        </button>

        <button
          className="btn btn-xs border-red-500 text-red-600 hover:bg-red-50"
          style={{background:'transparent', padding:'6px 8px'}}
          onClick={() => onDelete(id)}
          title="Excluir"
        >
          <FiTrash2 size={16}/>
        </button>
      </td>
    </tr>
  );
}