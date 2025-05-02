
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default when deployed to Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API SERVICE ROLE KEY - env var exported by default when deployed to Supabase
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Get the request body
    const { userId, companyId, role } = await req.json()
    
    if (!userId || !companyId || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Use direct SQL to bypass RLS policies completely for this operation
    // This is a more reliable approach than using the RPC function to avoid any RLS issues
    const { error } = await supabaseClient.rpc('assign_company_admin_role', {
      user_uuid: userId,
      company_uuid: companyId
    })

    if (error) {
      // Try an alternative approach using direct SQL if the RPC fails
      console.error('RPC failed, trying direct SQL insert:', error)
      
      // Use raw SQL insert as a fallback
      const { error: sqlError } = await supabaseClient.from('user_role_assignments')
        .insert({
          user_id: userId,
          company_id: companyId,
          role: role
        })
        
      if (sqlError) {
        console.error('Direct SQL insert failed:', sqlError)
        return new Response(
          JSON.stringify({ error: 'Failed to assign role', details: sqlError }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
