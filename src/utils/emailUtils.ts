
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
    console.log('🚀 sendVerificationEmailViaResend: Iniciando envio para', email);
    console.log('🔗 sendVerificationEmailViaResend: Redirect URL:', redirectTo);
    
    const { data, error } = await supabase.functions.invoke('send-verification-email', {
      body: {
        email,
        redirectTo
      }
    });
    
    if (error) {
      console.error('❌ sendVerificationEmailViaResend: Erro na Edge Function:', error);
      throw error;
    }
    
    console.log('✅ sendVerificationEmailViaResend: Sucesso:', data);
    return data;
    
  } catch (error: any) {
    console.error('❌ sendVerificationEmailViaResend: Erro geral:', error);
    
    // Melhor detalhamento dos erros
    if (error.message?.includes('Function not found')) {
      throw new Error('Edge Function não encontrada. Verifique se está deployada.');
    } else if (error.message?.includes('RESEND_API_KEY')) {
      throw new Error('API Key do Resend não configurada. Verifique os secrets do Supabase.');
    } else if (error.message?.includes('Invalid email')) {
      throw new Error('Email inválido. Verifique o formato do email.');
    }
    
    throw new Error(error.message || 'Falha ao enviar email de verificação via Resend');
  }
};
