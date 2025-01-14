import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { page_path } = await req.json()
    
    // Get visitor's IP address
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const today = new Date().toISOString().split('T')[0]
    
    console.log('Tracking pageview for:', page_path, 'from IP:', clientIP)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, check if this IP has already visited today
    const { data: existingVisit } = await supabaseClient
      .from('analytics')
      .select('id, visitor_count')
      .eq('visit_date', today)
      .eq('page_path', page_path)
      .single()

    if (existingVisit) {
      // Update last_visit timestamp
      await supabaseClient
        .from('analytics')
        .update({ 
          last_visit: new Date().toISOString()
        })
        .eq('id', existingVisit.id)

      console.log('Updated existing visit record')
    } else {
      // Create new visit record
      const { error: insertError } = await supabaseClient
        .from('analytics')
        .insert({
          page_path,
          visit_date: today,
          visitor_count: 1,
          last_visit: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error inserting visit:', insertError)
        throw insertError
      }

      console.log('Created new visit record')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Failed to track pageview:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})