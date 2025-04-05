
import { useSubscription } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Crown, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionOverview() {
  const { currentPlan, isLoading, usageLimits } = useSubscription();

  // Helper to format limit display
  const formatLimit = (limit: number): string => {
    if (limit === Infinity || limit === -1) return "∞";
    return limit.toString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando dados da assinatura...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!currentPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados da assinatura indisponíveis</CardTitle>
          <CardDescription>Faça login para ver os dados da sua assinatura</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Plano {currentPlan.name}
              {currentPlan.id !== 'free' && (
                <Crown className="h-5 w-5 text-yellow-500" />
              )}
            </CardTitle>
            <CardDescription>
              {currentPlan.price === 'Grátis' 
                ? 'Plano gratuito com recursos básicos' 
                : `${currentPlan.price}/mês - ${currentPlan.description}`
              }
            </CardDescription>
          </div>
          <Link to="/subscription">
            <Button variant={currentPlan.id === 'free' ? 'default' : 'outline'} size="sm">
              {currentPlan.id === 'free' ? 'Assinar Plano Pago' : 'Gerenciar Assinatura'}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1 text-sm">
            <div className="flex items-center gap-1">
              <span>Imóveis Ativos</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Número de imóveis que você pode anunciar simultaneamente</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>
              {usageLimits.activeListings.used}/{formatLimit(usageLimits.activeListings.total)}
            </span>
          </div>
          <Progress value={usageLimits.activeListings.total === Infinity ? 0 : (usageLimits.activeListings.used / usageLimits.activeListings.total) * 100} />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1 text-sm">
            <div className="flex items-center gap-1">
              <span>Buscas Ativas</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Número de buscas/demandas que você pode ter ativas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>
              {usageLimits.activeSearches.used}/{formatLimit(usageLimits.activeSearches.total)}
            </span>
          </div>
          <Progress value={usageLimits.activeSearches.total === Infinity ? 0 : (usageLimits.activeSearches.used / usageLimits.activeSearches.total) * 100} />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1 text-sm">
            <div className="flex items-center gap-1">
              <span>Matches (este mês)</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Matches disponíveis neste mês</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>
              {usageLimits.matchesThisMonth.used}/{formatLimit(usageLimits.matchesThisMonth.total)}
            </span>
          </div>
          <Progress value={usageLimits.matchesThisMonth.total === Infinity ? 0 : (usageLimits.matchesThisMonth.used / usageLimits.matchesThisMonth.total) * 100} />
        </div>
        
        {usageLimits.contactsThisMonth.total > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1 text-sm">
              <div className="flex items-center gap-1">
                <span>Contatos (este mês)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Contatos diretos disponíveis neste mês</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span>
                {usageLimits.contactsThisMonth.used}/{formatLimit(usageLimits.contactsThisMonth.total)}
              </span>
            </div>
            <Progress value={usageLimits.contactsThisMonth.total === Infinity ? 0 : (usageLimits.contactsThisMonth.used / usageLimits.contactsThisMonth.total) * 100} />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full">
          <div className="flex flex-wrap gap-2 text-xs mt-1">
            {currentPlan.features.slice(0, 3).map((feature, index) => (
              feature.included && (
                <Badge key={index} variant="outline" className="font-normal">
                  {feature.name}
                </Badge>
              )
            ))}
            {currentPlan.features.filter(f => f.included).length > 3 && (
              <Badge variant="outline" className="font-normal">
                +{currentPlan.features.filter(f => f.included).length - 3} recursos
              </Badge>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
