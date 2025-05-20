
import { SubscriptionPlanType } from "@/types/profile";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuestoesFormHeaderProps {
  plano: SubscriptionPlanType;
  usageCount: number;
  usageLimit: number | null;
}

export function QuestoesFormHeader({ plano, usageCount, usageLimit }: QuestoesFormHeaderProps) {
  // Determine message based on plan
  const getLimitMessage = () => {
    if (usageLimit === null) {
      return "Geração ilimitada de questões";
    }
    
    const remaining = usageLimit - usageCount;
    return `${remaining}/${usageLimit} questões restantes este mês`;
  };
  
  // Warning if close to limit
  const isCloseToLimit = usageLimit !== null && (usageLimit - usageCount < usageLimit * 0.2);
  const isPlanUnlimited = usageLimit === null;
  
  // Calculate progress percentage
  const progressPercentage = usageLimit ? Math.min(100, (usageCount / usageLimit) * 100) : 0;
  
  return (
    <div className="p-6 border-b">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex items-center gap-3">
          <PlanIndicator plan={plano} />
          <div className="h-6 w-px bg-border hidden md:block" />
          <div className="font-medium flex items-center gap-1.5">
            {isPlanUnlimited ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <span className={`h-2 w-2 rounded-full ${isCloseToLimit ? 'bg-orange-500' : 'bg-green-500'}`} />
            )}
            <span className={`${isCloseToLimit ? 'text-orange-500' : ''}`}>
              {getLimitMessage()}
            </span>
          </div>
        </div>
      </div>
      
      {!isPlanUnlimited && (
        <div className="mt-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {usageCount} de {usageLimit} questões utilizadas
          </p>
        </div>
      )}
      
      {isCloseToLimit && (
        <Alert variant="warning" className="mt-4 bg-amber-50 border-amber-200 text-amber-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Você está próximo do limite mensal de questões. Considere atualizar seu plano para continuar gerando mais questões.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
