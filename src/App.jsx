// src/App.jsx
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import Dashboard     from './pages/Dashboard.jsx';
import Lancamentos   from './pages/Lancamentos.jsx';
import Recebiveis    from './pages/Recebiveis.jsx';
import Repasses      from './pages/Repasses.jsx';
import Costs         from './pages/Costs.jsx';          // ← aqui
import Relatorios    from './pages/Relatorios.jsx';
import Nucleos       from './pages/Nucleos.jsx';
import Profissionais from './pages/Profissionais.jsx';
import Procedimentos from './pages/Procedimentos.jsx';
import TaxasCartao   from './pages/TaxasCartao.jsx';

import './App.css';

function Sidebar() {
  const loc = useLocation();
  const NavLink = ({ to, icon, children }) => (
    <li className={loc.pathname === to ? 'active' : ''}>
      <Link to={to}>
        <span>{icon}</span>
        {children}
      </Link>
    </li>
  );

  return (
    <aside className="sidebar">
      <div className="logo">Felice Finance Hub</div>

      <div className="nav-section">
        <div className="nav-group">Principal</div>
        <ul>
          <NavLink to="/"         icon="📊">Dashboard</NavLink>
          <NavLink to="/lancamentos" icon="📝">Lançamentos</NavLink>
          <NavLink to="/recebiveis"  icon="📬">Recebíveis</NavLink>
          <NavLink to="/repasses"    icon="💳">Repasses</NavLink>
          <NavLink to="/costs"       icon="💰">Custos</NavLink>
          <NavLink to="/relatorios"  icon="📈">Relatórios</NavLink>
        </ul>
      </div>

      <div className="nav-section">
        <div className="nav-group">Cadastros</div>
        <ul>
          <NavLink to="/nucleos"       icon="🗂️">Núcleos</NavLink>
          <NavLink to="/profissionais" icon="👩‍⚕️">Profissionais</NavLink>
          <NavLink to="/procedimentos" icon="📋">Procedimentos</NavLink>
        </ul>
      </div>

      <div className="nav-section">
        <div className="nav-group">Configurações</div>
        <ul>
          <NavLink to="/taxas-cartao" icon="⚙️">Taxas de Cartão</NavLink>
        </ul>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/lancamentos" element={<Lancamentos />} />
            <Route path="/recebiveis"  element={<Recebiveis />} />
            <Route path="/repasses"    element={<Repasses />} />
            <Route path="/costs"       element={<Costs />} />
            <Route path="/relatorios"  element={<Relatorios />} />
            <Route path="/nucleos"     element={<Nucleos />} />
            <Route path="/profissionais" element={<Profissionais />} />
            <Route path="/procedimentos" element={<Procedimentos />} />
            <Route path="/taxas-cartao"   element={<TaxasCartao />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}