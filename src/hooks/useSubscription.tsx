
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Plan, plans } from "@/data/plans";
import { toast } from "@/hooks/use-toast";

interface SubscriptionContextType {
  currentPlan: Plan | null;
  isLoading: boolean;
  usageLimits: {
    activeListings: { used: number; total: number };
    activeSearches: { used: number; total: number };
    matchesThisMonth: { used: number; total: number };
    contactsThisMonth: { used: number; total: number };
  };
  upgradePlan: (planId: string) => Promise<void>;
}

// Define the Profile type that matches our Supabase table
interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  type: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  subscription_plan_id: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usageLimits, setUsageLimits] = useState({
    activeListings: { used: 0, total: 1 },
    activeSearches: { used: 0, total: 1 },
    matchesThisMonth: { used: 0, total: 3 },
    contactsThisMonth: { used: 0, total: 0 },
  });

  // Load user's subscription data
  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    } else {
      setCurrentPlan(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch profile data which includes subscription plan
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      
      // Set current plan
      const userPlan = plans.find(p => p.id === (profile.subscription_plan_id || 'free'));
      setCurrentPlan(userPlan || plans[0]);  // Default to free plan
      
      // Fetch usage statistics
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();
      
      // Active listings
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', user?.id)
        .eq('is_active', true);
      
      if (propertiesError) throw propertiesError;
      
      // Active searches
      const { data: searches, error: searchesError } = await supabase
        .from('property_demands')
        .select('id')
        .eq('user_id', user?.id)
        .eq('is_active', true);
      
      if (searchesError) throw searchesError;
      
      // Matches this month
      const { data: matches, error: matchesError } = await supabase
        .from('property_matches')
        .select('id, demand_id, property_demands!inner(user_id)')
        .eq('property_demands.user_id', user?.id)
        .gte('created_at', firstDayOfMonth)
        .lte('created_at', lastDayOfMonth);
      
      if (matchesError) throw matchesError;
      
      // Contacts this month (not implemented yet, placeholder)
      const contactsUsed = 0;
      
      // Update usage limits
      setUsageLimits({
        activeListings: { 
          used: properties?.length || 0, 
          total: userPlan?.limits.activeListings === -1 ? Infinity : (userPlan?.limits.activeListings || 1) 
        },
        activeSearches: { 
          used: searches?.length || 0, 
          total: userPlan?.limits.activeSearches === -1 ? Infinity : (userPlan?.limits.activeSearches || 1) 
        },
        matchesThisMonth: { 
          used: matches?.length || 0, 
          total: userPlan?.limits.matchesPerMonth === -1 ? Infinity : (userPlan?.limits.matchesPerMonth || 3) 
        },
        contactsThisMonth: { 
          used: contactsUsed, 
          total: userPlan?.limits.contactsPerMonth === -1 ? Infinity : (userPlan?.limits.contactsPerMonth || 0) 
        }
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados da assinatura"
      });
      setIsLoading(false);
    }
  };

  const upgradePlan = async (planId: string) => {
    try {
      if (!user) throw new Error("Usuário não autenticado");
      
      // In a real app, this would connect to a payment processor
      // For now, we'll just update the user's plan in the database

      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan_id: planId })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refetch subscription data to update state
      await fetchSubscriptionData();
      
      toast({
        title: "Plano atualizado",
        description: "Seu plano foi atualizado com sucesso"
      });
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o plano"
      });
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      currentPlan,
      isLoading,
      usageLimits,
      upgradePlan
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
