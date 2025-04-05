
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AuthProvider, AuthRequired } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<AuthRequired><Index /></AuthRequired>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            <Route path="/profile" element={<AuthRequired><Profile /></AuthRequired>} />
            <Route path="/settings" element={<AuthRequired><UserSettings /></AuthRequired>} />
            <Route path="/subscription" element={<AuthRequired><Subscription /></AuthRequired>} />
            <Route path="/property-preferences" element={<AuthRequired><PropertyPreferences /></AuthRequired>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
