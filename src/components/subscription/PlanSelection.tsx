
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
  compact?: boolean;
  showAllFeatures?: boolean;
}

const PlanSelection = ({ 
  plans, 
  currentPlanId, 
  onSelectPlan, 
  isProcessing = false, 
  compact = false,
  showAllFeatures = false
}: PlanSelectionProps) => {
  return (
    <div className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
      {plans.map((plan) => (
        <Card key={plan.id} className={`plan-card flex flex-col ${plan.recommended ? 'border-primary ring-1 ring-primary' : ''}`}>
          <CardHeader className={`space-y-1 ${compact ? 'pb-2' : 'pb-4'}`}>
            {plan.recommended && (
              <Badge className="w-fit mb-2 bg-primary hover:bg-primary">Recomendado</Badge>
            )}
            <CardTitle className={compact ? "text-xl" : "text-2xl"}>{plan.name}</CardTitle>
            <div>
              <span className={compact ? "text-2xl font-bold" : "text-3xl font-bold"}>
                {plan.id === "professor" || plan.id === "estudante" || plan.id === "familia" 
                  ? "R$ 0,90" 
                  : plan.price}
              </span>
              {plan.price !== 'Grátis' && plan.price !== 'Personalizado' && <span className="text-muted-foreground text-sm ml-1">/mês</span>}
            </div>
            <CardDescription className="line-clamp-2 h-10">{plan.description}</CardDescription>
            {plan.bestFor && (
              <p className="text-xs text-muted-foreground mt-1">
                Ideal para: {plan.bestFor}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 my-2">
              {(showAllFeatures ? plan.features : plan.features.slice(0, compact ? 4 : 6)).map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground opacity-30 shrink-0 mt-0.5" />
                  )}
                  <div className={`${feature.included ? '' : 'text-muted-foreground opacity-70'} text-sm`}>
                    <span className={feature.included ? '' : 'line-through'}>
                      {feature.name}
                    </span>
                    {feature.details && feature.included && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="inline-block h-3 w-3 ml-1 text-muted-foreground cursor-help" />
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
              
              {!showAllFeatures && plan.features.length > (compact ? 4 : 6) && (
                <li className="text-xs text-muted-foreground">
                  +{plan.features.length - (compact ? 4 : 6)} recursos adicionais
                </li>
              )}
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
                    ? "Ver serviços avulsos"
                    : plan.id === "instituicao"
                      ? "Solicitar demonstração"
                      : "Escolher plano"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PlanSelection;
