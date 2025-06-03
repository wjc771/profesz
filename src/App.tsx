import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import MainLayout from './components/layout/MainLayout';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const PropertyManagement = lazy(() => import('./pages/PropertyManagement'));
const DemandManagement = lazy(() => import('./pages/DemandManagement'));
const MatchManagement = lazy(() => import('./pages/MatchManagement'));
const Subscription = lazy(() => import('./pages/Subscription'));
const VerificationPending = lazy(() => import('./pages/VerificationPending'));
const DatabaseSeed = lazy(() => import('./pages/DatabaseSeed'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Settings = lazy(() => import('./pages/Settings'));
const Swipe = lazy(() => import('./pages/Swipe'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const PlanoDeAula = lazy(() => import('./pages/PlanoDeAula'));
const QuestoesPage = lazy(() => import('./pages/QuestoesPage'));
const Contact = lazy(() => import('./pages/Contact'));

// Dashboard tab pages
const PlanosPage = lazy(() => import('./pages/dashboard/PlanosPage'));
const AvaliacoesPage = lazy(() => import('./pages/dashboard/AvaliacoesPage'));
const CriarAvaliacoesPage = lazy(() => import('./pages/dashboard/CriarAvaliacoesPage'));
const MateriaisPage = lazy(() => import('./pages/dashboard/MateriaisPage'));
const ComunicacaoPage = lazy(() => import('./pages/dashboard/ComunicacaoPage'));

// New pages for students and parents
const TarefasPage = lazy(() => import('./pages/dashboard/TarefasPage'));
const AjudaPage = lazy(() => import('./pages/dashboard/AjudaPage'));
const AcompanhamentoPage = lazy(() => import('./pages/dashboard/AcompanhamentoPage'));

// New dashboard pages for ProfesZ
const PlanejamentoPedagogicoPage = lazy(() => import('./pages/dashboard/PlanejamentoPedagogicoPage'));
const CentralAtividadesPage = lazy(() => import('./pages/dashboard/CentralAtividadesPage'));
const CentralCorrecaoPage = lazy(() => import('./pages/dashboard/CentralCorrecaoPage'));

// Loading component
const Loading = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// App initialization status checker
const InitCheck = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [hasProperties, setHasProperties] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkInitialData = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      // Since we're restructuring the app, let's just set this to false for now
      setHasProperties(false);
      setIsChecking(false);
      
      // Original supabase query removed to fix type errors
    };

    checkInitialData();
  }, [user]);

  if (isChecking) {
    return <Loading />;
  }

  return <>{children}</>;
};

// Layout wrapper component
const PageLayout = ({ element }: { element: React.ReactNode }) => {
  const currentPath = window.location.pathname;
  
  if (
    currentPath === '/login' || 
    currentPath === '/register' || 
    currentPath === '/'
  ) {
    return <>{element}</>;
  }
  
  return <MainLayout>{element}</MainLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <InitCheck>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<PageLayout element={<Contact />} />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<PageLayout element={<Dashboard />} />} />
              <Route path="/dashboard/planejamento" element={<PageLayout element={<PlanejamentoPedagogicoPage />} />} />
              <Route path="/dashboard/atividades" element={<PageLayout element={<CentralAtividadesPage />} />} />
              <Route path="/dashboard/atividades/criar" element={<PageLayout element={<CriarAvaliacoesPage />} />} />
              <Route path="/dashboard/correcao" element={<PageLayout element={<CentralCorrecaoPage />} />} />
              <Route path="/dashboard/comunicacao" element={<PageLayout element={<ComunicacaoPage />} />} />
              
              {/* Legacy redirects */}
              <Route path="/dashboard/planos" element={<Navigate to="/dashboard/planejamento" replace />} />
              <Route path="/dashboard/avaliacoes" element={<Navigate to="/dashboard/atividades" replace />} />
              <Route path="/dashboard/materiais" element={<Navigate to="/dashboard/correcao" replace />} />
              
              {/* New routes for students and parents */}
              <Route path="/dashboard/tarefas" element={<PageLayout element={<TarefasPage />} />} />
              <Route path="/dashboard/ajuda" element={<PageLayout element={<AjudaPage />} />} />
              <Route path="/dashboard/acompanhamento" element={<PageLayout element={<AcompanhamentoPage />} />} />
              
              {/* Redirect /questoes to /dashboard/questoes */}
              <Route path="/questoes" element={<Navigate to="/dashboard/questoes" replace />} />
              
              {/* Other Routes */}
              <Route path="/plano-de-aula" element={<PageLayout element={<PlanoDeAula />} />} />
              <Route path="/profile" element={<PageLayout element={<Profile />} />} />
              <Route path="/property/:id" element={<PageLayout element={<PropertyDetails />} />} />
              <Route path="/property-management" element={<PageLayout element={<PropertyManagement />} />} />
              <Route path="/demand-management" element={<PageLayout element={<DemandManagement />} />} />
              <Route path="/demands" element={<PageLayout element={<DemandManagement />} />} />
              <Route path="/matches/:demandId" element={<PageLayout element={<MatchManagement />} />} />
              <Route path="/subscription" element={<PageLayout element={<Subscription />} />} />
              <Route path="/verification-pending" element={<PageLayout element={<VerificationPending />} />} />
              <Route path="/database-seed" element={<PageLayout element={<DatabaseSeed />} />} />
              <Route path="/settings" element={<PageLayout element={<Settings />} />} />
              <Route path="/swipe" element={<PageLayout element={<Swipe />} />} />
              <Route path="/onboarding" element={<PageLayout element={<Onboarding />} />} />
              <Route path="*" element={<PageLayout element={<NotFound />} />} />
            </Routes>
          </InitCheck>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
