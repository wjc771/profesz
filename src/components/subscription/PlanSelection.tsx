
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Info, Users, Image, Video, Crown, BarChart } from "lucide-react";
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
  // Helper to format limit display
  const formatLimit = (limit: number | null | undefined): string => {
    if (limit === undefined || limit === null) return "Não disponível";
    if (limit === -1) return "Ilimitado";
    return limit.toString();
  };

  // Helper to get appropriate icon for a feature
  const getFeatureIcon = (feature: string) => {
    if (feature.includes("usuário") || feature.includes("equipe")) return Users;
    if (feature.includes("foto") || feature.includes("mídia")) return Image;
    if (feature.includes("vídeo")) return Video;
    if (feature.includes("premium") || feature.includes("destaque")) return Crown;
    if (feature.includes("analytics") || feature.includes("estatística")) return BarChart;
    return Info;
  };

  // Ensure each plan has limits object defined to prevent runtime errors
  const safeGetLimits = (plan: Plan) => {
    return plan.limits || { 
      activeListings: null, 
      activeSearches: null, 
      matchesPerMonth: null,
      contactsPerMonth: null
    };
  };

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
              <span className={compact ? "text-2xl font-bold" : "text-3xl font-bold"}>{plan.price}</span>
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
            {plan.id !== 'custom' && !compact && (
              <div className="mb-4 space-y-2">
                <h4 className="text-sm font-medium">Limites do plano:</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Anúncios:</span>
                    <span className="font-medium">{formatLimit(safeGetLimits(plan).activeListings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buscas:</span>
                    <span className="font-medium">{formatLimit(safeGetLimits(plan).activeSearches)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matches/mês:</span>
                    <span className="font-medium">{formatLimit(safeGetLimits(plan).matchesPerMonth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contatos/mês:</span>
                    <span className="font-medium">{formatLimit(safeGetLimits(plan).contactsPerMonth)}</span>
                  </div>
                  
                  {safeGetLimits(plan).photosPerListing !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fotos/imóvel:</span>
                      <span className="font-medium">{formatLimit(safeGetLimits(plan).photosPerListing)}</span>
                    </div>
                  )}
                  
                  {safeGetLimits(plan).videosPerListing !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vídeos/imóvel:</span>
                      <span className="font-medium">{formatLimit(safeGetLimits(plan).videosPerListing)}</span>
                    </div>
                  )}
                  
                  {safeGetLimits(plan).highlightsPerWeek !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destaques/sem:</span>
                      <span className="font-medium">{formatLimit(safeGetLimits(plan).highlightsPerWeek)}</span>
                    </div>
                  )}
                  
                  {safeGetLimits(plan).teamMembers !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usuários:</span>
                      <span className="font-medium">{formatLimit(safeGetLimits(plan).teamMembers)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <h4 className="text-sm font-medium mb-2">{plan.id === 'custom' ? 'Serviços disponíveis:' : 'Recursos inclusos:'}</h4>
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
                    : "Escolher plano"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PlanSelection;
