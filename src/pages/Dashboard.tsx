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
  const {
    user
  } = useAuth();
  const [userName, setUserName] = useState("Usuário");
  useEffect(() => {
    if (user && user.email) setUserName(user.email.split("@")[0]);
  }, [user]);
  return <div className="flex flex-col min-h-screen bg-background">
      {/* Header + topo */}
      

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col items-center px-2 md:px-6 py-4 w-full max-w-6xl mx-auto">
        {/* Boas-vindas */}
        <section className="w-full mb-3">
          
          
        </section>
        
        {/* Tab Navigation */}
        <TabNavigation />

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Atividade Recente</CardTitle>
              <CardDescription>Resumo das últimas atividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Planos criados</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Atividades geradas</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comunicados enviados</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Status do Plano</CardTitle>
              <CardDescription>Recursos disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plano atual</span>
                  <span className="font-medium">Básico</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tokens</span>
                  <span className="font-medium">980 / 1000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Créditos IA</span>
                  <span className="font-medium">5 / 10</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Ferramentas Favoritas</CardTitle>
              <CardDescription>Seus recursos mais usados</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-sm">
                  <span className="bg-primary/10 text-primary p-1 rounded">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M7 17V3h10v14M7 7h10M17 21H7M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
                  </span>
                  <span>Gerador de Planos</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="bg-primary/10 text-primary p-1 rounded">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2h-6l-4 4v-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
                  </span>
                  <span>Comunicador</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
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
        
        {/* Ações rápidas como cards */}
        <h2 className="text-xl font-semibold w-full mb-3">Ações Rápidas</h2>
        <section className="w-full mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/plano-de-aula" className="bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border hover:border-primary" tabIndex={0}>
              <span className="font-semibold text-base flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-primary"><path d="M7 17V3h10v14M7 7h10M17 21H7M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
                Gerador de Planos
              </span>
              <small className="text-muted-foreground">Crie planos de aula automaticamente para suas necessidades</small>
            </a>
            <a href="/dashboard/avaliacoes" className="bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border hover:border-primary opacity-60 cursor-not-allowed" tabIndex={-1} aria-disabled>
              <span className="font-semibold text-base flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-muted-foreground"><path d="M5 6h14M5 12h9m-9 6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
                Avaliações
              </span>
              <small className="text-muted-foreground">Avalie o desempenho dos alunos (em breve)</small>
              <span className="text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 absolute top-2 right-2">Em breve</span>
            </a>
            <a href="/dashboard/materiais" className="bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border hover:border-primary opacity-60 cursor-not-allowed" tabIndex={-1} aria-disabled>
              <span className="font-semibold text-base flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-muted-foreground"><path d="M3 7l9-4 9 4v6c0 5-4 9-9 9s-9-4-9-9V7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
                Materiais
              </span>
              <small className="text-muted-foreground">Acesse e compartilhe materiais (em breve)</small>
              <span className="text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 absolute top-2 right-2">Em breve</span>
            </a>
            <a href="/dashboard/comunicacao" className="bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border hover:border-primary" tabIndex={0}>
              <span className="font-semibold text-base flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2h-6l-4 4v-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
                Comunicação
              </span>
              <small className="text-muted-foreground">Envie avisos rapidamente</small>
            </a>
          </div>
        </section>

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
    </div>;
}