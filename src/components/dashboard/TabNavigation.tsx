import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Book, Database, MessageSquare, FileText, 
  Search, User, Settings, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  available: boolean;
}

export function TabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments.length > 2 ? pathSegments[2] : "dashboard";
  
  const [activeTab, setActiveTab] = useState(currentTab);

  const tabs: TabItem[] = [
    {
      id: "dashboard",
      label: "Resumo",
      icon: Settings,
      route: "/dashboard",
      available: true,
    },
    {
      id: "planos",
      label: "Planos Aula",
      icon: Book,
      route: "/dashboard/planos",
      available: true,
    },
    {
      id: "questoes",
      label: "Questões",
      icon: Database,
      route: "/dashboard/questoes",
      available: true,
    },
    {
      id: "avaliacoes",
      label: "Avaliações",
      icon: Star,
      route: "/dashboard/avaliacoes",
      available: true,
    },
    {
      id: "materiais",
      label: "Adaptador",
      icon: FileText,
      route: "/dashboard/materiais",
      available: true,
    },
    {
      id: "comunicacao",
      label: "Comunicação",
      icon: MessageSquare,
      route: "/dashboard/comunicacao",
      available: true,
    },
    {
      id: "recursos",
      label: "Recursos",
      icon: Search,
      route: "/dashboard/recursos",
      available: false,
    },
    {
      id: "admin",
      label: "Organizador",
      icon: Settings,
      route: "/dashboard/admin",
      available: false,
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const tab = tabs.find((t) => t.id === value);
    if (tab) {
      navigate(tab.route);
    }
  };

  return (
    <div className="w-full overflow-auto pb-2 -mx-2 px-2">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-card mb-4 flex w-full h-auto p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={!tab.available}
              className={cn(
                "flex items-center gap-1 py-2 px-3 whitespace-nowrap",
                !tab.available && "opacity-50 cursor-not-allowed"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
