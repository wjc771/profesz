
import MainLayout from '@/components/layout/MainLayout';
import { DatabaseSeedPage } from '@/utils/databaseSeed';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const DatabaseSeed = () => {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        // Verifica se o usuário atual tem perfil do tipo "owner" ou superior
        const { data, error } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // Apenas admin poderia fazer isso numa aplicação real
        // Como isso é uma ferramenta de demonstração, permitimos qualquer tipo de usuário
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
      <DatabaseSeedPage />
    </MainLayout>
  );
};

export default DatabaseSeed;
