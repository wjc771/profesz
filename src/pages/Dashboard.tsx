import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";
import { Bell, UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
const quickActions = [{
  label: "Novo Plano",
  icon: "book",
  to: "/dashboard/planos",
  locked: false
}, {
  label: "Nova Avaliação",
  icon: "star",
  to: "/dashboard/avaliacoes",
  locked: true
}, {
  label: "Material",
  icon: "layers",
  to: "/dashboard/materiais",
  locked: true
}, {
  label: "Comunicar",
  icon: "message-square",
  to: "/dashboard/comunicacao",
  locked: false
}];

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
  const {
    user
  } = useAuth();
  const [userName, setUserName] = useState("Usuário");
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (user && user.email) setUserName(user.email.split("@")[0]);
  }, [user]);
  return <div className="flex min-h-screen bg-background">
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
    </div>;
}