
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// Sample data for chart
const progressData = [{
  name: "Jan",
  Aulas: 3,
  Atividades: 2
}, {
  name: "Fev",
  Aulas: 4,
  Atividades: 3
}, {
  name: "Mar",
  Aulas: 6,
  Atividades: 4
}, {
  name: "Abr",
  Aulas: 8,
  Atividades: 6
}, {
  name: "Mai",
  Aulas: 7,
  Atividades: 5
}, {
  name: "Jun",
  Aulas: 9,
  Atividades: 7
}];

export default function Dashboard() {
  const { user } = useAuth();
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    if (user && user.email) setUserName(user.email.split("@")[0]);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center px-2 md:px-6 py-4 w-full max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <TabNavigation />
        
        {/* Progress Chart */}
        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Progresso Mensal</CardTitle>
            <CardDescription>Acompanhe sua produtividade</CardDescription>
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
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="Aulas" stroke="var(--color-Aulas)" fillOpacity={1} fill="url(#colorAulas)" />
                <Area type="monotone" dataKey="Atividades" stroke="var(--color-Atividades)" fillOpacity={1} fill="url(#colorAtividades)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Dicas rápidas */}
        <section className="w-full mb-4">
          <div className="bg-secondary rounded-xl shadow p-4">
            <h3 className="font-medium mb-2">Dicas Rápidas</h3>
            <ul className="list-disc space-y-1 ml-5 text-muted-foreground text-sm">
              <li>Use a barra de navegação acima para acessar diferentes ferramentas.</li>
              <li>Complete seu perfil para recomendações personalizadas.</li>
              <li>Planeje suas aulas e receba sugestões inteligentes.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
