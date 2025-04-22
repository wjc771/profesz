import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";

export default function Dashboard() {
  const { user } = useAuth();
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    if (user && user.email) setUserName(user.email.split("@")[0]);
  }, [user]);

  // Menu topbar horizontal + hamburger para mobile
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header + topo */}
      <header className="w-full flex items-center justify-between px-4 py-2 border-b border-border bg-background sticky top-0 z-20 h-14 gap-2">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg font-black text-lg">
            PX
          </span>
        </div>
        <DashboardNav userName={userName} />
        <PlanIndicator plan="Plano Básico" />
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col items-center px-2 md:px-6 py-4 w-full max-w-5xl mx-auto">
        {/* Boas-vindas */}
        <section className="w-full mb-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-0.5">
            Olá, {userName} 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Seu dia fica mais prático aqui.
          </p>
        </section>

        {/* Ações rápidas como cards */}
        <section className="w-full mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick action cards */}
            <a
              href="/plano-de-aula"
              className="bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border hover:border-primary"
              tabIndex={0}
            >
              <span className="font-semibold text-base flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-primary"><path d="M7 17V3h10v14M7 7h10M17 21H7M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></svg>
                Gerador de Planos
              </span>
              <small className="text-muted-foreground">Crie planos de aula automaticamente para suas necessidades</small>
            </a>
            <a
              href="/dashboard/avaliacoes"
              className="bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border hover:border-primary opacity-60 cursor-not-allowed"
              tabIndex={-1}
              aria-disabled
            >
              <span className="font-semibold text-base flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-muted-foreground"><path d="M5 6h14M5 12h9m-9 6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></svg>
                Avaliações
              </span>
              <small className="text-muted-foreground">Avalie o desempenho dos alunos (em breve)</small>
              <span className="text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 absolute top-2 right-2">Em breve</span>
            </a>
            <a
              href="/dashboard/materiais"
              className="bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border hover:border-primary opacity-60 cursor-not-allowed"
              tabIndex={-1}
              aria-disabled
            >
              <span className="font-semibold text-base flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-muted-foreground"><path d="M3 7l9-4 9 4v6c0 5-4 9-9 9s-9-4-9-9V7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></svg>
                Materiais
              </span>
              <small className="text-muted-foreground">Acesse e compartilhe materiais (em breve)</small>
              <span className="text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 absolute top-2 right-2">Em breve</span>
            </a>
            <a
              href="/dashboard/comunicacao"
              className="bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border hover:border-primary"
              tabIndex={0}
            >
              <span className="font-semibold text-base flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2h-6l-4 4v-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></svg>
                Comunicação
              </span>
              <small className="text-muted-foreground">Envie avisos rapidamente</small>
            </a>
          </div>
        </section>

        {/* Cards informativos úteis */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
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
            <span className="text-muted-foreground text-sm">
              Tokens: <b>980</b> | Créditos IA: <b>5</b>
            </span>
          </div>
        </div>

        {/* Dicas rápidas */}
        <section className="w-full mb-2">
          <div className="bg-secondary rounded-xl shadow p-4">
            <ul className="list-disc space-y-1 ml-5 text-muted-foreground text-sm">
              <li>Use favoritos para acessar recursos rapidamente.</li>
              <li>Complete seu perfil para recomendações personalizadas.</li>
              <li>Planeje suas aulas e receba sugestões inteligentes.</li>
            </ul>
          </div>
        </section>

        {/* Area de futuro - cards de recursos por plano estarão aqui */}
      </main>
    </div>
  );
}
