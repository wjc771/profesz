import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AvaliacaoForm } from '@/components/avaliacao/AvaliacaoForm';
import { SubscriptionPlanType } from '@/types/profile';
import { DebugBlocker } from '@/components/avaliacao/DebugBlocker';
import { Star } from 'lucide-react';

export default function CriarAvaliacoesPage() {
  const { user } = useAuth();
  const [plano, setPlano] = useState<SubscriptionPlanType>('inicial');
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState<number | null>(25); // Default for inicial plan
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch user profile information including plan
    const fetchProfileInfo = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_plan_id')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (profile) {
          setPlano(profile.subscription_plan_id as SubscriptionPlanType);
          
          // Set limits based on plan
          switch (profile.subscription_plan_id) {
            case 'inicial':
              setUsageLimit(25);
              break;
            case 'essencial':
              setUsageLimit(100);
              break;
            case 'maestro':
            case 'institucional':
              setUsageLimit(null); // Unlimited
              break;
            default:
              setUsageLimit(25);
          }
        }
        
        // Fetch usage statistics
        const { data: activity, error: activityError } = await supabase
          .from('user_activity')
          .select('activity_count')
          .eq('user_id', user.id)
          .eq('activity_type', 'avaliacoes')
          .single();
        
        if (activityError && activityError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw activityError;
        }
        
        setUsageCount(activity?.activity_count || 0);
        
      } catch (error: any) {
        console.error('Error fetching profile information:', error);
        toast({
          title: "Erro ao carregar informações",
          description: "Não foi possível carregar suas informações de perfil.",
          variant: "destructive",
        });
      }
    };
    
    fetchProfileInfo();
  }, [user, toast]);
  
  return (
    <>
      <DebugBlocker />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
            <Star className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Criar Avaliação
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-lg">
            Gere provas, quizzes e listas de exercícios personalizados em minutos
          </p>
        </div>
        
        <AvaliacaoForm 
          plano={plano} 
          usageCount={usageCount} 
          usageLimit={usageLimit} 
        />
      </div>
    </>
  );
}
