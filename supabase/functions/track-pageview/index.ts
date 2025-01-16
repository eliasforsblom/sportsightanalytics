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
    const { page_path, session_id } = await req.json()
    
    // Get visitor's IP address and referrer
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const referrer = req.headers.get('referer') || 'direct'
    const today = new Date().toISOString().split('T')[0]
    
    console.log('Tracking pageview:', { page_path, clientIP, referrer, session_id })

    // Extract domain from referrer
    let referrerDomain = 'direct'
    try {
      if (referrer !== 'direct') {
        const url = new URL(referrer)
        referrerDomain = url.hostname
        
        // Check if the referrer is from the same site
        const currentDomain = req.headers.get('host') || ''
        if (url.hostname === currentDomain || url.hostname.includes('localhost')) {
          referrerDomain = 'direct'
          console.log('Skipping internal referrer:', url.hostname)
        }
      }
    } catch (e) {
      console.error('Error parsing referrer URL:', e)
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Track regular pageview
    const { data: existingVisit, error: selectError } = await supabaseClient
      .from('analytics')
      .select('id, visitor_count')
      .eq('visit_date', today)
      .eq('page_path', page_path)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error selecting visit:', selectError)
      throw selectError
    }

    if (existingVisit) {
      const { error: updateError } = await supabaseClient
        .from('analytics')
        .update({ 
          last_visit: new Date().toISOString()
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

    // Get location data from IP
    let geoData = { status: 'fail', country: 'unknown', city: 'unknown' }
    try {
      const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}`)
      if (!geoResponse.ok) {
        throw new Error(`HTTP error! status: ${geoResponse.status}`)
      }
      geoData = await geoResponse.json()
      console.log('Retrieved geo data:', geoData)
    } catch (e) {
      console.error('Error fetching geo data:', e)
    }

    // Track location data if available
    if (geoData.status === 'success') {
      const { error: locationError } = await supabaseClient
        .from('viewer_locations')
        .upsert({
          country: geoData.country,
          city: geoData.city,
          visit_date: today,
          visitor_count: 1
        }, {
          onConflict: 'country,city,visit_date'
        })

      if (locationError) {
        console.error('Error upserting location:', locationError)
      } else {
        console.log('Tracked location visit')
      }
    }

    // Track referrer if external
    if (referrerDomain !== 'direct') {
      const { error: referrerError } = await supabaseClient
        .from('referrer_analytics')
        .insert({
          referrer_domain: referrerDomain,
          visit_date: today,
          visitor_count: 1,
          last_visit: new Date().toISOString(),
          session_id
        })

      if (referrerError && referrerError.code !== 'PGRST116') {
        console.error('Error inserting referrer:', referrerError)
      } else {
        console.log('Tracked referrer visit')
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