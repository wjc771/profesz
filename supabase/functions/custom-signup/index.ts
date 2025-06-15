
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, name, userType } = await req.json()
    console.log('custom-signup: Function invoked for', { email, userType })

    if (!email || !password || !name || !userType) {
      throw new Error('Missing required parameters: email, password, name, and userType are required.')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, type: userType },
      email_confirm: false, // This creates the user with an unconfirmed email.
    })

    if (error) {
      console.error('custom-signup: Error creating user:', error)
      if (error.message.includes('User already registered')) {
        throw new Error('Este email já está cadastrado.');
      }
      throw error
    }

    console.log('custom-signup: User created successfully:', user.id)

    return new Response(JSON.stringify({ user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('custom-signup: General error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

