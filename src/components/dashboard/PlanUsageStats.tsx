
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, MessageSquare, FileText, Settings } from "lucide-react";

interface UsageStats {
  planos_de_aula: number;
  comunicador: number;
  adaptador_materiais: number;
}

interface PlanLimit {
  feature_name: string;
  usage_limit: number;
}

export function PlanUsageStats() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageStats>({
    planos_de_aula: 0,
    comunicador: 0,
    adaptador_materiais: 0
  });
  const [planLimits, setPlanLimits] = useState<PlanLimit[]>([]);
  const [planName, setPlanName] = useState<string>("");

  useEffect(() => {
    async function fetchPlanInfo() {
      if (!user?.id) return;
      
      // Get user's profile to know their plan
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan_id')
        .eq('id', user.id)
        .single();

      if (profile?.subscription_plan_id) {
        setPlanName(formatPlanName(profile.subscription_plan_id));
        
        // Get plan limits
        const { data: limits } = await supabase
          .from('plan_features')
          .select('feature_name, usage_limit')
          .eq('plan_id', profile.subscription_plan_id);
          
        if (limits) setPlanLimits(limits);
      }

      // Get usage from user_activity
      const { data: activities } = await supabase
        .from('user_activity')
        .select('activity_type, activity_count')
        .eq('user_id', user.id);

      if (activities) {
        const usageMap = activities.reduce((acc, curr) => ({
          ...acc,
          [curr.activity_type]: curr.activity_count
        }), {} as UsageStats);
        
        setUsage(usageMap);
      }
    }

    fetchPlanInfo();
  }, [user]);

  const formatPlanName = (plan: string) => {
    const names = {
      'inicial': 'Plano Inicial',
      'essencial': 'Plano Essencial',
      'maestro': 'Plano Maestro',
      'institucional': 'Plano Institucional'
    };
    return names[plan as keyof typeof names] || plan;
  };

  const getUsagePercentage = (feature: string) => {
    const limit = planLimits.find(p => p.feature_name === feature)?.usage_limit;
    const used = usage[feature as keyof UsageStats] || 0;
    
    if (!limit || limit < 0) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getLimitText = (feature: string) => {
    const limit = planLimits.find(p => p.feature_name === feature)?.usage_limit;
    const used = usage[feature as keyof UsageStats] || 0;
    
    if (!limit || limit < 0) return `${used} (Ilimitado)`;
    return `${used} de ${limit}`;
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          {planName}
        </CardTitle>
        <CardDescription>
          Utilização do seu plano no mês atual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Planos de Aula</span>
            </div>
            <span className="text-muted-foreground">{getLimitText('planos_de_aula')}</span>
          </div>
          <Progress value={getUsagePercentage('planos_de_aula')} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Comunicados</span>
            </div>
            <span className="text-muted-foreground">{getLimitText('comunicador')}</span>
          </div>
          <Progress value={getUsagePercentage('comunicador')} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Materiais Adaptados</span>
            </div>
            <span className="text-muted-foreground">{getLimitText('adaptador_materiais')}</span>
          </div>
          <Progress value={getUsagePercentage('adaptador_materiais')} />
        </div>
      </CardContent>
    </Card>
  );
}
