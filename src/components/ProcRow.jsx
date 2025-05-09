// src/components/ProcRow.jsx
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

export default function ProcRow({ item = {}, onToggle, onEditCost, onDelete }) {
  const {
    id,
    nome           = '',
    nucleo_nome    = '',
    custo_atual    = 0,
    is_active      = false,
    data_cadastro  = '',
  } = item;

  return (
    <tr key={id}>
      <td>{nome}</td>
      <td>{nucleo_nome || '-'}</td>
      <td>R$ {Number(custo_atual).toLocaleString('pt-BR')}</td>
      <td>
        <span className={is_active ? 'badge ativo' : 'badge inativo'}>
          {is_active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td>{data_cadastro}</td>
      <td style={{ display: 'flex', gap: 8 }}>
        {/* Ativar / Desativar */}
        <button
          className={
            'btn-sm ' +
            (is_active
              ? 'border-red-500 text-red-600 hover:bg-red-50'
              : 'border-green-500 text-green-600 hover:bg-green-50')
          }
          style={{ background: 'transparent' }}
          onClick={() => onToggle(id, !is_active)}
        >
          {is_active ? 'Desativar' : 'Ativar'}
        </button>

        {/* Editar custo */}
        <button
          className="btn-icon"
          title="Alterar custo"
          onClick={() => onEditCost(id, custo_atual)}
        >
          <FiEdit2 size={16} />
        </button>

        {/* Deletar */}
        <button
          className="btn-icon text-red-600 hover:bg-red-50"
          title="Excluir"
          onClick={() => onDelete(id)}
        >
          <FiTrash2 size={16} />
        </button>
      </td>
    </tr>
  );
}