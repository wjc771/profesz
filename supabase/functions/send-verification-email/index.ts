
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  console.log('[SEND_VERIFICATION_EMAIL] Requisição recebida:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Método não permitido'
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { email, redirectTo } = await req.json();
    
    console.log('[SEND_VERIFICATION_EMAIL] Dados recebidos:', {
      email,
      redirectTo
    });
    
    // Validações
    if (!email) {
      console.error('[SEND_VERIFICATION_EMAIL] Email obrigatório');
      return new Response(JSON.stringify({
        error: 'Email é obrigatório'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('[SEND_VERIFICATION_EMAIL] RESEND_API_KEY não configurada');
      return new Response(JSON.stringify({
        error: 'Configuração de email não disponível'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Simular link de verificação (em produção, isso viria do Supabase)
    const verificationLink = redirectTo || `${Deno.env.get('SUPABASE_URL')?.replace('/supabase', '') || 'http://localhost:3000'}/onboarding`;
    
    console.log('[SEND_VERIFICATION_EMAIL] Link de verificação:', verificationLink);
    
    // Template de email educacional
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificação de Email - ProfesZ</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📚 ProfesZ</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Plataforma Educacional Inteligente</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verifique seu email</h2>
            
            <p>Olá!</p>
            
            <p>Obrigado por se cadastrar no <strong>ProfesZ</strong>! Para completar seu cadastro e começar a usar nossa plataforma educacional, você precisa verificar seu endereço de email.</p>
            
            <p>Clique no botão abaixo para verificar seu email:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);">
                ✅ Verificar Email
              </a>
            </div>
            
            <p><small style="color: #666;">Se o botão não funcionar, copie e cole este link no seu navegador:</small></p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">${verificationLink}</p>
            
            <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 20px; margin: 30px 0; border-radius: 5px;">
              <h3 style="color: #4f46e5; margin: 0 0 10px 0; font-size: 16px;">🎯 O que você pode fazer no ProfesZ:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #555;">
                <li>Criar planos de aula personalizados</li>
                <li>Gerar avaliações inteligentes</li>
                <li>Verificar atividades pedagogicamente</li>
                <li>Acompanhar o progresso dos alunos</li>
              </ul>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px; color: #666; font-size: 14px;">
              <p><strong>⚠️ Importante:</strong> Este link de verificação é válido por 24 horas.</p>
              <p>Se você não se cadastrou no ProfesZ, pode ignorar este email com segurança.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 ProfesZ - Plataforma Educacional Inteligente</p>
            <p>Oferecemos <strong>verificação</strong> e <strong>avaliação assistida</strong>, não correção definitiva.</p>
          </div>
        </body>
      </html>
    `;
    
    // Enviar email via Resend
    console.log('[SEND_VERIFICATION_EMAIL] Enviando email via Resend...');
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'ProfesZ <onboarding@resend.dev>',
        to: [email],
        subject: '📧 Verificação de Email - ProfesZ',
        html: emailHtml
      })
    });
    
    const resendData = await resendResponse.json();
    console.log('[SEND_VERIFICATION_EMAIL] Resposta do Resend:', {
      status: resendResponse.status,
      success: resendResponse.ok,
      data: resendData
    });
    
    if (!resendResponse.ok) {
      console.error('[SEND_VERIFICATION_EMAIL] Erro no Resend:', resendData);
      throw new Error(`Resend API error: ${JSON.stringify(resendData)}`);
    }
    
    console.log('[SEND_VERIFICATION_EMAIL] ✅ Email enviado com sucesso:', resendData.id);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Email de verificação enviado com sucesso',
      emailId: resendData.id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[SEND_VERIFICATION_EMAIL] Erro geral:', error);
    return new Response(JSON.stringify({
      error: 'Erro interno ao enviar email',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
