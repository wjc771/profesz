
import { ReactNode } from 'react';
import Header from './Header';
import MobileNavigation from './MobileNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-4 pb-20 md:pb-4">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
