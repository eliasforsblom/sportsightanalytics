import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { posthog } from "@/lib/posthog";


const SESSION_KEY = "ss_session_id";

function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

export function useTrackPageview() {
  const location = useLocation();
  // Guards against React StrictMode double-invocation counting a view twice.
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (lastTracked.current === path) return;
    lastTracked.current = path;

    if (posthog.__loaded) {
      posthog.capture("$pageview", { path, $current_url: window.location.href });
    }



    supabase.functions
      .invoke("track-pageview", {
        body: {
          session_id: getSessionId(),
          path,
          referrer: document.referrer || null,
        },
      })
      .then(({ error }) => {
        if (error) console.error("Failed to track pageview:", error);
      })
      .catch((error) => console.error("Failed to track pageview:", error));
  }, [location.pathname]);
}
