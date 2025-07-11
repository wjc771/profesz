
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlanType } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AvaliacoesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Avaliações</h1>
          <p className="text-muted-foreground">
            Gere provas, quizzes e listas de exercícios personalizados em minutos
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/avaliacoes/criar')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Criar Avaliação
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Minhas Avaliações</CardTitle>
          <CardDescription>
            Visualize e gerencie suas avaliações anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Você ainda não criou nenhuma avaliação
            </p>
            <Button 
              onClick={() => navigate('/dashboard/avaliacoes/criar')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar Minha Primeira Avaliação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
