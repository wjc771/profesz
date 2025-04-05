
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type PlanFeature, type Plan } from "@/data/plans";

interface PlanSelectionProps {
  plans: Plan[];
  currentPlanId?: string;
  onSelectPlan: (planId: string) => void;
  isProcessing?: boolean;
}

const PlanSelection = ({ plans, currentPlanId, onSelectPlan, isProcessing = false }: PlanSelectionProps) => {
  // Helper to format limit display
  const formatLimit = (limit: number | null): string => {
    if (limit === null) return "Não disponível";
    if (limit === -1) return "Ilimitado";
    return limit.toString();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <Card key={plan.id} className={`plan-card ${plan.recommended ? 'border-primary ring-1 ring-primary' : ''}`}>
          <CardHeader className="space-y-1 pb-2">
            {plan.recommended && (
              <Badge className="w-fit mb-2 bg-primary hover:bg-primary">Recomendado</Badge>
            )}
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div>
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.price !== 'Grátis' && plan.price !== 'Personalizado' && <span className="text-muted-foreground">/mês</span>}
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-medium">Limites do plano:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anúncios:</span>
                  <span className="font-medium">{formatLimit(plan.limits.activeListings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buscas:</span>
                  <span className="font-medium">{formatLimit(plan.limits.activeSearches)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Matches/mês:</span>
                  <span className="font-medium">{formatLimit(plan.limits.matchesPerMonth)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contatos/mês:</span>
                  <span className="font-medium">{formatLimit(plan.limits.contactsPerMonth)}</span>
                </div>
              </div>
            </div>
            
            <h4 className="text-sm font-medium mb-2">Recursos inclusos:</h4>
            <ul className="space-y-2 my-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground opacity-30 shrink-0 mt-0.5" />
                  )}
                  <div className={feature.included ? '' : 'text-muted-foreground opacity-70'}>
                    <span className={feature.included ? '' : 'line-through'}>
                      {feature.name}
                    </span>
                    {feature.details && feature.included && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="inline-block h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{feature.details}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onSelectPlan(plan.id)}
              variant={currentPlanId === plan.id ? "outline" : plan.recommended ? "default" : "outline"}
              className="w-full"
              disabled={currentPlanId === plan.id || isProcessing}
            >
              {currentPlanId === plan.id 
                ? "Plano atual" 
                : plan.id === "free" && !currentPlanId 
                  ? "Começar grátis" 
                  : plan.id === "custom"
                    ? "Fale conosco"
                    : "Escolher plano"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PlanSelection;
