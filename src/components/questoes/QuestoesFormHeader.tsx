
import { SubscriptionPlanType } from "@/types/profile";
import { PlanIndicator } from "@/components/dashboard/PlanIndicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <PlanIndicator plan={plano} />
        <div className="text-sm font-medium">
          {getLimitMessage()}
        </div>
      </div>
      
      {isCloseToLimit && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Você está quase atingindo seu limite mensal de questões. Considere atualizar seu plano para continuar gerando mais questões.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
