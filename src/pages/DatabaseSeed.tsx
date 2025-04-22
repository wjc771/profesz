
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { seedPropertiesFromMockData } from '@/utils/databaseSeed';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { mockProfiles } from '@/lib/mockData';

const DatabaseSeed = () => {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        // Use mock data instead of Supabase query
        const mockProfile = mockProfiles.find(profile => profile.id === user.id);
        
        // For demo purposes, allow any user type
        setIsAuthorized(true);
        
      } catch (error) {
        console.error('Erro ao verificar autorização:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthorization();
  }, [user, navigate]);
  
  const handleSeedProperties = async () => {
    const result = await seedPropertiesFromMockData();
    
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
        variant: 'default',
      });
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!isAuthorized) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-8">Ferramenta de Seed do Banco de Dados</h1>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">Materiais Didáticos</h2>
            <p className="mb-4 text-muted-foreground">
              Insere os materiais didáticos de demonstração no banco de dados, atribuindo-os aos usuários existentes
              do tipo professor ou instituição.
            </p>
            <Button
              onClick={handleSeedProperties}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Adicionar Materiais ao Banco
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DatabaseSeed;
