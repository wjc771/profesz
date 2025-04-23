
import { useEffect, useState } from "react";
import { PlanoDeAulaForm } from "@/components/plano/PlanoDeAulaForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlanType } from "@/types/profile";
import { CircleCheck, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PlanoDeAula() {
  const { user } = useAuth();
  const [plano, setPlano] = useState<SubscriptionPlanType>("inicial");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserPlanAndUsage() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        // Get user's plan
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_plan_id')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }
        
        if (profile?.subscription_plan_id) {
          setPlano(profile.subscription_plan_id as SubscriptionPlanType);
          
          // Get plan limits
          const { data: planFeatures, error: planError } = await supabase
            .from('plan_features')
            .select('usage_limit')
            .eq('plan_id', profile.subscription_plan_id)
            .eq('feature_name', 'planos_de_aula')
            .single();
            
          if (planError) {
            throw planError;
          }
          
          if (planFeatures) {
            setUsageLimit(planFeatures.usage_limit || 0);
          }
          
          // Get usage from user_activity
          const { data: activity, error: activityError } = await supabase
            .from('user_activity')
            .select('activity_count')
            .eq('user_id', user.id)
            .eq('activity_type', 'planos_de_aula')
            .single();
            
          if (activityError && activityError.code !== 'PGRST116') { // Not found is OK
            throw activityError;
          }
          
          if (activity) {
            setUsageCount(activity.activity_count || 0);
          }
        }
      } catch (err: any) {
        console.error('Error fetching plan info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPlanAndUsage();
  }, [user]);

  // Check if user has reached their plan limit
  const hasReachedLimit = usageLimit > 0 && usageCount >= usageLimit;

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-3 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-3">
        <Alert variant="destructive" className="max-w-3xl mx-auto mb-6">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Erro ao carregar informações do plano</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os detalhes do seu plano. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  if (hasReachedLimit) {
    return (
      <div className="min-h-screen bg-background py-8 px-3">
        <div className="max-w-3xl mx-auto">
          <Alert className="mb-6">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Limite de planos atingido</AlertTitle>
            <AlertDescription>
              Você atingiu o limite de {usageLimit} planos de aula para o seu plano atual ({plano}).
              Para criar mais planos de aula, considere fazer um upgrade para um plano superior.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
            <Button variant="outline" onClick={() => navigate('/subscription')}>Ver Planos</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-3">
      {!hasReachedLimit && usageLimit > 0 && (
        <Alert className="max-w-3xl mx-auto mb-6" variant={usageCount >= usageLimit * 0.8 ? "destructive" : "default"}>
          <CircleCheck className="h-4 w-4" />
          <AlertTitle>Uso do seu plano</AlertTitle>
          <AlertDescription>
            Você utilizou {usageCount} de {usageLimit} planos de aula disponíveis neste mês.
          </AlertDescription>
        </Alert>
      )}
      <PlanoDeAulaForm 
        plano={plano} 
        usageCount={usageCount}
        usageLimit={usageLimit}
      />
    </div>
  );
}
