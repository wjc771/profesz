
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, UserCircle, Building, Cog, Settings } from "lucide-react";
import { MobileNavigation } from "./MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

type UserMenuProps = {
  user: any;
  profileData: any;
  signOut: () => void;
};

export function UserMenu({ user, profileData, signOut }: UserMenuProps) {
  const isMobile = useIsMobile();

  if (user) {
    return (
      <>
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="mr-1" title="Configurações">
            <Settings size={20} />
          </Button>
        </Link>
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
    );
  }

  // Guest
  return (
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
      <MobileNavigation />
    </>
  );
}
