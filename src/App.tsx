
import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import { supabase } from './integrations/supabase/client';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
// const PropertyForm = lazy(() => import('./pages/PropertyForm')); // REMOVIDO!
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const PropertyManagement = lazy(() => import('./pages/PropertyManagement'));
const DemandForm = lazy(() => import('./pages/DemandForm'));
const DemandManagement = lazy(() => import('./pages/DemandManagement'));
const MatchManagement = lazy(() => import('./pages/MatchManagement'));
const Subscription = lazy(() => import('./pages/Subscription'));
const VerificationPending = lazy(() => import('./pages/VerificationPending'));
const DatabaseSeed = lazy(() => import('./pages/DatabaseSeed'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PropertyPreferences = lazy(() => import('./pages/PropertyPreferences'));
const Settings = lazy(() => import('./pages/Settings'));
const Swipe = lazy(() => import('./pages/Swipe'));

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

      try {
        // Check if there are any properties in the database
        const { count, error } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        
        setHasProperties(count !== null && count > 0);
      } catch (error) {
        console.error('Error checking initial data:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkInitialData();
  }, [user]);

  if (isChecking) {
    return <Loading />;
  }

  return <>{children}</>;
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/property/new" element={<PropertyForm />} /> */}
              {/* <Route path="/property/edit/:id" element={<PropertyForm />} /> */}
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/property-management" element={<PropertyManagement />} />
              <Route path="/demand/new" element={<DemandForm />} />
              <Route path="/demand/edit/:id" element={<DemandForm />} />
              <Route path="/demand-management" element={<DemandManagement />} />
              <Route path="/demands" element={<DemandManagement />} />
              <Route path="/matches/:demandId" element={<MatchManagement />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/verification-pending" element={<VerificationPending />} />
              <Route path="/database-seed" element={<DatabaseSeed />} />
              <Route path="/property-preferences" element={<PropertyPreferences />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/swipe" element={<Swipe />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </InitCheck>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
