import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MobileNavigation } from "./MobileNavigation";
import { useEffect, useState } from "react";
import { LogIn, LogOut, UserCircle, Building, Search, Heart, Cog } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export default function Header() {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  return (
    <header
      className={`sticky top-0 z-50 bg-background transition-all ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to={user ? "/dashboard" : "/"} className="font-bold text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground p-1 rounded">MI</span>
            MatchImobiliário
          </Link>

          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to={user ? "/swipe" : "/"}>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Swipe
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {user && (
                  <>
                    <NavigationMenuItem>
                      <Link to="/dashboard">
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                          Dashboard
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to="/property-preferences">
                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                          Perfil de Busca
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Mais</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4">
                          <li>
                            <Link to="/subscription">
                              <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">
                                  <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4" />
                                    Assinatura
                                  </div>
                                </div>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {!isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profileData?.avatar_url || ""} />
                        <AvatarFallback className="text-xs">
                          {profileData?.name ? profileData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link to="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/settings">
                      <DropdownMenuItem className="cursor-pointer">
                        <Cog className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <Building className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/property-preferences">
                      <DropdownMenuItem className="cursor-pointer">
                        <Search className="mr-2 h-4 w-4" />
                        <span>Perfil de Busca</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          ) : (
            <>
              {!isMobile && (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Cadastrar</Button>
                  </Link>
                </>
              )}
            </>
          )}
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
