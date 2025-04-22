
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";
import { UserCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const quickActions = [
  { label: "Novo Plano de Aula", icon: "book", to: "/dashboard/planos", locked: false },
  { label: "Novo Material", icon: "layers", to: "/dashboard/materiais", locked: true },
  { label: "Nova Avaliação", icon: "star", to: "/dashboard/avaliacoes", locked: true },
  { label: "Comunicar", icon: "message-square", to: "/dashboard/comunicacao", locked: false }
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("Usuário");

  useEffect(() => {
    if (user && user.email) {
      setUserName(user.email.split("@")[0]);
    }
  }, [user]);

  // Acessibilidade: setFocus e PWA support: aria-labels, alt text, live regions
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* App Header */}
      <header className="w-full border-b border-border bg-background flex items-center justify-between px-0 md:px-8 h-16">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-black text-xl text-primary pl-4 md:pl-0">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg">PX</span>
            <span className="hidden md:inline">ProfeXpress</span>
          </span>
          <PlanIndicator plan="Plano Básico" />
        </div>
        <nav aria-label="Menu principal" className="flex items-center gap-2 md:gap-4 mx-auto">
          {/* Notificação visual, plano, etc*/}
          <Button size="icon" variant="ghost" aria-label="Notificações">
            <Bell />
            <span className="sr-only">Notificações</span>
          </Button>
          <Button size="icon" variant="ghost" aria-label="Perfil do usuário">
            <UserCircle />
            <span className="sr-only">Perfil</span>
          </Button>
        </nav>
        <div className="pr-4 md:pr-0">
          <span className="text-xs text-muted-foreground">Bem-vindo(a), {userName}!</span>
        </div>
      </header>
      {/* Layout body */}
      <div className="flex-1 flex flex-col md:flex-row bg-muted/30">
        {/* Sidebar */}
        <DashboardSidebar />
        {/* Main Panel */}
        <main className="flex-1 flex flex-col pt-6 px-2 md:px-8 pb-8" tabIndex={-1}>
          {/* Atividades recentes */}
          <section aria-labelledby="atividades-recentes" className="mb-8">
            <h2 id="atividades-recentes" className="font-bold text-lg mb-2">Atividades recentes</h2>
            <div className="rounded-lg border border-border bg-card p-4 min-h-[64px] flex items-center text-muted-foreground">
              Nenhuma atividade recente encontrada ainda.
            </div>
          </section>

          {/* Recursos favoritos e mais usados */}
          <section aria-labelledby="favoritos-mais-usados" className="mb-8">
            <h2 id="favoritos-mais-usados" className="font-bold text-lg mb-2">Recursos favoritos e mais usados</h2>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-lg border border-border bg-card p-3 min-w-[140px] flex items-center gap-2 aria-disabled:opacity-60">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">Planos de Aula</span>
              </div>
              <div className="rounded-lg border border-border bg-card p-3 min-w-[140px] flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">Materiais</span>
                <span className="ml-2 text-muted-foreground"><svg aria-label="Recurso bloqueado" width="16" height="16" fill="none"><g><circle cx="8" cy="8" r="7" stroke="#EA384C" strokeWidth="2"/><rect x="6" y="7" width="4" height="5" rx="1" fill="#EA384C"/><rect x="6.5" y="4" width="3" height="3" rx="1.5" stroke="#EA384C" strokeWidth="1"/></g></svg></span>
              </div>
            </div>
          </section>

          {/* Uso do Plano/Status (tokens/limites) */}
          <section aria-labelledby="status-uso" className="mb-8">
            <h2 id="status-uso" className="font-bold text-lg mb-2">Status do uso</h2>
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
              <span aria-live="polite">Tokens restantes: <b>980</b> / 1000</span>
              <span aria-live="polite">Créditos de IA: <b>5</b> / 10</span>
              <Button variant="outline" size="sm" className="mt-2 w-fit">Ver detalhes do plano</Button>
            </div>
          </section>

          {/* Dicas contextuais */}
          <section aria-labelledby="dicas-contextuais" className="mb-8">
            <h2 id="dicas-contextuais" className="font-bold text-lg mb-2">Dicas rápidas</h2>
            <ul className="list-disc ml-6 text-muted-foreground text-sm">
              <li>Use recursos favoritos para acesso rápido.</li>
              <li>Complete seu perfil para recomendações personalizadas.</li>
              <li>Planeje suas aulas e receba insights automáticos.</li>
            </ul>
          </section>

          {/* Notificações importantes */}
          <section aria-labelledby="notificacoes-importantes" className="mb-8">
            <h2 id="notificacoes-importantes" className="font-bold text-lg mb-2">Notificações importantes</h2>
            <div className="rounded-lg border border-border bg-card p-4 text-muted-foreground">
              Nenhuma notificação nova.
            </div>
          </section>

          {/* Área de Acesso Rápido */}
          <section aria-labelledby="acesso-rapido">
            <h2 id="acesso-rapido" className="font-bold text-lg mb-2">Acesso rápido</h2>
            <div className="flex flex-wrap gap-4 mb-2">
              {quickActions.map(({ label, icon, to, locked }) => (
                <Button
                  asChild
                  key={label}
                  variant={locked ? "outline" : "default"}
                  className={
                    `flex items-center gap-2` +
                    (locked ? " opacity-50 cursor-not-allowed" : "")
                  }
                  aria-disabled={locked}
                  disabled={locked}
                >
                  <a href={to}>
                    <span className="sr-only">{label}</span>
                    {/* Lucide icons */}
                    {icon === "book" && <span aria-hidden="true"><svg width="18" height="18" className="inline align-middle"><Book /></svg></span>}
                    {icon === "layers" && <span aria-hidden="true"><svg width="18" height="18" className="inline align-middle"><Layers /></svg></span>}
                    {icon === "star" && <span aria-hidden="true"><svg width="18" height="18" className="inline align-middle"><Star /></svg></span>}
                    {icon === "message-square" && <span aria-hidden="true"><svg width="18" height="18" className="inline align-middle"><MessageSquare /></svg></span>}
                    <span>{label}</span>
                    {locked && (
                      <span className="ml-1" aria-label="Bloqueado">
                        <svg aria-label="Recurso bloqueado" width="16" height="16" fill="none"><g><circle cx="8" cy="8" r="7" stroke="#EA384C" strokeWidth="2"/><rect x="6" y="7" width="4" height="5" rx="1" fill="#EA384C"/><rect x="6.5" y="4" width="3" height="3" rx="1.5" stroke="#EA384C" strokeWidth="1"/></g></svg>
                      </span>
                    )}
                  </a>
                </Button>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <b>Projetos recentes:</b> (em breve: listagem dos últimos planos/materiais criados)
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
