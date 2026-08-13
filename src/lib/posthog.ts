import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized) return;
  const token = import.meta.env.VITE_LOVABLE_CONNECTOR_POSTHOG_API_KEY;
  if (!token) return;

  const region = import.meta.env.VITE_LOVABLE_CONNECTOR_POSTHOG_REGION || "eu";
  const apiHost = region === "us" ? "https://us.i.posthog.com" : "https://eu.i.posthog.com";

  posthog.init(token, {
    api_host: apiHost,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
  });
  initialized = true;
}

export { posthog };
