import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useSubscription } from "@/hooks/useSubscription";
import PlanSelection from "@/components/subscription/PlanSelection";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const UserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentPlan, isLoading: isLoadingSubscription, usageLimits, upgradePlan } = useSubscription();
  const [isProcessingPlanChange, setIsProcessingPlanChange] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // Import plans dynamically to avoid circular dependencies
    import("@/data/plans").then((module) => {
      setPlans(module.plans);
    });
  }, []);

  const handlePlanChange = async (planId: string) => {
    try {
      setIsProcessingPlanChange(true);
      await upgradePlan(planId);
      toast({
        title: "Plano atualizado",
        description: "Seu plano foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error changing plan:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar seu plano. Tente novamente mais tarde.",
      });
    } finally {
      setIsProcessingPlanChange(false);
    }
  };

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Gerencie suas preferências de notificação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  Em breve!
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Assinatura</CardTitle>
                <CardDescription>
                  Visualize detalhes da sua assinatura atual e gerencie seu plano.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {isLoadingSubscription ? (
                  <div className="text-center py-4">Carregando informações da assinatura...</div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Seu plano atual</h3>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-semibold">{currentPlan?.name}</h4>
                            <p className="text-muted-foreground">{currentPlan?.price}</p>
                          </div>
                          <Badge>{currentPlan?.recommended ? "Recomendado" : "Atual"}</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Imóveis</span>
                              <span>{usageLimits.activeListings.used} / {usageLimits.activeListings.total === Infinity ? "∞" : usageLimits.activeListings.total}</span>
                            </div>
                            <Progress value={(usageLimits.activeListings.used / (usageLimits.activeListings.total === Infinity ? 100 : usageLimits.activeListings.total)) * 100} />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Buscas</span>
                              <span>{usageLimits.activeSearches.used} / {usageLimits.activeSearches.total === Infinity ? "∞" : usageLimits.activeSearches.total}</span>
                            </div>
                            <Progress value={(usageLimits.activeSearches.used / (usageLimits.activeSearches.total === Infinity ? 100 : usageLimits.activeSearches.total)) * 100} />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Matches (este mês)</span>
                              <span>{usageLimits.matchesThisMonth.used} / {usageLimits.matchesThisMonth.total === Infinity ? "∞" : usageLimits.matchesThisMonth.total}</span>
                            </div>
                            <Progress value={(usageLimits.matchesThisMonth.used / (usageLimits.matchesThisMonth.total === Infinity ? 100 : usageLimits.matchesThisMonth.total)) * 100} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Mudar de plano</h3>
                      {plans.length > 0 && (
                        <PlanSelection 
                          plans={plans}
                          currentPlanId={currentPlan?.id}
                          onSelectPlan={handlePlanChange}
                          isProcessing={isProcessingPlanChange}
                          compact={true}
                        />
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserSettings;
