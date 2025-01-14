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
    
    console.log('Tracking pageview for:', page_path)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upsert the analytics record for today
    const { data, error } = await supabaseClient
      .from('analytics')
      .upsert(
        {
          page_path,
          visit_date: new Date().toISOString().split('T')[0],
          last_visit: new Date().toISOString()
        },
        {
          onConflict: 'page_path,visit_date',
          ignoreDuplicates: false
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error tracking pageview:', error)
      throw error
    }

    // If successful, increment the visitor count
    const { error: updateError } = await supabaseClient
      .from('analytics')
      .update({ 
        visitor_count: (data.visitor_count || 0) + 1,
        last_visit: new Date().toISOString()
      })
      .eq('id', data.id)

    if (updateError) {
      console.error('Error updating visitor count:', updateError)
      throw updateError
    }

    console.log('Successfully tracked pageview:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
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