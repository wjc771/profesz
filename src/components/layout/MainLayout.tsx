
import { ReactNode } from 'react';
import { SimpleHeader } from './SimpleHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Verificar se está em página do dashboard
  const isDashboard = location.pathname.startsWith('/dashboard');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SimpleHeader />
      <main className={cn(
        "flex-1 overflow-x-hidden",
        isMobile && isDashboard ? 'pb-20 pt-4' : 'py-8'
      )}>
        <div className="container max-w-6xl px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </main>
      {isMobile && isDashboard && <MobileBottomNav />}
    </div>
  );
};

export default MainLayout;
