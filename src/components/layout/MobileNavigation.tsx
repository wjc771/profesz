
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { PanelRightOpen, LogOut, LogIn, Home, UserCircle, Search, Building, Heart, Cog } from "lucide-react";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Close the menu when the location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-full shadow-lg"
          aria-label="Open Menu"
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col h-full">
        <div className="flex-1 py-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <nav className="space-y-2">
            <Link to={user ? "/dashboard" : "/"}>
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Home className="mr-2 h-5 w-5" />
                {user ? "Dashboard" : "Início"}
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Building className="mr-2 h-5 w-5" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <UserCircle className="mr-2 h-5 w-5" />
                    Meu Perfil
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Cog className="mr-2 h-5 w-5" />
                    Configurações
                  </Button>
                </Link>
                <Link to="/property-preferences">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Perfil de Busca
                  </Button>
                </Link>
                <Link to="/subscription">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Assinatura
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <UserCircle className="mr-2 h-5 w-5" />
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        {user && (
          <>
            <Separator />
            <div className="py-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sair
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
