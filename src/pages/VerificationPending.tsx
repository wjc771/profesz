
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Check, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VerificationPending = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      console.log('VerificationPending: Checking current session...');
      
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('VerificationPending: Session error:', sessionError);
          return;
        }
        
        if (sessionData.session?.user?.email) {
          console.log('VerificationPending: Found user email:', sessionData.session.user.email);
          setUserEmail(sessionData.session.user.email);
          
          // Verificar se já está confirmado
          if (sessionData.session.user.email_confirmed_at) {
            console.log('VerificationPending: Email already confirmed, redirecting to onboarding');
            toast({
              title: 'Email já verificado!',
              description: 'Redirecionando para o onboarding...'
            });
            navigate('/onboarding');
          }
        } else {
          console.log('VerificationPending: No user session found');
        }
      } catch (error) {
        console.error('VerificationPending: Error checking session:', error);
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  const handleResendEmail = async () => {
    setResending(true);
    
    try {
      console.log('VerificationPending: Starting resend process...');
      
      const { data: sessionData } = await supabase.auth.getSession();
      const email = sessionData.session?.user?.email || userEmail;
      
      if (!email) {
        throw new Error('Email não encontrado. Tente fazer login novamente.');
      }
      
      console.log('VerificationPending: Attempting to resend email to:', email);
      console.log('VerificationPending: Current origin:', window.location.origin);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`
        }
      });
      
      if (error) {
        console.error('VerificationPending: Resend error details:', error);
        
        // Verificar tipos específicos de erro
        if (error.message.includes('email_address_not_authorized')) {
          throw new Error('Este email não está autorizado. Verifique se o domínio está configurado no Supabase.');
        } else if (error.message.includes('rate_limit')) {
          throw new Error('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
        } else if (error.message.includes('email_not_confirmed')) {
          throw new Error('Email ainda não foi confirmado. Aguarde o primeiro email chegar.');
        }
        
        throw error;
      }
      
      console.log('VerificationPending: Email resent successfully');
      
      toast({
        title: 'Email reenviado!',
        description: 'Um novo email de verificação foi enviado. Verifique sua caixa de entrada e spam.'
      });
      
    } catch (error: any) {
      console.error('VerificationPending: Resend failed:', error);
      
      toast({
        variant: 'destructive',
        title: 'Erro ao reenviar email',
        description: error.message || 'Não foi possível reenviar o email. Verifique as configurações do Supabase.'
      });
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    
    try {
      console.log('VerificationPending: Checking verification status...');
      
      // Forçar refresh da sessão
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('VerificationPending: Error getting user:', error);
        throw error;
      }
      
      console.log('VerificationPending: Current user status:', { 
        email: user?.email, 
        emailConfirmed: user?.email_confirmed_at,
        userMetadata: user?.user_metadata 
      });
      
      if (user?.email_confirmed_at) {
        console.log('VerificationPending: Email confirmed! Redirecting...');
        
        toast({
          title: 'Email verificado!',
          description: 'Sua conta foi verificada com sucesso. Redirecionando...'
        });
        
        // Pequeno delay para mostrar o toast
        setTimeout(() => {
          navigate('/onboarding');
        }, 1000);
      } else {
        console.log('VerificationPending: Email still not confirmed');
        
        toast({
          variant: 'destructive',
          title: 'Email ainda não verificado',
          description: 'Verifique sua caixa de entrada e clique no link de verificação.'
        });
      }
    } catch (error: any) {
      console.error('VerificationPending: Check verification error:', error);
      
      toast({
        variant: 'destructive',
        title: 'Erro ao verificar status',
        description: 'Não foi possível verificar o status do email.'
      });
    } finally {
      setChecking(false);
    }
  };

  const handleSkipVerification = () => {
    console.log('VerificationPending: Skipping email verification for development');
    
    // Definir flag no localStorage para indicar que a verificação foi pulada
    localStorage.setItem('email_verification_skipped', 'true');
    
    toast({
      title: 'Verificação ignorada',
      description: 'Modo desenvolvimento ativado. Redirecionando...'
    });
    
    // Aguardar um pouco para mostrar o toast antes de navegar
    setTimeout(() => {
      navigate('/onboarding');
    }, 1000);
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

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Testando configurações:</strong> Se você configurou o Supabase para enviar emails,
              clique em "Verificar se já confirmei" ou "Reenviar email" para testar.
            </AlertDescription>
          </Alert>

          {userEmail && (
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <strong>Debug info:</strong>
              <br />Email: {userEmail}
              <br />Origem: {window.location.origin}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleCheckVerification} 
            className="w-full"
            disabled={checking}
          >
            {checking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              'Verificar se já confirmei'
            )}
          </Button>
          
          <Button 
            onClick={handleResendEmail} 
            variant="outline" 
            className="w-full"
            disabled={resending}
          >
            {resending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : (
              'Reenviar email de verificação'
            )}
          </Button>
          
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
