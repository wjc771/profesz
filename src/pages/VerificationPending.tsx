
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VerificationPending = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    
    try {
      // Recuperar o email da sessão atual
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email;
      
      if (!email) {
        throw new Error('Email não encontrado. Tente fazer login novamente.');
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email enviado',
        description: 'Um novo email de verificação foi enviado para o seu endereço de email.'
      });
    } catch (error: any) {
      console.error('Error resending verification:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível enviar o email de verificação. Tente novamente mais tarde.'
      });
    } finally {
      setResending(false);
    }
  };

  // Função temporária até que a verificação real seja feita pelo Supabase
  const handleVerified = () => {
    toast({
      title: 'Conta verificada',
      description: 'Simulando verificação para fins de desenvolvimento.'
    });
    navigate('/login');
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
            Enviamos um email de verificação para o seu endereço.
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleResendEmail} 
            variant="outline" 
            className="w-full"
            disabled={resending}
          >
            {resending ? 'Enviando...' : 'Reenviar email de verificação'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Já verificou?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Voltar para login
            </Link>
          </p>
          {/* Botão temporário para fins de desenvolvimento */}
          <Button 
            onClick={handleVerified} 
            variant="link" 
            className="text-xs text-muted-foreground"
          >
            (Demo: Simular verificação)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationPending;
