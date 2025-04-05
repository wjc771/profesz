
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      label: 'Início',
      icon: Home,
      href: '/',
    },
    {
      label: 'Explorar',
      icon: Search,
      href: '/explore',
    },
    {
      label: 'Adicionar',
      icon: Plus,
      href: '/add-property',
    },
    {
      label: 'Perfil',
      icon: User,
      href: '/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur md:hidden">
      <div className="grid h-16 grid-cols-4 items-center justify-items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex w-full flex-col items-center justify-center px-2 py-1",
              pathname === item.href 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
