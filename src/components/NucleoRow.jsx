// src/components/NucleoRow.jsx
import { FiEdit2 } from 'react-icons/fi';

/* componente PRESENTATIONAL – sem effects, sem fetch! */
export default function NucleoRow({ item, onEdit, onToggle }) {
  if (!item) return null;               // segurança extra

  const { id, nome, meta, ativo, criado } = item;

  return (
    <tr>
      <td>{id}</td>
      <td>{nome}</td>
      <td>R$ {Number(meta).toLocaleString('pt-BR')}</td>
      <td>
        <span className={ativo ? 'badge ativo' : 'badge inativo'}>
          {ativo ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td>{new Date(criado).toLocaleDateString('pt-BR')}</td>
      <td>
        <button className="btn btn-edit" onClick={() => onEdit(item)}>
          <FiEdit2 style={{ marginRight: 4 }} />
          Editar
        </button>

        <button
          className={`btn btn-toggle ${ativo ? '' : 'inativo'}`}
          onClick={() => onToggle(id, !ativo)}
        >
          {ativo ? 'Desativar' : 'Ativar'}
        </button>
      </td>
    </tr>
  );
}