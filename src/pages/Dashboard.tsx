
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { PlanUsageStats } from "@/components/dashboard/PlanUsageStats";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { mockProfiles } from "@/lib/mockData";
import { UserType } from "@/types/profile";

// Sample data for chart
const progressData = [{
  name: "Jan",
  Aulas: 3,
  Atividades: 2,
  Tarefas: 4
}, {
  name: "Fev",
  Aulas: 4,
  Atividades: 3,
  Tarefas: 5
}, {
  name: "Mar",
  Aulas: 6,
  Atividades: 4,
  Tarefas: 6
}, {
  name: "Abr",
  Aulas: 8,
  Atividades: 6,
  Tarefas: 7
}, {
  name: "Mai",
  Aulas: 7,
  Atividades: 5,
  Tarefas: 8
}, {
  name: "Jun",
  Aulas: 9,
  Atividades: 7,
  Tarefas: 6
}];

export default function Dashboard() {
  const { user } = useAuth();
  const [userName, setUserName] = useState("Usuário");
  const [userType, setUserType] = useState<UserType>("professor");

  useEffect(() => {
    if (user) {
      if (user.email) setUserName(user.email.split("@")[0]);
      
      const getProfile = async () => {
        const mockProfile = mockProfiles.find(profile => profile.id === user.id);
        if (mockProfile) {
          setUserType(mockProfile.type as UserType);
        }
      };
      
      getProfile();
    }
  }, [user]);

  // Different chart data keys for each user type
  const chartConfig = {
    professor: {
      keys: ["Aulas", "Atividades"],
      description: "Acompanhe sua produtividade"
    },
    instituicao: {
      keys: ["Aulas", "Atividades", "Avaliações"],
      description: "Produção dos professores"
    },
    aluno: {
      keys: ["Tarefas", "Atividades"],
      description: "Progresso de estudos"
    },
    pais: {
      keys: ["Tarefas"],
      description: "Acompanhamento de tarefas"
    }
  };

  const currentChartConfig = chartConfig[userType] || chartConfig.professor;

  // Different tips for each user type
  const tips = {
    professor: [
      "Use a barra de navegação acima para acessar diferentes ferramentas.",
      "Complete seu perfil para recomendações personalizadas.",
      "Planeje suas aulas e receba sugestões inteligentes."
    ],
    instituicao: [
      "Acompanhe o desempenho dos professores no painel.",
      "Compartilhe materiais entre sua equipe de educadores.",
      "Configure seus modelos de avaliação institucional."
    ],
    aluno: [
      "Acompanhe suas tarefas pendentes regularmente.",
      "Pratique questões para melhorar seu desempenho.",
      "Peça ajuda com seus deveres de casa quando precisar."
    ],
    pais: [
      "Acompanhe as tarefas de seus filhos regularmente.",
      "Utilize as sugestões de estudo para auxiliar no aprendizado.",
      "Mantenha-se informado sobre o progresso escolar."
    ]
  };

  const currentTips = tips[userType] || tips.professor;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center px-2 md:px-6 py-4 w-full max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <TabNavigation />
        
        {/* Stats */}
        <DashboardStats userType={userType} />

        {/* Plan Usage Stats */}
        <PlanUsageStats />
        
        {/* Progress Chart */}
        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Progresso Mensal</CardTitle>
            <CardDescription>{currentChartConfig.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              Aulas: {
                theme: {
                  light: "#2563eb",
                  dark: "#3b82f6"
                }
              },
              Atividades: {
                theme: {
                  light: "#10b981",
                  dark: "#34d399"
                }
              },
              Tarefas: {
                theme: {
                  light: "#f59e0b",
                  dark: "#fbbf24"
                }
              }
            }} className="h-72">
              <AreaChart data={progressData} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
                <defs>
                  <linearGradient id="colorAulas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-Aulas)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-Aulas)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorAtividades" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-Atividades)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-Atividades)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorTarefas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-Tarefas)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-Tarefas)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                
                {currentChartConfig.keys.includes("Aulas") && (
                  <Area type="monotone" dataKey="Aulas" stroke="var(--color-Aulas)" fillOpacity={1} fill="url(#colorAulas)" />
                )}
                {currentChartConfig.keys.includes("Atividades") && (
                  <Area type="monotone" dataKey="Atividades" stroke="var(--color-Atividades)" fillOpacity={1} fill="url(#colorAtividades)" />
                )}
                {currentChartConfig.keys.includes("Tarefas") && (
                  <Area type="monotone" dataKey="Tarefas" stroke="var(--color-Tarefas)" fillOpacity={1} fill="url(#colorTarefas)" />
                )}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Dicas rápidas */}
        <section className="w-full mb-4">
          <div className="bg-secondary rounded-xl shadow p-4">
            <h3 className="font-medium mb-2">Dicas Rápidas</h3>
            <ul className="list-disc space-y-1 ml-5 text-muted-foreground text-sm">
              {currentTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
