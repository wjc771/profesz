
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanOption {
  id: string;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
}

interface PlanSelectionProps {
  plans: PlanOption[];
  currentPlanId?: string;
  onSelectPlan: (planId: string) => void;
}

const PlanSelection = ({ plans, currentPlanId, onSelectPlan }: PlanSelectionProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id} className={`plan-card ${plan.recommended ? 'border-primary ring-1 ring-primary' : ''}`}>
          <CardHeader className="space-y-1 pb-2">
            {plan.recommended && (
              <Badge className="w-fit mb-2 bg-primary hover:bg-primary">Recomendado</Badge>
            )}
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div>
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.price !== 'Grátis' && <span className="text-muted-foreground">/mês</span>}
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 my-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className={`h-5 w-5 ${feature.included ? 'text-primary' : 'text-muted-foreground opacity-30'}`} />
                  <span className={feature.included ? '' : 'text-muted-foreground line-through opacity-70'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onSelectPlan(plan.id)}
              variant={currentPlanId === plan.id ? "outline" : plan.recommended ? "default" : "outline"}
              className="w-full"
              disabled={currentPlanId === plan.id}
            >
              {currentPlanId === plan.id 
                ? "Plano atual" 
                : plan.id === "free" && !currentPlanId 
                  ? "Começar grátis" 
                  : "Escolher plano"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PlanSelection;
