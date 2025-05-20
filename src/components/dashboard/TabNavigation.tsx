
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, Database, FileText, 
  Search, Settings, Star,
  Clock, HelpCircle, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { mockProfiles } from "@/lib/mockData";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  available: boolean;
  userTypes: string[];
}

export function TabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments.length > 2 ? pathSegments[2] : "dashboard";
  
  const [activeTab, setActiveTab] = useState(currentTab);
  const [userType, setUserType] = useState<string>("professor");

  useEffect(() => {
    const getUserType = async () => {
      if (!user) return;
      const mockProfile = mockProfiles.find(profile => profile.id === user.id);
      if (mockProfile) {
        setUserType(mockProfile.type);
      }
    };
    getUserType();
  }, [user]);

  const allTabs: TabItem[] = [
    {
      id: "dashboard",
      label: "Resumo",
      icon: Settings,
      route: "/dashboard",
      available: true,
      userTypes: ["professor", "instituicao", "aluno", "pais"]
    },
    {
      id: "planos",
      label: "Planos Aula",
      icon: Book,
      route: "/dashboard/planos",
      available: true,
      userTypes: ["professor", "instituicao"]
    },
    {
      id: "questoes",
      label: "Questões",
      icon: Database,
      route: "/dashboard/questoes",
      available: true,
      userTypes: ["professor", "instituicao", "aluno"]
    },
    {
      id: "avaliacoes",
      label: "Avaliações",
      icon: Star,
      route: "/dashboard/avaliacoes",
      available: true,
      userTypes: ["professor", "instituicao"]
    },
    {
      id: "materiais",
      label: "Adaptador",
      icon: FileText,
      route: "/dashboard/materiais",
      available: true,
      userTypes: ["professor", "instituicao"]
    },
    {
      id: "tarefas",
      label: "Tarefas",
      icon: Clock,
      route: "/dashboard/tarefas",
      available: true,
      userTypes: ["aluno", "pais"]
    },
    {
      id: "ajuda",
      label: "Ajuda",
      icon: HelpCircle,
      route: "/dashboard/ajuda",
      available: true,
      userTypes: ["aluno", "pais"]
    },
    {
      id: "acompanhamento",
      label: "Acompanhar",
      icon: UserCheck,
      route: "/dashboard/acompanhamento",
      available: true,
      userTypes: ["pais"]
    }
  ];

  // Filter tabs based on user type
  const filteredTabs = allTabs.filter(tab => tab.userTypes.includes(userType));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const tab = filteredTabs.find((t) => t.id === value);
    if (tab) {
      navigate(tab.route);
    }
  };

  return (
    <div className="w-full overflow-auto pb-2 -mx-2 px-2">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-card mb-4 flex w-full h-auto p-1 overflow-x-auto">
          {filteredTabs.map((tab) => (
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
