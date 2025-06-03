
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, FileText, Star,
  Search, Settings, CheckCircle,
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
      id: "planejamento",
      label: "Planejamento Pedagógico",
      icon: Book,
      route: "/dashboard/planejamento",
      available: true,
      userTypes: ["professor", "instituicao"]
    },
    {
      id: "atividades",
      label: "Central de Atividades",
      icon: Star,
      route: "/dashboard/atividades",
      available: true,
      userTypes: ["professor", "instituicao"]
    },
    {
      id: "correcao",
      label: "Central de Correção",
      icon: CheckCircle,
      route: "/dashboard/correcao",
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
