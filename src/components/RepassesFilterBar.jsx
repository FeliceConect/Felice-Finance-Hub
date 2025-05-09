export default function RepassesFilterBar({ filtros, setFiltros, nucleos }) {
  const handle = (k)=>(e)=> setFiltros({ ...filtros, [k]: e.target.value || null });

  return (
    <div className="filtros-wrap">
      <div>
        <label>Núcleo</label>
        <select value={filtros.nucleo||''} onChange={handle('nucleo')}>
          <option value=''>Todos</option>
          {nucleos.map(n=><option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label>Ano</label>
        <input type="number" value={filtros.ano}
               onChange={handle('ano')}/>
      </div>
    </div>
  );
}