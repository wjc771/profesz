
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { QuestoesForm } from '@/components/questoes/QuestoesForm';
import { SubscriptionPlanType } from '@/types/profile';
import { TabNavigation } from '@/components/dashboard/TabNavigation';
import { FileText } from 'lucide-react';

export default function QuestoesPage() {
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
          .eq('activity_type', 'questoes')
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Criar Questões
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Gere questões personalizadas para suas provas, quizzes e listas de exercícios
        </p>
      </div>
      
      {/* Tab Navigation */}
      <TabNavigation />
      
      {/* Main Content */}
      <div className="bg-card/30 rounded-lg p-6 shadow-sm">
        <Card className="border shadow-md">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="flex items-center justify-between">
              <span>Criar Novas Questões</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <QuestoesForm 
              plano={plano} 
              usageCount={usageCount} 
              usageLimit={usageLimit} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
