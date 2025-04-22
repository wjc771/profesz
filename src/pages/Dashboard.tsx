
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";
import { useIsMobile } from "@/hooks/use-mobile";

// Menu de navegação
const navItems = [
  { label: "Painel", to: "/dashboard" },
  { label: "Planos de Aula", to: "/dashboard/planos" },
  { label: "Avaliações", to: "/dashboard/avaliacoes" },
  { label: "Materiais", to: "/dashboard/materiais" },
  { label: "Comunicação", to: "/dashboard/comunicacao" },
];

// Ações rápidas para cards
const quickActions = [
  {
    label: "Novo Plano",
    description: "Crie um novo plano de aula facilmente",
    to: "/dashboard/planos",
    locked: false
  },
  {
    label: "Nova Avaliação",
    description: "Inicie uma avaliação para seus alunos",
    to: "/dashboard/avaliacoes",
    locked: true
  },
  {
    label: "Material",
    description: "Acesse e compartilhe materiais",
    to: "/dashboard/materiais",
    locked: true
  },
  {
    label: "Comunicar",
    description: "Envie avisos rapidamente",
    to: "/dashboard/comunicacao",
    locked: false
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    if (user && user.email) setUserName(user.email.split("@")[0]);
  }, [user]);

  // Fecha o nav ao mudar viewport
  useEffect(() => {
    if (!isMobile) setMobileNavOpen(false);
  }, [isMobile]);

  // Menu topbar horizontal + hamburger para mobile
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header + topo */}
      <header className="w-full flex items-center justify-between px-4 py-2 border-b border-border bg-background sticky top-0 z-20 h-14 gap-2">
        {/* Logo + plano */}
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg font-black text-lg">
            PX
          </span>
          {!isMobile && <PlanIndicator plan="Plano Básico" />}
        </div>
        {/* Menu desktop */}
        {!isMobile ? (
          <nav className="flex gap-4 items-center">
            {navItems.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="font-medium hover:text-primary transition px-2"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menu"
            onClick={() => setMobileNavOpen(true)}
            className="ml-auto"
          >
            <Menu />
          </Button>
        )}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <PlanIndicator plan="Plano Básico" />
          </div>
        )}
      </header>

      {/* Drawer menu mobile */}
      {isMobile && mobileNavOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex">
          <nav className="bg-background w-64 max-w-[80vw] h-full p-6 flex flex-col shadow-lg animate-slide-in-left relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Fechar menu"
            >
              <X />
            </Button>
            <div className="mb-6">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg font-black text-xl">
                PX
              </span>
              <span className="ml-3 font-bold text-lg">{userName}</span>
              <div className="mt-2">
                <PlanIndicator plan="Plano Básico" />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  className="py-2 px-3 rounded hover:bg-accent text-base font-medium transition"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

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
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.locked ? "#" : action.to}
                className={
                  "bg-card rounded-xl p-4 flex flex-col items-start gap-2 shadow hover:shadow-md transition group relative border " +
                  (action.locked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary")
                }
                tabIndex={action.locked ? -1 : 0}
                aria-disabled={action.locked}
              >
                <span className="font-semibold text-base">
                  {action.label}
                </span>
                <small className="text-muted-foreground">{action.description}</small>
                {action.locked && (
                  <span className="text-xs bg-muted text-muted-foreground rounded px-2 py-0.5 absolute top-2 right-2">Em breve</span>
                )}
              </a>
            ))}
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

        {/* Dicas rápidas e limpas */}
        <section className="w-full mb-2">
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
  );
}
