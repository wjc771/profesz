import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";
import { Bell, UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const quickActions = [
  { label: "Novo Plano", icon: "book", to: "/dashboard/planos", locked: false },
  { label: "Nova Avaliação", icon: "star", to: "/dashboard/avaliacoes", locked: true },
  { label: "Material", icon: "layers", to: "/dashboard/materiais", locked: true },
  { label: "Comunicar", icon: "message-square", to: "/dashboard/comunicacao", locked: false }
];

// Ícones do lucide-react: apenas os permitidos!
const iconMap: Record<string, JSX.Element> = {
  book: <span className="inline align-middle">{/* Book icon */}
    <svg width="20" height="20"><use href="#lucide-book" /></svg>
  </span>,
  star: <span className="inline align-middle">
    <svg width="20" height="20"><use href="#lucide-star" /></svg>
  </span>,
  layers: <span className="inline align-middle">
    <svg width="20" height="20"><use href="#lucide-layers" /></svg>
  </span>,
  "message-square": <span className="inline align-middle">
    <svg width="20" height="20"><use href="#lucide-message-square" /></svg>
  </span>
};

export default function Dashboard() {
  const { user } = useAuth();
  const [userName, setUserName] = useState("Usuário");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.email) setUserName(user.email.split("@")[0]);
  }, [user]);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-16 md:ml-20">
        {/* Header super simples */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background sticky top-0 z-10 h-14 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg text-primary">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg">PX</span>
            </span>
            <PlanIndicator plan="Plano Básico" />
          </div>
          <nav className="flex items-center gap-2">
            <Button size="icon" variant="ghost" aria-label="Notificações">
              <Bell />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Perfil do usuário">
              <UserCircle />
            </Button>
          </nav>
        </header>
        {/* Conteúdo */}
        <main className="flex-1 w-full max-w-6xl mx-auto py-4 px-2 md:px-8">
          {/* Boas-vindas */}
          <section className="mb-3">
            <h1 className="text-2xl md:text-3xl font-bold mb-0.5">Olá, {userName} 👋</h1>
            <p className="text-muted-foreground text-sm">Seu dia fica mais prático aqui.</p>
          </section>

          {/* Ações rápidas - grid compacto no desktop, carrossel no mobile */}
          <section className="mb-5">
            <div className={`flex gap-3 overflow-x-auto pb-1 ${isMobile ? "no-scrollbar" : "justify-start flex-wrap"}`}>
              {quickActions.map(({ label, icon, to, locked }) => (
                <Button
                  asChild
                  key={label}
                  variant={locked ? "outline" : "default"}
                  className={
                    `flex flex-col items-center justify-center p-4 min-w-[120px] rounded-xl
                  text-xs font-semibold shadow-sm transition-transform duration-200 hover:scale-105
                  ${locked ? "opacity-50 cursor-not-allowed" : ""}`
                  }
                  aria-disabled={locked}
                  disabled={locked}
                >
                  <a href={to}>
                    <div className="mb-1">
                      {/* SVG sprite icons: você pode substituir por import, mas só quatros estão disponíveis */}
                      {icon === "book" && <svg id="lucide-book" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 19a2 2 0 0 1 2-2h14V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2Z" /><path d="M22 19V5a2 2 0 0 0-2-2h-7" /><path d="M2 19v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2Z" /></svg>}
                      {icon === "star" && <svg id="lucide-star" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                      {icon === "layers" && <svg id="lucide-layers" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>}
                      {icon === "message-square" && <svg id="lucide-message-square" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></svg>}
                    </div>
                    <span>{label}</span>
                    {locked && (
                      <span className="ml-1 text-muted-foreground">(em breve)</span>
                    )}
                  </a>
                </Button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl shadow-sm p-4 flex flex-col gap-1 min-h-[100px]">
              <h2 className="font-semibold text-base mb-1">Atividades recentes</h2>
              <small className="text-muted-foreground">Nenhuma atividade recente.</small>
            </div>
            <div className="bg-card rounded-xl shadow-sm p-4 flex flex-col gap-1 min-h-[100px]">
              <h2 className="font-semibold text-base mb-1">Favoritos</h2>
              <small className="text-muted-foreground">Sem favoritos ainda.</small>
            </div>
            <div className="bg-card rounded-xl shadow-sm p-4 flex flex-col gap-1 min-h-[100px] xl:col-span-1 md:col-span-2">
              <h2 className="font-semibold text-base mb-1">Status do Plano</h2>
              <span className="text-muted-foreground text-sm">Tokens: <b>980</b> | Créditos IA: <b>5</b></span>
            </div>
          </div>

          {/* Gráfico destacado */}
          <section className="mb-6">
            <div className="bg-card rounded-xl shadow-sm p-4 flex flex-col gap-2">
              <h2 className="font-semibold text-base mb-3">Resumo Semanal</h2>
              <DashboardChart />
            </div>
          </section>

          {/* Dicas rápidas */}
          <section className="mb-6">
            <div className="bg-secondary rounded-xl shadow p-4">
              <ul className="list-disc space-y-1 ml-5 text-muted-foreground text-sm">
                <li>Use favoritos para acessar recursos rapidamente.</li>
                <li>Complete seu perfil para recomendações personalizadas.</li>
                <li>Planeje suas aulas e receba sugestões inteligentes.</li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
