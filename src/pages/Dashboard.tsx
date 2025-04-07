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

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
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

        setUserProfile(transformedData);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Erro ao carregar perfil',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  if (!user || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8 flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {userProfile?.name || user.email}!
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats userType={userProfile?.type || 'buyer'} />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Customized dashboard based on user type */}
          {userProfile?.type === 'buyer' && (
            <Tabs defaultValue="demands" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="demands">Minhas Buscas</TabsTrigger>
                <TabsTrigger value="matches">Meus Matches</TabsTrigger>
              </TabsList>
              <TabsContent value="demands">
                <UserDemands />
              </TabsContent>
              <TabsContent value="matches">
                <UserMatches />
              </TabsContent>
            </Tabs>
          )}

          {/* Owner dashboard */}
          {userProfile?.type === 'owner' && (
            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="properties">Meus Imóveis</TabsTrigger>
                <TabsTrigger value="matches">Interessados</TabsTrigger>
              </TabsList>
              <TabsContent value="properties">
                <UserProperties />
              </TabsContent>
              <TabsContent value="matches">
                <UserMatches />
              </TabsContent>
            </Tabs>
          )}

          {/* Agent dashboard */}
          {userProfile?.type === 'agent' && (
            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="properties">Imóveis</TabsTrigger>
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="clients">Clientes</TabsTrigger>
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
          )}

          {/* Agency dashboard */}
          {userProfile?.type === 'agency' && (
            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="properties">Imóveis</TabsTrigger>
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="agents">Corretores</TabsTrigger>
                <TabsTrigger value="analytics">Análises</TabsTrigger>
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
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
