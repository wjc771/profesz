import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockProfiles } from "@/lib/mockData";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function SimpleHeader() {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      className={cn(
        "sticky top-0 z-40 bg-background transition-all",
        isScrolled ? "shadow-md" : ""
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-lg font-bold">
            PZ
          </span>
          {!isMobile && (
            <span className="font-semibold text-xl">ProfesZ</span>
          )}
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} profileData={profileData} signOut={signOut} />
        </div>
      </div>
    </header>
  );
}
