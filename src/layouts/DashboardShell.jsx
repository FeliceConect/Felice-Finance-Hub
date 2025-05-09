import { NavLink, Outlet } from "react-router-dom";
import {
  FiHome, FiTrendingUp, FiCreditCard, FiPocket, FiLayers, FiBarChart2,
  FiDatabase, FiUsers, FiClipboard, FiSettings
} from "react-icons/fi";

/* lista centralizada para não repetir nos dois arquivos */
const NAV = [
  { path: "/",              label: "Dashboard",   icon: FiHome            },
  { path: "/lancamentos",   label: "Lançamentos", icon: FiPocket          },
  { path: "/recebiveis",    label: "Recebíveis",  icon: FiCreditCard      },
  { path: "/repasses",      label: "Repasses",    icon: FiTrendingUp      },
  { path: "/custos",        label: "Custos",      icon: FiLayers          },
  { path: "/relatorios",    label: "Relatórios",  icon: FiBarChart2       },
  /* — Cadastros — */
  { separator: true, title: "Cadastros" },
  { path: "/nucleos",       label: "Núcleos",       icon: FiDatabase      },
  { path: "/profissionais", label: "Profissionais", icon: FiUsers         },
  { path: "/procedimentos", label: "Procedimentos", icon: FiClipboard     },
  /* — Configurações — */
  { separator: true, title: "Configurações" },
  { path: "/taxas-cartao",  label: "Taxas de Cartão", icon: FiSettings    },
];

export default function DashboardShell() {
  return (
    <div className="flex h-screen bg-gray-50 text-slate-800">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="w-60 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className="font-extrabold text-lg">Felice Finance&nbsp;Hub</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {NAV.map((item, idx) => item.separator ? (
            <p key={idx} className="mt-6 mb-2 px-3 text-xs font-semibold text-slate-500">
              {item.title}
            </p>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm
                 ${isActive
                   ? "bg-indigo-50 text-indigo-600 font-semibold"
                   : "hover:bg-gray-100"}`
              }
            >
              <item.icon size={18}/>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* avatar / usuário (opcional) */}
        <div className="h-16 flex items-center justify-center border-t border-gray-200">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center
                          justify-center text-sm font-semibold select-none">
            AD
          </div>
        </div>
      </aside>

      {/* ---------- ÁREA DE CONTEÚDO ---------- */}
      <main className="flex-1 overflow-y-auto">
        {/* cabeçalho das páginas individuais continua dentro de cada página */}
        <Outlet />
      </main>
    </div>
  );
}