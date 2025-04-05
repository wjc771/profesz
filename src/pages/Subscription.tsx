
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PlanSelection from '@/components/subscription/PlanSelection';
import { useToast } from '@/components/ui/use-toast';
import { plans, standAloneServices } from '@/data/plans';
import { useAuth } from '@/hooks/useAuth';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ShoppingCart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Subscription = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>("free");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSelectPlan = async (planId: string) => {
    if (planId === currentPlanId) return;
    
    if (planId === "custom") {
      toast({
        title: 'Plano Personalizado',
        description: 'Nossa equipe entrará em contato para discutir suas necessidades específicas.',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log('Selecting plan:', planId);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPlanId(planId);
      
      toast({
        title: 'Plano atualizado',
        description: `Seu plano foi atualizado para ${plans.find(p => p.id === planId)?.name}.`,
      });

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na atualização',
        description: 'Não foi possível atualizar seu plano. Tente novamente mais tarde.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchaseService = (serviceId: string) => {
    const service = standAloneServices.find(s => s.id === serviceId);
    if (!service) return;
    
    toast({
      title: 'Serviço adquirido',
      description: `Você adquiriu ${service.name} por ${service.price}.`,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-6 px-4">
        <Tabs defaultValue="plans" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Assinatura</h1>
              <p className="text-muted-foreground">Gerencie seu plano e faturamento</p>
            </div>
            <TabsList className="mt-4 md:mt-0">
              <TabsTrigger value="plans">Planos</TabsTrigger>
              <TabsTrigger value="services">Serviços Avulsos</TabsTrigger>
              <TabsTrigger value="billing">Faturamento</TabsTrigger>
              <TabsTrigger value="usage">Uso</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="plans" className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">Escolha seu plano</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Todos os planos incluem acesso à plataforma MatchImobiliário. Escolha o plano que melhor atende às suas necessidades.
              </p>
            </div>

            <PlanSelection 
              plans={plans.filter(p => p.id !== 'custom')} 
              currentPlanId={currentPlanId} 
              onSelectPlan={handleSelectPlan} 
              isProcessing={isProcessing}
            />

            <div className="mt-10 text-center text-sm text-muted-foreground">
              <p>Você pode alterar ou cancelar seu plano a qualquer momento.</p>
              <p className="mt-1">Precisa de ajuda para escolher? <a href="#" className="text-primary hover:underline">Fale conosco</a></p>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">Serviços Avulsos</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Impulsione seus resultados com nossos serviços adicionais, disponíveis independente do seu plano atual.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {standAloneServices.map((service) => (
                <Card key={service.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{service.price}</span>
                      {service.duration && (
                        <Badge variant="outline" className="text-xs">
                          {service.duration}
                        </Badge>
                      )}
                      {service.quantity && (
                        <Badge variant="outline" className="text-xs">
                          {service.quantity}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handlePurchaseService(service.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adquirir agora
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-muted text-sm text-muted-foreground">
              <p className="font-medium mb-2">Importante:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Os serviços avulsos são cobrados separadamente do seu plano mensal</li>
                <li>Alguns serviços podem ter requisitos específicos (ex: imagens em alta resolução para Tour Virtual)</li>
                <li>Para serviços de marketing e divulgação, o processo pode levar até 24h para iniciar</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="bg-card rounded-lg border p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Informações de faturamento</h3>
                <div className="grid gap-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Plano atual</span>
                    <span className="font-medium">{plans.find(p => p.id === currentPlanId)?.name || "Gratuito"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Próxima cobrança</span>
                    <span className="font-medium">{formatDate(endDate)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Valor</span>
                    <span className="font-medium">{plans.find(p => p.id === currentPlanId)?.price || "Grátis"}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Período</span>
                    <span className="font-medium">{formatDate(startDate)} - {formatDate(endDate)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Método de pagamento</h3>
                {currentPlanId && currentPlanId !== "free" ? (
                  <div className="flex items-center gap-4 p-4 border rounded-md">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.1" />
                        <path d="M7 15H17V11H7V15ZM8 12H16V14H8V12Z" fill="currentColor" />
                        <path d="M17 8H7C5.9 8 5 8.9 5 10V16C5 17.1 5.9 18 7 18H17C18.1 18 19 17.1 19 16V10C19 8.9 18.1 8 17 8ZM17 16H7V10H17V16Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Cartão terminando em 4242</p>
                      <p className="text-sm text-muted-foreground">Expira em 12/2025</p>
                    </div>
                    <div className="ml-auto">
                      <Button variant="outline" size="sm">Alterar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Nenhum método de pagamento cadastrado.
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Histórico de faturas</h3>
                {currentPlanId && currentPlanId !== "free" ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">Data</th>
                          <th className="text-left p-3 font-medium">Valor</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-right p-3 font-medium">Recibo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">{formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))}</td>
                          <td className="p-3">{plans.find(p => p.id === currentPlanId)?.price}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Pago</Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm">Baixar</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Nenhuma fatura disponível.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="bg-card rounded-lg border p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Uso atual (este mês)</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Anúncios ativos</span>
                      <span className="text-sm text-muted-foreground">
                        {currentPlanId === "free" ? "1 de 1" : 
                         currentPlanId === "personal" ? "0 de 10" : 
                         currentPlanId === "professional" ? "0 de ∞" : "0"}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: currentPlanId === "free" ? "100%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Buscas ativas</span>
                      <span className="text-sm text-muted-foreground">
                        {currentPlanId === "free" ? "0 de 1" : 
                         currentPlanId === "personal" ? "0 de 10" : 
                         currentPlanId === "professional" ? "0 de ∞" : "0"}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Matches este mês</span>
                      <span className="text-sm text-muted-foreground">
                        {currentPlanId === "free" ? "1 de 3" : 
                         currentPlanId === "personal" ? "0 de 30" : 
                         currentPlanId === "professional" ? "0 de ∞" : "0"}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: currentPlanId === "free" ? "33%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Contatos realizados</span>
                      <span className="text-sm text-muted-foreground">
                        {currentPlanId === "free" ? "Não disponível" : 
                         currentPlanId === "personal" ? "0 de 30" : 
                         currentPlanId === "professional" ? "0 de ∞" : "0"}
                      </span>
                    </div>
                    {currentPlanId !== "free" && (
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    )}
                    {currentPlanId === "free" && (
                      <div className="text-xs text-muted-foreground">
                        Faça upgrade para um plano pago para desbloquear esta funcionalidade.
                      </div>
                    )}
                  </div>
                  
                  {currentPlanId === "personal" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Impulsionamentos restantes</span>
                          <span className="text-sm text-muted-foreground">3 de 3</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Destaque semanal</span>
                          <span className="text-sm text-muted-foreground">Disponível</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: "0%" }}
                          ></div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {currentPlanId === "professional" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Usuários da equipe</span>
                        <span className="text-sm text-muted-foreground">0 de 10</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {currentPlanId !== "free" && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Estatísticas de uso</h3>
                  <div className="p-4 bg-muted/30 rounded-lg border border-muted text-sm">
                    <p className="mb-2">As estatísticas detalhadas de uso estão disponíveis em seu painel de Analytics.</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/analytics')}>
                      Ver Analytics
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Subscription;
