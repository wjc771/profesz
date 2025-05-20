
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
      <main className={`flex-1 overflow-x-hidden ${isMobile ? 'pb-24 pt-6' : 'py-8'}`}>
        <div className="container max-w-6xl px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </main>
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default MainLayout;
