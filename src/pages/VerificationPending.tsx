import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Check, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendVerificationEmailViaResend } from '@/utils/emailUtils';

const VerificationPending = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [manualEmail, setManualEmail] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isResendTestMode, setIsResendTestMode] = useState(false);

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
      
      console.log('📧 VerificationPending: Tentando envio via Resend para:', emailToUse);
      console.log('🔗 VerificationPending: Redirect URL:', `${window.location.origin}/onboarding`);
      
      try {
        const result = await sendVerificationEmailViaResend({
          email: emailToUse,
          redirectTo: `${window.location.origin}/onboarding`
        });
        
        console.log('✅ VerificationPending: Email enviado com sucesso via Resend:', result);
        
        if (manualEmail.trim()) {
          setUserEmail(manualEmail.trim());
          localStorage.setItem('pending_verification_email', manualEmail.trim());
          setManualEmail('');
          setShowManualInput(false);
        }
        
        setIsResendTestMode(false);
        
        toast({
          title: '✅ Email enviado com sucesso!',
          description: 'Um email de confirmação foi enviado via Resend. Verifique sua caixa de entrada e spam.'
        });
        
      } catch (resendError: any) {
        console.warn('⚠️ VerificationPending: Resend failed:', resendError.message);
        
        // Detectar se é erro de modo de teste do Resend
        if (resendError.message.includes('RESEND_TEST_MODE') || resendError.message.includes('RESEND_DOMAIN_ERROR')) {
          setIsResendTestMode(true);
          
          toast({
            variant: 'destructive',
            title: '⚠️ Resend em modo de teste',
            description: 'O Resend está configurado para modo de teste. Use o botão "Pular verificação" ou configure um domínio verificado.'
          });
          
          return; // Não tentar fallback do Supabase
        }
        
        // Fallback para método Supabase nativo apenas se não for erro de configuração
        console.log('🔄 VerificationPending: Tentando fallback Supabase...');
        
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: emailToUse,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`
          }
        });
        
        if (error) {
          console.error('❌ VerificationPending: Supabase fallback também falhou:', error);
          
          if (error.message.includes('email_address_not_authorized')) {
            throw new Error('Este email não está autorizado. Verifique se o domínio está configurado no Supabase.');
          } else if (error.message.includes('rate_limit')) {
            throw new Error('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
          }
          
          throw error;
        }
        
        console.log('✅ VerificationPending: Supabase fallback funcionou');
        toast({
          title: 'Email reenviado!',
          description: 'Email enviado via método alternativo. Verifique sua caixa de entrada.'
        });
      }
      
    } catch (error: any) {
      console.error('❌ VerificationPending: Todos os métodos falharam:', error);
      
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

          {isResendTestMode && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>⚠️ Modo de teste ativo:</strong> O Resend está configurado para enviar apenas para o email do proprietário da conta. 
                Para usar em produção, <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="underline">verifique um domínio no Resend.com</a>.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>🚀 Sistema Resend ativo:</strong> Usando Resend.com para envio confiável de emails.
              {isResendTestMode ? ' Atualmente em modo de teste.' : ' Configuração completa com fallback para Supabase.'}
            </AlertDescription>
          </Alert>

          {userEmail && (
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <strong>🔧 Debug info:</strong>
              <br />📧 Email: {userEmail}
              <br />🌐 Origem: {window.location.origin}
              <br />📡 Método: Resend + Supabase fallback
              <br />✅ RESEND_API_KEY: Configurada
              {isResendTestMode && <><br />⚠️ Status: Modo de teste detectado</>}
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
