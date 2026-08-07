import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
}

const setMeta = (selector: string, attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

/**
 * Lightweight, dependency-free document head manager.
 * Replaces react-helmet (unmaintained / React 18 unsafe lifecycles).
 */
export const Seo = ({
  title,
  description,
  image,
  type = "website",
  canonicalPath,
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    document.title = title;

    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }

    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[property="og:type"]', "property", "og:type", type);

    if (image) {
      setMeta('meta[property="og:image"]', "property", "og:image", image);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }

    const href = `${window.location.origin}${canonicalPath ?? window.location.pathname}`;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;
    setMeta('meta[property="og:url"]', "property", "og:url", href);
  }, [title, description, image, type, canonicalPath]);

  useEffect(() => {
    if (!jsonLd) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [jsonLd]);

  return null;
};
