
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
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing local storage');
          localStorage.removeItem('onboarding_completed');
          localStorage.removeItem('user_type');
          localStorage.removeItem('questionnaire_data');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session check:', session?.user?.email, error);
      if (error) {
        console.error('Session check error:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Handle specific error cases
        if (error.message === 'Email not confirmed') {
          toast({
            title: 'Email não verificado',
            description: 'Você precisa verificar seu email antes de fazer login. Redirecionando...'
          });
          navigate('/verification-pending');
          return;
        }
        
        if (error.message === 'Invalid login credentials') {
          toast({
            variant: 'destructive',
            title: 'Erro no login',
            description: 'Email ou senha incorretos.'
          });
          throw error;
        }
        
        throw error;
      }
      
      console.log('Sign in successful for user:', data.user?.email);
      
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!'
      });
      
      // Check onboarding status
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      console.log('Onboarding completed status:', onboardingCompleted);
      
      if (!onboardingCompleted) {
        console.log('Redirecting to onboarding');
        navigate('/onboarding', { 
          state: { 
            firstLogin: false, 
            name: data.user?.user_metadata?.name || data.user?.email?.split('@')[0] 
          } 
        });
      } else {
        console.log('Redirecting to dashboard');
        navigate('/dashboard');
      }
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
      console.log('Attempting sign up for:', email, 'as', userType);
      
      const validTypes: UserType[] = ['professor', 'instituicao', 'aluno', 'pais'];
      if (!validTypes.includes(userType)) {
        throw new Error('Tipo de usuário inválido');
      }
      
      // Configure redirect URL for verification
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
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      console.log('Signup successful:', data);
      
      toast({
        title: 'Cadastro realizado com sucesso',
        description: 'Sua conta foi criada! Complete seu perfil no próximo passo.'
      });
      
      // Don't redirect automatically - let Register.tsx handle it
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
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local storage
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('user_type');
      localStorage.removeItem('questionnaire_data');
      
      toast({
        title: 'Logout realizado com sucesso',
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
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
      console.error('Check current user error:', error);
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
    console.log('AuthRequired: checking session', { session: !!session, loading });
    
    if (!loading) {
      if (!session) {
        console.log('AuthRequired: No session, redirecting to login');
        navigate('/login');
      } else {
        console.log('AuthRequired: Session found, allowing access');
        setChecked(true);
      }
    }
  }, [session, loading, navigate]);

  if (loading || !checked) {
    console.log('AuthRequired: Still loading or checking');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
