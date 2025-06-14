
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Book, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { mockProfiles } from "@/lib/mockData";
import { UserType } from "@/types/profile";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  userTypes: UserType[];
}

const navItems: NavItem[] = [
  {
    id: "resumo",
    label: "Resumo",
    icon: Home,
    route: "/dashboard",
    userTypes: ["professor", "instituicao", "aluno", "pais"]
  },
  {
    id: "planejamento",
    label: "Planejamento",
    icon: Book,
    route: "/dashboard/planejamento",
    userTypes: ["professor", "instituicao"]
  },
  {
    id: "atividades",
    label: "Atividades",
    icon: Star,
    route: "/dashboard/atividades",
    userTypes: ["professor", "instituicao"]
  },
  {
    id: "correcao",
    label: "Correção",
    icon: CheckCircle,
    route: "/dashboard/correcao",
    userTypes: ["professor", "instituicao"]
  }
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const [userType, setUserType] = useState<UserType>("professor");

  useEffect(() => {
    const getUserType = async () => {
      if (!user) return;
      const mockProfile = mockProfiles.find(profile => profile.id === user.id);
      if (mockProfile) {
        setUserType(mockProfile.type as UserType);
      }
    };
    getUserType();
  }, [user]);

  // Filtrar itens baseado no tipo de usuário
  const filteredItems = navItems.filter(item => 
    item.userTypes.includes(userType)
  );

  // Determinar item ativo baseado na rota
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "resumo";
    if (path.includes("/planejamento")) return "planejamento";
    if (path.includes("/atividades")) return "atividades";
    if (path.includes("/correcao")) return "correcao";
    return "resumo";
  };

  const activeItem = getActiveItem();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {filteredItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              to={item.route}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors min-w-0",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="text-xs font-medium truncate max-w-16">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
