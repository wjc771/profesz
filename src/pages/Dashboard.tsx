
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Search, Users, BarChart3 } from 'lucide-react';
import UserTypeComparison from '@/components/UserTypeComparison';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      // Adaptação exemplo para tipos ProfeXpress
      const mockProfile: Profile = {
        id: user.id || 'mock-id',
        email: user.email || 'mock@example.com',
        name: 'Usuário ProfeXpress',
        type: 'professor' as UserType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setUserProfile(mockProfile);
      setLoading(false);
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

  // Conteúdo adaptado para professor e instituição
  const renderDashboardContent = () => {
    if (!userProfile) return null;

    switch (userProfile.type) {
      case 'professor':
        return (
          <Tabs defaultValue="recursos" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="recursos">Meus Materiais</TabsTrigger>
              <TabsTrigger value="planos">Planos de Aula</TabsTrigger>
            </TabsList>
            <TabsContent value="recursos">
              <UserProperties /> {/* pode ser reusado para materiais ou criar novo */}
            </TabsContent>
            <TabsContent value="planos">
              <UserDemands /> {/* pode representar planos/aulas ou implementar novo */}
            </TabsContent>
          </Tabs>
        );
      case 'instituicao':
        return (
          <Tabs defaultValue="organizacao" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="organizacao">Organização</TabsTrigger>
              <TabsTrigger value="professores">Professores</TabsTrigger>
            </TabsList>
            <TabsContent value="organizacao">
              <UserProperties />
            </TabsContent>
            <TabsContent value="professores">
              <Card>
                <CardHeader>
                  <CardTitle>Equipe docente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">Funcionalidade disponível no ProfeXpress Institucional</p>
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
              <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                {userProfile.type === 'professor'
                  ? 'Professor(a)'
                  : userProfile.type === 'instituicao'
                  ? 'Instituição'
                  : ''}
              </span>
            )}
          </p>
        </div>
        
        <div className="mb-8">
          <UserTypeComparison />
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats userType={userProfile?.type || 'professor'} />
        </div>
        <div className="space-y-6">{renderDashboardContent()}</div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
