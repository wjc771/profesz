
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Check, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendVerificationEmailViaSupabase } from '@/utils/emailUtils';

const VerificationPending = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [manualEmail, setManualEmail] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      console.log('VerificationPending: Checking current session...');
      
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('VerificationPending: Session error:', sessionError);
          return;
        }
        
        // Tentar obter email da sessão primeiro
        let email = sessionData.session?.user?.email;
        
        // Se não houver email na sessão, tentar obter do localStorage
        if (!email) {
          email = localStorage.getItem('pending_verification_email');
          console.log('VerificationPending: Got email from localStorage:', email);
        }
        
        if (email) {
          console.log('VerificationPending: Found user email:', email);
          setUserEmail(email);
          
          // Verificar se já está confirmado
          if (sessionData.session?.user?.email_confirmed_at) {
            console.log('VerificationPending: Email already confirmed, redirecting to onboarding');
            // Limpar email salvo
            localStorage.removeItem('pending_verification_email');
            toast({
              title: 'Email já verificado!',
              description: 'Redirecionando para o onboarding...'
            });
            navigate('/onboarding');
          }
        } else {
          console.log('VerificationPending: No email found in session or localStorage');
          setShowManualInput(true);
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
      console.log('🚀 VerificationPending: Iniciando reenvio de email...');
      
      const emailToUse = manualEmail.trim() || userEmail;
      
      if (!emailToUse) {
        throw new Error('Email é obrigatório. Por favor, insira seu email.');
      }
      
      console.log('📧 VerificationPending: Reenviando email via Supabase para:', emailToUse);
      
      await sendVerificationEmailViaSupabase({
        email: emailToUse,
        redirectTo: `${window.location.origin}/onboarding`
      });
      
      console.log('✅ VerificationPending: Email reenviado com sucesso');
      
      if (manualEmail.trim()) {
        setUserEmail(manualEmail.trim());
        localStorage.setItem('pending_verification_email', manualEmail.trim());
        setManualEmail('');
        setShowManualInput(false);
      }
      
      toast({
        title: '✅ Email reenviado!',
        description: 'Um novo email de verificação foi enviado. Verifique sua caixa de entrada e spam.'
      });
      
    } catch (error: any) {
      console.error('❌ VerificationPending: Erro ao reenviar email:', error);
      
      toast({
        variant: 'destructive',
        title: 'Erro ao reenviar email',
        description: error.message || 'Não foi possível reenviar o email. Tente novamente.'
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
        
        // Limpar email salvo ao confirmar
        localStorage.removeItem('pending_verification_email');
        
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
    
    // Limpar email salvo
    localStorage.removeItem('pending_verification_email');
    
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
            {userEmail ? (
              <>Enviamos um email de verificação para <strong>{userEmail}</strong>.</>
            ) : (
              <>Enviamos um email de verificação para seu endereço.</>
            )}
            {' '}Por favor, clique no link enviado para verificar sua conta.
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

          {showManualInput && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Email não encontrado automaticamente</p>
                  <p className="text-sm">Por favor, insira o email usado no cadastro:</p>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!showManualInput && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowManualInput(true)}
                className="text-muted-foreground"
              >
                Usar email diferente
              </Button>
            </div>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>📧 Sistema simplificado:</strong> Usando método nativo do Supabase para envio de emails.
            </AlertDescription>
          </Alert>

          {userEmail && (
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <strong>🔧 Debug info:</strong>
              <br />📧 Email: {userEmail}
              <br />🌐 Origem: {window.location.origin}
              <br />📡 Método: Supabase nativo
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
            disabled={resending || (!userEmail && !manualEmail.trim())}
          >
            {resending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : (
              '📧 Reenviar email'
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
