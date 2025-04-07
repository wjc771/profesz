
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProperties from '@/components/dashboard/UserProperties';
import UserDemands from '@/components/dashboard/UserDemands';
import UserMatches from '@/components/dashboard/UserMatches';
import { useToast } from '@/components/ui/use-toast';
import { Profile, UserType } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Search, Users, BarChart3 } from 'lucide-react';
import { mockProfiles } from '@/lib/mockData';
import UserTypeComparison from '@/components/UserTypeComparison';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true); // Enable mock data by default

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
        setUseMockData(false); // Only disable mock data if we successfully fetched a profile
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

    fetchUserProfile();
  }, [user, toast]);

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
        <div className="mb-8">
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

        <div className="mb-8">
          <UserTypeComparison />
        </div>

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
