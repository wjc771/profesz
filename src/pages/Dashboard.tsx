
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProperties from '@/components/dashboard/UserProperties';
import UserDemands from '@/components/dashboard/UserDemands';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';

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

        setUserProfile(data as Profile);
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
          {/* Show UserProperties for owners, agents, and agencies */}
          {(userProfile?.type === 'owner' || userProfile?.type === 'agent' || userProfile?.type === 'agency') && (
            <UserProperties />
          )}

          {/* Show UserDemands for buyers */}
          {userProfile?.type === 'buyer' && (
            <UserDemands />
          )}

          {/* For agents and agencies, show both properties and potential matches */}
          {(userProfile?.type === 'agent' || userProfile?.type === 'agency') && (
            <div className="mt-8">
              {/* Add components for agent/agency-specific functionality */}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
