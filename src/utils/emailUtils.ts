
import { supabase } from '@/integrations/supabase/client';

export interface SendVerificationEmailParams {
  email: string;
  redirectTo?: string;
}

export const sendVerificationEmailViaSupabase = async ({ 
  email, 
  redirectTo 
}: SendVerificationEmailParams) => {
  try {
    console.log('🚀 sendVerificationEmailViaSupabase: Iniciando envio para', email);
    console.log('🔗 sendVerificationEmailViaSupabase: Redirect URL:', redirectTo);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectTo
      }
    });
    
    if (error) {
      console.error('❌ sendVerificationEmailViaSupabase: Erro:', error);
      throw error;
    }
    
    console.log('✅ sendVerificationEmailViaSupabase: Sucesso');
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ sendVerificationEmailViaSupabase: Erro geral:', error);
    throw new Error(error.message || 'Falha ao enviar email de verificação');
  }
};

export const resendCustomVerificationEmail = async ({
  email,
  redirectTo,
}: { email: string, redirectTo: string }) => {
  try {
    console.log('🚀 resendCustomVerificationEmail: Iniciando reenvio para', email);

    // Chama a edge function, que vai encontrar o user ID pelo email
    const { error } = await supabase.functions.invoke('send-verification-email', {
      body: { email, redirectTo },
    });

    if (error) {
      console.error('❌ resendCustomVerificationEmail: Erro:', error);
      throw error;
    }

    console.log('✅ resendCustomVerificationEmail: Sucesso');
    return { success: true };
  } catch (error: any) {
    console.error('❌ resendCustomVerificationEmail: Erro geral:', error);
    throw new Error(error.message || 'Falha ao reenviar email de verificação');
  }
};
