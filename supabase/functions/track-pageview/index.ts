
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { session_id } = await req.json()
    // Ensure date is in ISO format without any issues
    const today = new Date().toISOString().split('T')[0]
    
    console.log('Tracking pageview:', { session_id, today })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Track pageview
    const { data: existingVisit, error: selectError } = await supabaseClient
      .from('analytics')
      .select('id, visitor_count')
      .eq('visit_date', today)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error selecting visit:', selectError)
      throw selectError
    }

    if (existingVisit) {
      const { error: updateError } = await supabaseClient
        .from('analytics')
        .update({ 
          visitor_count: existingVisit.visitor_count + 1
        })
        .eq('id', existingVisit.id)

      if (updateError) {
        console.error('Error updating visit:', updateError)
        throw updateError
      }
      console.log('Updated existing visit record')
    } else {
      const { error: insertError } = await supabaseClient
        .from('analytics')
        .insert({
          visit_date: today,
          visitor_count: 1
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
