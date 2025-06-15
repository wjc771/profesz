
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  let redirectTo = url.searchParams.get('redirectTo')

  console.log('verify-email: Function invoked with token', token)

  // Fallback redirect URL
  if (!redirectTo) {
      const siteUrl = Deno.env.get('SITE_URL') || Deno.env.get('SUPABASE_URL')?.replace('.co', '.app') || '/'
      redirectTo = `${siteUrl}/onboarding`
  }

  if (!token) {
    return Response.redirect(`${redirectTo}?error=missing_token`, 302)
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: verificationData, error: findError } = await supabaseAdmin
      .from('email_verifications')
      .select('id, user_id, expires_at, verified_at')
      .eq('token', token)
      .single()

    if (findError || !verificationData) {
      console.error('verify-email: Token not found or error finding it.', findError)
      return Response.redirect(`${redirectTo}?error=invalid_token`, 302)
    }

    if (verificationData.verified_at) {
      console.log('verify-email: Token already used.')
      return Response.redirect(`${redirectTo}?message=already_verified`, 302)
    }

    if (new Date(verificationData.expires_at) < new Date()) {
      console.log('verify-email: Token expired.')
      return Response.redirect(`${redirectTo}?error=token_expired`, 302)
    }

    const { error: userUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      verificationData.user_id,
      { email_confirm: true }
    )

    if (userUpdateError) {
      console.error('verify-email: Error updating user:', userUpdateError)
      throw userUpdateError
    }
    console.log('verify-email: User email confirmed successfully for user_id:', verificationData.user_id)

    const { error: tokenUpdateError } = await supabaseAdmin
      .from('email_verifications')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', verificationData.id)

    if (tokenUpdateError) {
      console.error('verify-email: Failed to mark token as verified:', tokenUpdateError)
    }
    console.log('verify-email: Token marked as verified. Redirecting...')

    return Response.redirect(redirectTo, 302)

  } catch (error) {
    console.error('verify-email: General error:', error)
    return Response.redirect(`${redirectTo}?error=verification_failed`, 302)
  }
})
