
import { SubscriptionPlanType } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AvaliacaoFormHeaderProps {
  plano: SubscriptionPlanType;
  usageCount: number;
  usageLimit: number | null;
}

export function AvaliacaoFormHeader({ plano, usageCount, usageLimit }: AvaliacaoFormHeaderProps) {
  const getPlanLabel = () => {
    switch (plano) {
      case 'inicial':
        return 'ProfeXpress Inicial';
      case 'essencial':
        return 'ProfeXpress Essencial';
      case 'maestro':
        return 'ProfeXpress Maestro';
      case 'institucional':
        return 'ProfeXpress Institucional';
      default:
        return 'ProfeXpress';
    }
  };
  
  const getUsageLabel = () => {
    if (usageLimit === null) {
      return 'Geração ilimitada' + (plano === 'institucional' ? ' com recursos personalizados' : '');
    }
    
    return `${usageCount}/${usageLimit} questões restantes este mês`;
  };
  
  const calculateProgressPercentage = () => {
    if (usageLimit === null) return 0;
    return Math.min((usageCount / usageLimit) * 100, 100);
  };
  
  return (
    <Card className="mb-6 bg-muted/40">
      <CardContent className="py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-semibold text-lg">{getPlanLabel()}</h3>
            <p className="text-sm text-muted-foreground">{getUsageLabel()}</p>
          </div>
          
          {usageLimit !== null && (
            <div className="w-full md:w-1/3">
              <Progress value={calculateProgressPercentage()} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
