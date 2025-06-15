
import { supabase } from '@/integrations/supabase/client';

export interface SendVerificationEmailParams {
  email: string;
  redirectTo?: string;
}

export const sendVerificationEmailViaResend = async ({ 
  email, 
  redirectTo 
}: SendVerificationEmailParams) => {
  try {
    console.log('sendVerificationEmailViaResend: Enviando para', email);
    
    const { data, error } = await supabase.functions.invoke('send-verification-email', {
      body: {
        email,
        redirectTo
      }
    });
    
    if (error) {
      console.error('sendVerificationEmailViaResend: Erro na Edge Function:', error);
      throw error;
    }
    
    console.log('sendVerificationEmailViaResend: Sucesso:', data);
    return data;
    
  } catch (error: any) {
    console.error('sendVerificationEmailViaResend: Erro geral:', error);
    throw new Error(error.message || 'Falha ao enviar email de verificação');
  }
};
