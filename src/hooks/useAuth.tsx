
import { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { UserType } from '@/types/profile';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, userType: UserType) => Promise<void>;
  signOut: () => Promise<void>;
  checkCurrentUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Se o erro for de email não confirmado, redirecionar para página de verificação
        if (error.message === 'Email not confirmed') {
          toast({
            title: 'Email não verificado',
            description: 'Você precisa verificar seu email antes de fazer login. Redirecionando...'
          });
          navigate('/verification-pending');
          return;
        }
        throw error;
      }
      
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!'
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error details:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: error.message || 'Falha ao fazer login. Verifique suas credenciais.'
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, userType: UserType) => {
    try {
      const validTypes: UserType[] = ['professor', 'instituicao', 'aluno', 'pais'];
      if (!validTypes.includes(userType)) {
        throw new Error('Tipo de usuário inválido');
      }
      
      // Configurar URL de redirecionamento para verificação
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            type: userType
          },
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) throw error;
      
      console.log('Signup successful:', data);
      
      toast({
        title: 'Cadastro realizado com sucesso',
        description: 'Enviamos um email para confirmar sua conta. Verifique sua caixa de entrada.'
      });
      
      navigate('/verification-pending');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
        description: error.message || 'Falha ao criar conta. Este email pode já estar em uso.'
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Logout realizado com sucesso',
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: error.message || 'Não foi possível desconectar. Tente novamente.'
      });
    }
  };

  const checkCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      checkCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthRequired = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate('/login');
      } else {
        setChecked(true);
      }
    }
  }, [session, loading, navigate]);

  if (loading || !checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
