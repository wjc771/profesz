
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const PropertyForm = lazy(() => import('./pages/PropertyForm'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const PropertyManagement = lazy(() => import('./pages/PropertyManagement'));
const DemandForm = lazy(() => import('./pages/DemandForm'));
const DemandManagement = lazy(() => import('./pages/DemandManagement'));
const MatchManagement = lazy(() => import('./pages/MatchManagement'));
const Subscription = lazy(() => import('./pages/Subscription'));
const VerificationPending = lazy(() => import('./pages/VerificationPending'));
const DatabaseSeed = lazy(() => import('./pages/DatabaseSeed'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const Loading = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/property/new" element={<PropertyForm />} />
            <Route path="/property/edit/:id" element={<PropertyForm />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/property-management" element={<PropertyManagement />} />
            <Route path="/demand/new" element={<DemandForm />} />
            <Route path="/demand/edit/:id" element={<DemandForm />} />
            <Route path="/demand-management" element={<DemandManagement />} />
            <Route path="/matches/:demandId" element={<MatchManagement />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            <Route path="/database-seed" element={<DatabaseSeed />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
