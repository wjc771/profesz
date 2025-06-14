
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockProfiles } from "@/lib/mockData";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavigation } from "./HeaderNavigation";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export default function Header() {
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
      className={`sticky top-0 z-50 bg-background transition-all ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <HeaderLogo user={user} />
          <HeaderNavigation user={user} isMobile={isMobile} />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} profileData={profileData} signOut={signOut} />
        </div>
      </div>
    </header>
  );
}
