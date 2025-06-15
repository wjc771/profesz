
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
    
    // Detectar erros específicos do Resend
    const errorMessage = error.message || '';
    const errorDetails = error.details || '';
    
    if (errorMessage.includes('Function not found')) {
      throw new Error('Edge Function não encontrada. Verifique se está deployada.');
    } else if (errorMessage.includes('RESEND_API_KEY')) {
      throw new Error('API Key do Resend não configurada. Verifique os secrets do Supabase.');
    } else if (errorDetails.includes('You can only send testing emails to your own email address')) {
      throw new Error('RESEND_TEST_MODE: O Resend está em modo de teste e só permite envio para o email do proprietário da conta. Para usar em produção, verifique um domínio no Resend.com');
    } else if (errorDetails.includes('verify a domain')) {
      throw new Error('RESEND_DOMAIN_ERROR: É necessário verificar um domínio no Resend.com para enviar emails para outros destinatários.');
    } else if (errorMessage.includes('Invalid email')) {
      throw new Error('Email inválido. Verifique o formato do email.');
    }
    
    throw new Error(error.message || 'Falha ao enviar email de verificação via Resend');
  }
};
