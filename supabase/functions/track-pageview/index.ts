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

    // Get location data from IP
    const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}`)
    const geoData = await geoResponse.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Track regular pageview
    const { data: existingVisit } = await supabaseClient
      .from('analytics')
      .select('id, visitor_count')
      .eq('visit_date', today)
      .eq('page_path', page_path)
      .single()

    if (existingVisit) {
      await supabaseClient
        .from('analytics')
        .update({ 
          last_visit: new Date().toISOString()
        })
        .eq('id', existingVisit.id)

      console.log('Updated existing visit record')
    } else {
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

    // Track location data if available
    if (geoData.status === 'success') {
      const { data: existingLocation } = await supabaseClient
        .from('viewer_locations')
        .select('id, visitor_count')
        .eq('visit_date', today)
        .eq('country', geoData.country)
        .eq('city', geoData.city || null)
        .single()

      if (existingLocation) {
        await supabaseClient
          .from('viewer_locations')
          .update({
            visitor_count: (existingLocation.visitor_count || 0) + 1
          })
          .eq('id', existingLocation.id)
        
        console.log('Updated existing location record')
      } else {
        const { error: locationError } = await supabaseClient
          .from('viewer_locations')
          .insert({
            country: geoData.country,
            city: geoData.city,
            visitor_count: 1
          })

        if (locationError) {
          console.error('Error inserting location:', locationError)
          throw locationError
        }
        console.log('Created new location record')
      }
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