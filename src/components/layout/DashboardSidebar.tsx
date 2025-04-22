
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Book, Star, Layers, MessageSquare, Settings, Activity, List, CircleDollarSign } from "lucide-react";

const sidebarLinks = [
  {
    section: "Painel",
    items: [
      { label: "Meu Painel", icon: LayoutDashboard, to: "/dashboard" },
      { label: "Planos de Aula", icon: Book, to: "/dashboard/planos" },
      { label: "Avaliações", icon: Star, to: "/dashboard/avaliacoes" },
      { label: "Materiais Didáticos", icon: Layers, to: "/dashboard/materiais" },
    ],
  },
  {
    section: "Engajamento",
    items: [
      { label: "Feedback", icon: MessageSquare, to: "/dashboard/feedback" },
      { label: "Comunicação", icon: Activity, to: "/dashboard/comunicacao" },
    ],
  },
  {
    section: "Outros",
    items: [
      { label: "Recursos", icon: List, to: "/dashboard/recursos" },
      { label: "Configurações", icon: Settings, to: "/settings" },
      { label: "Assinatura", icon: CircleDollarSign, to: "/subscription" },
    ],
  }
];

export default function DashboardSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-card border-r border-border p-4">
      <div className="mb-8">
        <span className="flex items-center gap-2 font-black text-xl text-primary">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded">PX</span>
          ProfeXpress
        </span>
      </div>
      <nav className="flex flex-col gap-8">
        {sidebarLinks.map((section, idx) => (
          <div key={idx}>
            <div className="uppercase text-muted-foreground text-xs font-semibold mb-1 ml-1">{section.section}</div>
            <ul className="flex flex-col gap-2">
              {section.items.map(item => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors 
                       hover:bg-accent hover:text-accent-foreground 
                       ${isActive ? "bg-accent font-semibold" : "text-muted-foreground"}`
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto text-xs text-muted-foreground text-center">
        <span className="sr-only">Reforçando LGPD e PWA:</span>
        <span className="block mt-8">🔒 LGPD • PWA Ready</span>
      </div>
    </aside>
  );
}
