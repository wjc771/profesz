
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProperties from '@/components/dashboard/UserProperties';
import UserDemands from '@/components/dashboard/UserDemands';
import UserMatches from '@/components/dashboard/UserMatches';
import UserTypeComparison from '@/components/UserTypeComparison';
import { useToast } from '@/components/ui/use-toast';
import { Profile, UserType } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Search, Users, BarChart3, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProfiles } from '@/lib/mockData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(true); // Set to true by default
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        console.log("Fetching user profile for:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        // Transform data from snake_case to camelCase
        const transformedData: Profile = {
          id: data.id,
          email: data.email,
          name: data.name,
          type: data.type as UserType,
          phone: data.phone,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          subscriptionPlanId: data.subscription_plan_id as any,
          avatarUrl: data.avatar_url,
          creci: data.creci,
          agencyName: data.agency_name
        };

        console.log("User profile fetched:", transformedData);
        setUserProfile(transformedData);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Erro ao carregar perfil',
          description: error.message || 'Falha ao carregar perfil',
          variant: 'destructive'
        });

        // Use mock data if there's an error
        setUseMockData(true);
        // Find a mock profile to use
        const mockProfile = mockProfiles[0];
        setUserProfile(mockProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  // Toggle mock data for testing purposes
  const handleToggleMockData = () => {
    setUseMockData(!useMockData);
    if (!useMockData) {
      // Find a mock profile of the same type as the real user for demonstration
      const mockUserType = userProfile?.type || 'buyer';
      const mockProfile = mockProfiles.find(p => p.type === mockUserType) || mockProfiles[0];
      setUserProfile(mockProfile);
      
      toast({
        title: 'Modo de Demonstração Ativado',
        description: `Dados de demonstração carregados para usuário do tipo: ${mockProfile.type}`,
        variant: 'default'
      });
    } else {
      // Revert to real data
      fetchUserProfile();
      
      toast({
        title: 'Modo de Demonstração Desativado',
        description: 'Usando dados reais do usuário',
        variant: 'default'
      });
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      console.log("Fetching user profile for:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      // Transform data from snake_case to camelCase
      const transformedData: Profile = {
        id: data.id,
        email: data.email,
        name: data.name,
        type: data.type as UserType,
        phone: data.phone,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        subscriptionPlanId: data.subscription_plan_id as any,
        avatarUrl: data.avatar_url,
        creci: data.creci,
        agencyName: data.agency_name
      };

      console.log("User profile fetched:", transformedData);
      setUserProfile(transformedData);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      // Use mock data if there's an error
      setUseMockData(true);
      // Find a mock profile to use
      const mockProfile = mockProfiles[0];
      setUserProfile(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8 flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Render specific dashboard content based on user type
  const renderDashboardContent = () => {
    if (!userProfile) return null;

    console.log("Rendering dashboard for user type:", userProfile.type);
    
    switch (userProfile.type) {
      case 'buyer':
        return (
          <Tabs defaultValue="demands" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="demands" className="flex items-center gap-2">
                <Search size={16} />
                Minhas Buscas
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center gap-2">
                <Building size={16} />
                Meus Matches
              </TabsTrigger>
            </TabsList>
            <TabsContent value="demands">
              <UserDemands />
            </TabsContent>
            <TabsContent value="matches">
              <UserMatches />
            </TabsContent>
          </Tabs>
        );
        
      case 'owner':
        return (
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Building size={16} />
                Meus Imóveis
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center gap-2">
                <Search size={16} />
                Interessados
              </TabsTrigger>
            </TabsList>
            <TabsContent value="properties">
              <UserProperties />
            </TabsContent>
            <TabsContent value="matches">
              <UserMatches />
            </TabsContent>
          </Tabs>
        );
        
      case 'agent':
        return (
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Building size={16} />
                Imóveis
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center gap-2">
                <Search size={16} />
                Matches
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users size={16} />
                Clientes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="properties">
              <UserProperties />
            </TabsContent>
            <TabsContent value="matches">
              <UserMatches />
            </TabsContent>
            <TabsContent value="clients">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Meus Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">Funcionalidade disponível no plano Profissional</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
        
      case 'agency':
        return (
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Building size={16} />
                Imóveis
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center gap-2">
                <Search size={16} />
                Matches
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <Users size={16} />
                Corretores
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 size={16} />
                Análises
              </TabsTrigger>
            </TabsList>
            <TabsContent value="properties">
              <UserProperties />
            </TabsContent>
            <TabsContent value="matches">
              <UserMatches />
            </TabsContent>
            <TabsContent value="agents">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Equipe de Corretores</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">Funcionalidade disponível no plano Profissional</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Análises de Mercado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">Funcionalidade disponível no plano Profissional</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
      
      default:
        return <p>Tipo de perfil não reconhecido</p>;
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {userProfile?.name || user.email}!
              {userProfile?.type && (
                <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {userProfile.type === 'buyer' ? 'Comprador' : 
                   userProfile.type === 'owner' ? 'Proprietário' : 
                   userProfile.type === 'agent' ? 'Corretor' : 
                   userProfile.type === 'agency' ? 'Imobiliária' : ''}
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button 
              variant={showComparison ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-1"
            >
              <Info size={16} />
              {showComparison ? 'Esconder' : 'Mostrar'} Comparação de Perfis
            </Button>
            <Button 
              variant={useMockData ? "destructive" : "outline"}
              size="sm" 
              onClick={handleToggleMockData}
            >
              {useMockData ? 'Desativar' : 'Ativar'} Dados de Demonstração
            </Button>
          </div>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Se você não está vendo dados, use o botão <strong>"Ativar Dados de Demonstração"</strong> para visualizar como o sistema funciona com dados de exemplo.
          </AlertDescription>
        </Alert>

        {showComparison && (
          <div className="mb-8">
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Comparação de Tipos de Usuário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserTypeComparison />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats userType={userProfile?.type || 'buyer'} />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {renderDashboardContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
