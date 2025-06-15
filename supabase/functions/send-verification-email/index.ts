
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@3.2.0'
import { v4 as uuidv4 } from 'npm:uuid@9.0.1'

// Lembre-se de configurar a RESEND_API_KEY nos segredos da sua Edge Function no Supabase.
const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let { userId, email, redirectTo } = await req.json()
    console.log('send-verification-email: Function invoked for', { userId, email, redirectTo })

    if ((!userId && !email) || !redirectTo) {
      throw new Error('Missing required parameters: (userId or email) and redirectTo are required.')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (!userId) {
      console.log('send-verification-email: userId not provided, fetching by email.')
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({ email: email });
      if (listError) throw listError;
      if (!users || users.length === 0) throw new Error('User not found');
      userId = users[0].id;
      console.log('send-verification-email: Found userId:', userId)
    }

    const token = uuidv4()
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    const { error: insertError } = await supabaseAdmin
      .from('email_verifications')
      .insert({ user_id: userId, email, token, expires_at })

    if (insertError) {
      console.error('send-verification-email: Error inserting token:', insertError)
      throw insertError
    }
    console.log('send-verification-email: Verification token stored successfully.')

    const verificationUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-email?token=${token}&redirectTo=${encodeURIComponent(redirectTo)}`

    console.log('send-verification-email: Sending email via Resend to', email)
    const { data, error: emailError } = await resend.emails.send({
      from: 'ProfesZ <profzi@autonomme.com>',
      to: [email],
      subject: 'Verifique seu email para ativar sua conta ProfesZ',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Bem-vindo ao ProfesZ!</h2>
          <p>Por favor, clique no botão abaixo para verificar seu endereço de email e ativar sua conta:</p>
          <a href="${verificationUrl}" style="background-color: #0d6efd; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Verificar Email</a>
          <p>Se você não se cadastrou no ProfesZ, por favor, ignore este email.</p>
          <p style="font-size: 0.9em; color: #6c757d;">O link de verificação expira em 24 horas.</p>
        </div>
      `,
    })

    if (emailError) {
      console.error('send-verification-email: Error sending email:', emailError)
      throw emailError
    }
    console.log('send-verification-email: Email sent successfully:', data)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('send-verification-email: General error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

