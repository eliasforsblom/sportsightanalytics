import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

// Generate a random session ID when the app loads
const SESSION_ID = Math.random().toString(36).substring(2)

export function useTrackPageview() {
  const location = useLocation()

  useEffect(() => {
    const trackPageview = async () => {
      try {
        const { error } = await supabase.functions.invoke('track-pageview', {
          body: JSON.stringify({
            page_path: location.pathname,
            session_id: SESSION_ID,
          }),
        })

        if (error) {
          console.error("Failed to track pageview:", error)
        }
      } catch (error) {
        console.error("Failed to track pageview:", error)
      }
    }

    trackPageview()
  }, [location.pathname])
}