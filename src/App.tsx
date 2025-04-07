
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerificationPending from "./pages/VerificationPending";
import Profile from "./pages/Profile";
import UserSettings from "./pages/UserSettings";
import Subscription from "./pages/Subscription";
import LandingPage from "./pages/LandingPage";
import PropertyPreferences from "./pages/PropertyPreferences";
import PropertyManagement from "./pages/PropertyManagement";
import PropertyForm from "./pages/PropertyForm";
import PropertyDetails from "./pages/PropertyDetails";
import DemandManagement from "./pages/DemandManagement";
import DemandForm from "./pages/DemandForm";
import MatchManagement from "./pages/MatchManagement";
import { AuthProvider, AuthRequired } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/dashboard" element={<AuthRequired><Dashboard /></AuthRequired>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            <Route path="/profile" element={<AuthRequired><Profile /></AuthRequired>} />
            <Route path="/settings" element={<AuthRequired><UserSettings /></AuthRequired>} />
            <Route path="/subscription" element={<AuthRequired><Subscription /></AuthRequired>} />
            <Route path="/property-preferences" element={<AuthRequired><PropertyPreferences /></AuthRequired>} />
            
            {/* Rotas CRUD para Propriedades */}
            <Route path="/properties" element={<AuthRequired><PropertyManagement /></AuthRequired>} />
            <Route path="/property/new" element={<AuthRequired><PropertyForm /></AuthRequired>} />
            <Route path="/property/edit/:id" element={<AuthRequired><PropertyForm /></AuthRequired>} />
            <Route path="/property/:id" element={<AuthRequired><PropertyDetails /></AuthRequired>} />
            
            {/* Rotas CRUD para Demandas */}
            <Route path="/demands" element={<AuthRequired><DemandManagement /></AuthRequired>} />
            <Route path="/demand/new" element={<AuthRequired><DemandForm /></AuthRequired>} />
            <Route path="/demand/edit/:id" element={<AuthRequired><DemandForm /></AuthRequired>} />
            
            {/* Rota para Gerenciamento de Matches */}
            <Route path="/matches" element={<AuthRequired><MatchManagement /></AuthRequired>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
