
import { NavLink } from "react-router-dom";
import { Home, Book, FileText, Star, Layers, MessageSquare, Settings } from "lucide-react";

const sidebarLinks = [
  { label: "Painel", icon: Home, to: "/dashboard" },
  { label: "Planos de Aula", icon: Book, to: "/dashboard/planos" },
  { label: "Questões", icon: FileText, to: "/dashboard/questoes" },
  { label: "Avaliações", icon: Star, to: "/dashboard/avaliacoes" },
  { label: "Materiais", icon: Layers, to: "/dashboard/materiais" },
  { label: "Configurações", icon: Settings, to: "/settings" },
];

export default function DashboardSidebar() {
  return (
    <aside className="bg-card border-r border-border flex flex-col min-h-screen w-16 md:w-20 py-4 items-center fixed z-20">
      <span className="mb-8 flex flex-col items-center gap-1">
        <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-lg font-bold">PZ</span>
      </span>
      <nav className="flex-1 flex flex-col gap-4 w-full items-center">
        {sidebarLinks.map(item => (
          <NavLink
            to={item.to}
            key={item.label}
            className={({ isActive }) =>
              `flex flex-col items-center group justify-center w-12 h-12 mx-auto rounded-lg transition-colors
              hover:bg-accent ${isActive ? "bg-accent text-primary" : "text-muted-foreground"}`
            }
            title={item.label}
          >
            <item.icon size={22} />
            <span className="hidden md:block text-[10px] mt-1 leading-3">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
