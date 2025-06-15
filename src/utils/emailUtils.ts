
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
