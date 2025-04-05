import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Moon, Sun, Check, LockKeyhole, Languages, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import PlanSelection from '@/components/subscription/PlanSelection';
import { plans } from '@/data/plans';

const UserSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('pt-BR');
  const [receiveEmailNotifications, setReceiveEmailNotifications] = useState(true);
  const [receiveInAppNotifications, setReceiveInAppNotifications] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState<string>('free');
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme-preference') as 'light' | 'dark' | 'system' | null;
    if (storedTheme) {
      setThemePreference(storedTheme);
    }
    
    const storedLanguage = localStorage.getItem('language-preference');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }

    const storedPlan = localStorage.getItem('user-subscription');
    if (storedPlan) {
      setCurrentPlanId(storedPlan);
    }
  }, []);
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setThemePreference(theme);
    localStorage.setItem('theme-preference', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
    
    toast({
      title: 'Tema atualizado',
      description: `Tema alterado para ${theme === 'light' ? 'claro' : theme === 'dark' ? 'escuro' : 'sistema'}.`,
    });
  };
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language-preference', lang);
    
    toast({
      title: 'Idioma atualizado',
      description: `Idioma alterado para ${lang === 'pt-BR' ? 'Português' : lang === 'en' ? 'Inglês' : 'Espanhol'}.`,
    });
  };
  
  const handleNotificationPreferences = async () => {
    setLoading(true);
    
    try {
      toast({
        title: 'Preferências atualizadas',
        description: 'Suas preferências de notificação foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar suas preferências. Tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatePasswordLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi atualizada com sucesso.',
      });
      
      setPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar senha',
        description: error.message || 'Não foi possível atualizar sua senha. Tente novamente mais tarde.',
      });
    } finally {
      setUpdatePasswordLoading(false);
    }
  };
  
  const handleChangePlan = async (planId: string) => {
    setChangingPlan(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem('user-subscription', planId);
      setCurrentPlanId(planId);
      
      toast({
        title: 'Plano atualizado',
        description: `Seu plano foi atualizado para ${plans.find(p => p.id === planId)?.name}.`,
      });
      
      setShowPlanDialog(false);
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na atualização',
        description: 'Não foi possível atualizar seu plano. Tente novamente mais tarde.',
      });
    } finally {
      setChangingPlan(false);
    }
  };

  const currentPlan = plans.find(p => p.id === currentPlanId);
  
  return (
    <MainLayout>
      <div className="container max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações de conta
          </p>
        </div>
        
        <Tabs defaultValue="account">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Alterar senha</h3>
                    <p className="text-sm text-muted-foreground">
                      Atualize sua senha para manter sua conta segura
                    </p>
                  </div>
                  <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <LockKeyhole className="h-4 w-4 mr-2" />
                        Alterar senha
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar senha</DialogTitle>
                        <DialogDescription>
                          Digite sua nova senha abaixo
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Senha atual</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nova senha</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={updatePasswordLoading}>
                            {updatePasswordLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Atualizando...
                              </>
                            ) : 'Atualizar senha'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Autenticação de dois fatores</h3>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    Em breve
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Assinatura e Plano</CardTitle>
                <CardDescription>
                  Gerencie seu plano atual e limites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Plano atual: <span className="text-primary">{currentPlan?.name || 'Gratuito'}</span></h3>
                    <Link to="/subscription">
                      <Button variant="default" size="sm">
                        Fazer upgrade
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ofertas ativas</span>
                        <span className="font-medium">1/1</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full">
                        <div className="bg-primary h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Demandas ativas</span>
                        <span className="font-medium">1/1</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full">
                        <div className="bg-primary h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Limites do plano:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>1 oferta e 1 demanda ativas</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Notificação de matches (sem detalhes)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Filtros básicos</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/subscription" className="w-full">
                  <Button variant="outline" className="w-full">
                    Ver todos os planos
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seu Plano</CardTitle>
                <CardDescription>
                  Gerencie seu plano de assinatura atual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Plano atual: <span className="text-primary">{currentPlan?.name || 'Gratuito'}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentPlan?.description || 'Plano básico com funcionalidades limitadas'}
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    onClick={() => setShowPlanDialog(true)}
                    className="mt-4 md:mt-0"
                  >
                    Mudar plano
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Limites e recursos do seu plano</h3>
                  
                  {currentPlan && currentPlan.id !== 'custom' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="font-medium">Limites de uso</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Anúncios ativos</span>
                              <span className="font-medium">
                                {currentPlan.limits.activeListings === -1 
                                  ? "Ilimitado" 
                                  : `0/${currentPlan.limits.activeListings}`}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: "0%" }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Buscas ativas</span>
                              <span className="font-medium">
                                {currentPlan.limits.activeSearches === -1 
                                  ? "Ilimitado" 
                                  : `0/${currentPlan.limits.activeSearches}`}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: "0%" }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Matches restantes (este mês)</span>
                              <span className="font-medium">
                                {currentPlan.limits.matchesPerMonth === -1 
                                  ? "Ilimitado" 
                                  : `${currentPlan.limits.matchesPerMonth}/${currentPlan.limits.matchesPerMonth}`}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                          
                          {currentPlan.limits.contactsPerMonth !== null && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Contatos restantes (este mês)</span>
                                <span className="font-medium">
                                  {currentPlan.limits.contactsPerMonth === -1 
                                    ? "Ilimitado" 
                                    : `${currentPlan.limits.contactsPerMonth}/${currentPlan.limits.contactsPerMonth}`}
                                </span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Principais recursos</h4>
                        <ul className="space-y-2">
                          {currentPlan.features
                            .filter(f => f.included)
                            .slice(0, 7)
                            .map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-sm">{feature.name}</span>
                              </li>
                            ))}
                          
                          {currentPlan.features.filter(f => f.included).length > 7 && (
                            <li className="text-xs text-muted-foreground">
                              +{currentPlan.features.filter(f => f.included).length - 7} recursos adicionais
                            </li>
                          )}
                        </ul>
                        
                        <Link to="/subscription" className="text-sm text-primary hover:underline block mt-2">
                          Ver todos os detalhes do plano
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {currentPlan && currentPlan.id === 'custom' && (
                    <div className="text-center p-4 border rounded">
                      <p className="text-muted-foreground">
                        Você está utilizando serviços avulsos. Para verificar seu consumo,
                        acesse a página de assinatura.
                      </p>
                      <Link to="/subscription">
                        <Button variant="outline" className="mt-4">
                          Ver detalhes
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Link to="/subscription" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">
                    Gerenciar assinatura
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setShowPlanDialog(true)}>
                  Ver todos os planos
                </Button>
              </CardFooter>
            </Card>
            
            <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Escolha um plano</DialogTitle>
                  <DialogDescription>
                    Selecione o plano que melhor atende às suas necessidades
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <PlanSelection 
                    plans={plans.filter(p => p.id !== 'custom')} 
                    currentPlanId={currentPlanId}
                    onSelectPlan={handleChangePlan}
                    isProcessing={changingPlan}
                    compact={true}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
                    Cancelar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
                <CardDescription>
                  Personalize a aparência da aplicação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={themePreference === 'light' ? 'default' : 'outline'} 
                    className="w-full flex flex-col items-center p-4 h-auto"
                    onClick={() => handleThemeChange('light')}
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    <span>Claro</span>
                  </Button>
                  <Button 
                    variant={themePreference === 'dark' ? 'default' : 'outline'} 
                    className="w-full flex flex-col items-center p-4 h-auto"
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    <span>Escuro</span>
                  </Button>
                  <Button 
                    variant={themePreference === 'system' ? 'default' : 'outline'} 
                    className="w-full flex flex-col items-center p-4 h-auto"
                    onClick={() => handleThemeChange('system')}
                  >
                    <div className="flex mb-2">
                      <Sun className="h-6 w-6" />
                      <Moon className="h-6 w-6" />
                    </div>
                    <span>Sistema</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Idioma</CardTitle>
                <CardDescription>
                  Escolha o idioma da interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Languages className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="language">Idioma da aplicação</Label>
                    </div>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Decida como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif">Notificações por email</Label>
                    <p className="text-sm text-muted-foreground">Receba atualizações importantes em seu email</p>
                  </div>
                  <Switch 
                    id="email-notif" 
                    checked={receiveEmailNotifications} 
                    onCheckedChange={setReceiveEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="app-notif">Notificações no aplicativo</Label>
                    <p className="text-sm text-muted-foreground">Receba atualizações enquanto estiver usando o aplicativo</p>
                  </div>
                  <Switch 
                    id="app-notif" 
                    checked={receiveInAppNotifications} 
                    onCheckedChange={setReceiveInAppNotifications} 
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Novos matches</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="match-email" className="flex-1">Email</Label>
                      <Switch id="match-email" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="match-app" className="flex-1">No aplicativo</Label>
                      <Switch id="match-app" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Contatos de interessados</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contact-email" className="flex-1">Email</Label>
                      <Switch id="contact-email" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contact-app" className="flex-1">No aplicativo</Label>
                      <Switch id="contact-app" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleNotificationPreferences} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : 'Salvar preferências'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserSettings;
