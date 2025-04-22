
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";
import { Bell, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [userName, setUserName] = useState<string>("Usuário");

  useEffect(() => {
    if (user && user.email) {
      setUserName(user.email.split("@")[0]);
    }
  }, [user]);

  // Dados simples para os cards principais
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border bg-background flex items-center justify-between px-4 md:px-12 h-16">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-black text-xl text-primary">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg">PX</span>
            <span className="hidden md:inline">ProfeXpress</span>
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

      <main className="flex-1 w-full max-w-5xl mx-auto py-4 md:py-12 px-2 md:px-8">
        {/* Boas-vindas */}
        <section className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold mb-1 mobile-heading">
            Olá, {userName} 👋
          </h1>
          <p className="text-muted-foreground mobile-text">
            Bem-vindo ao seu painel educativo. Aqui você encontra suas principais ferramentas e recursos favoritos.
          </p>
        </section>

        {/* Quick Actions em carrossel horizontal no mobile */}
        <section className="mb-5">
          <div className={`flex gap-3 overflow-x-auto pb-2 ${isMobile ? "" : "justify-start"}`}>
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
                    {icon === "book" && <svg id="lucide-book" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 19a2 2 0 0 1 2-2h14V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2Z"/><path d="M22 19V5a2 2 0 0 0-2-2h-7"/><path d="M2 19v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2Z"/></svg>}
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

        {/* Cards principais, responsivos e clean */}
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 mb-6">
          <div className="bg-card rounded-xl shadow-sm p-4 flex flex-col gap-2 min-h-[120px]">
            <h2 className="font-semibold text-base mb-2">Atividades recentes</h2>
            <small className="text-muted-foreground">Nenhuma atividade recente ainda.</small>
          </div>
          <div className="bg-card rounded-xl shadow-sm p-4 flex flex-col gap-2 min-h-[120px]">
            <h2 className="font-semibold text-base mb-2">Recursos favoritos</h2>
            <small className="text-muted-foreground">Você ainda não adicionou favoritos.</small>
          </div>
          <div className="bg-card rounded-xl shadow-sm p-4 flex flex-col gap-2 min-h-[120px] col-span-1 md:col-span-2 xl:col-span-1">
            <h2 className="font-semibold text-base mb-2">Status do plano</h2>
            <span className="text-muted-foreground">Tokens restantes: <b>980</b> | Créditos de IA: <b>5</b></span>
          </div>
        </section>

        {/* Dicas rápidas - clean e compacta */}
        <section className="mb-4 md:mb-8">
          <div className="bg-secondary rounded-xl shadow p-4 flex flex-col gap-2">
            <h2 className="font-semibold text-base mb-1">Dicas rápidas</h2>
            <ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
              <li>Use favoritos para acessar recursos rapidamente.</li>
              <li>Complete seu perfil para recomendações personalizadas.</li>
              <li>Planeje suas aulas e receba sugestões inteligentes.</li>
            </ul>
          </div>
        </section>

        {/* Notificações importantes - oculto no mobile se vazio */}
        <section className={`${isMobile ? "hidden" : "mb-4"}`}>
          <div className="bg-card rounded-xl shadow-sm p-4 text-muted-foreground">
            Nenhuma notificação nova.
          </div>
        </section>

        {/* Projetos recentes - oculto no mobile por minimalismo */}
        {!isMobile && (
          <section className="mb-4">
            <div className="text-xs text-muted-foreground">
              <b>Projetos recentes:</b> (em breve: listagem dos últimos planos/materiais criados)
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
