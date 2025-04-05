
import { ReactNode } from 'react';
import Header from './Header';
import { MobileNavigation } from './MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className={`flex-1 ${isMobile ? 'pb-20' : 'py-6'}`}>
        <div className="container mobile-container max-w-6xl">
          {children}
        </div>
      </main>
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
