import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function useTrackPageview() {
  const location = useLocation()

  useEffect(() => {
    const trackPageview = async () => {
      try {
        await fetch("/functions/v1/track-pageview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_path: location.pathname,
          }),
        })
      } catch (error) {
        console.error("Failed to track pageview:", error)
      }
    }

    trackPageview()
  }, [location.pathname])
}