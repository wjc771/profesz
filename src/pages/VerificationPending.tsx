
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Check, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VerificationPending = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Verificar se já existe uma sessão e obter o email
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email) {
        setUserEmail(data.session.user.email);
      }
    };
    checkSession();
  }, []);

  const handleResendEmail = async () => {
    setResending(true);
    
    try {
      // Verificar se temos email na sessão atual
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email || userEmail;
      
      if (!email) {
        throw new Error('Email não encontrado. Tente fazer login novamente.');
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email reenviado',
        description: 'Um novo email de verificação foi enviado para o seu endereço.'
      });
    } catch (error: any) {
      console.error('Error resending verification:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível reenviar o email. Tente novamente mais tarde.'
      });
    } finally {
      setResending(false);
    }
  };

  const handleSkipVerification = async () => {
    // Para desenvolvimento, permitir skip da verificação
    toast({
      title: 'Verificação ignorada',
      description: 'Redirecionando para o dashboard...'
    });
    navigate('/dashboard');
  };

  const handleCheckVerification = async () => {
    try {
      // Verificar se o usuário já confirmou o email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email_confirmed_at) {
        toast({
          title: 'Email verificado!',
          description: 'Sua conta foi verificada com sucesso.'
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Email ainda não verificado',
          description: 'Verifique sua caixa de entrada e clique no link de verificação.'
        });
      }
    } catch (error: any) {
      console.error('Error checking verification:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível verificar o status do email.'
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verifique seu email</CardTitle>
          <CardDescription className="mt-2">
            Enviamos um email de verificação para {userEmail || 'seu endereço'}.
            Por favor, clique no link enviado para verificar sua conta.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start space-x-3">
              <Check className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Verifique sua caixa de entrada e spam</p>
                <p className="text-sm text-muted-foreground">
                  O email pode levar alguns minutos para chegar. Se não encontrar, verifique sua pasta de spam.
                </p>
              </div>
            </div>
          </div>

          {/* Aviso sobre configuração de email */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Problema com emails?</strong> Se você não está recebendo emails, pode ser que o Supabase 
              não esteja configurado para enviar emails. Durante o desenvolvimento, você pode pular esta etapa.
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleCheckVerification} 
            className="w-full"
          >
            Verificar se já confirmei
          </Button>
          
          <Button 
            onClick={handleResendEmail} 
            variant="outline" 
            className="w-full"
            disabled={resending}
          >
            {resending ? 'Reenviando...' : 'Reenviar email de verificação'}
          </Button>
          
          {/* Botão para desenvolvimento */}
          <Button 
            onClick={handleSkipVerification} 
            variant="secondary" 
            className="w-full"
          >
            Pular verificação (Desenvolvimento)
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              Voltar para login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationPending;
