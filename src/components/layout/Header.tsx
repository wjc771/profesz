import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MobileNavigation } from "./MobileNavigation";
import { useEffect, useState } from "react";
import { LogIn, LogOut, UserCircle, Building, Search, Heart, Cog, Moon, Sun } from "lucide-react";
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
import { mockProfiles } from "@/lib/mockData";
import { initializeTheme } from "@/lib/theme";

export default function Header() {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    initializeTheme();
    const storedTheme = localStorage.getItem('theme-preference') as 'light' | 'dark' | 'system' | null;
    setTheme(storedTheme === 'dark' ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme-preference', 'light');
    }
  };

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
      
      const mockProfile = mockProfiles.find(profile => profile.id === user.id) || {
        id: user.id,
        email: user.email,
        name: user.email?.split('@')[0] || 'Usuário',
        type: 'professor',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProfileData(mockProfile);
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
            <span className="bg-primary text-primary-foreground p-1 rounded">PE</span>
            ProfeXpress
          </Link>

          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to={user ? "/dashboard" : "/"}>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Explorar
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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="mr-1"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profileData?.avatarUrl || ""} />
                      <AvatarFallback className="text-xs">
                        {profileData?.name 
                          ? profileData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() 
                          : 'U'}
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
