
import { useState } from "react";
import { Menu, X, Home, Book, Star, Layers, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Painel", to: "/dashboard", icon: Home },
  { label: "Planos de Aula", to: "/dashboard/planos", icon: Book },
  { label: "Avaliações", to: "/dashboard/avaliacoes", icon: Star },
  { label: "Materiais", to: "/dashboard/materiais", icon: Layers },
  { label: "Comunicação", to: "/dashboard/comunicacao", icon: MessageSquare },
];

export function DashboardNav({ userName }: { userName: string }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
          className="ml-auto"
        >
          <Menu />
        </Button>
        {open && (
          <div className="fixed inset-0 z-50 flex">
            <nav className="bg-background w-64 max-w-[80vw] h-full p-6 flex flex-col shadow-lg animate-slide-in-left relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
              >
                <X />
              </Button>
              <div className="mb-6">
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg font-black text-xl">
                  PX
                </span>
                <span className="ml-3 font-bold text-lg">{userName}</span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.to}
                    href={item.to}
                    className="py-2 px-3 rounded hover:bg-accent text-base font-medium transition flex items-center gap-3"
                    onClick={() => setOpen(false)}
                  >
                    <item.icon size={18} className="text-muted-foreground" />
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
            <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
          </div>
        )}
      </>
    );
  }

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map((item) => (
        <a
          key={item.to}
          href={item.to}
          className="flex items-center gap-2 px-3 py-1 rounded-lg font-medium hover:bg-accent transition"
        >
          <item.icon size={18} className="text-muted-foreground" />
          {item.label}
        </a>
      ))}
    </nav>
  );
}
