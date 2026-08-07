import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/use-language";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  highlighted: boolean;
  draft: boolean;
  views: number | null;
  created_at: string;
}

const postsQuery = () => supabase.from("posts").select("*").eq("draft", false);

export const useHighlightedPosts = () =>
  useQuery({
    queryKey: ["posts", "highlighted"],
    queryFn: async () => {
      const { data, error } = await postsQuery()
        .eq("highlighted", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

export const useLatestPosts = (limit = 6) =>
  useQuery({
    queryKey: ["posts", "latest", limit],
    queryFn: async () => {
      const { data, error } = await postsQuery()
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

export const usePosts = (category?: string | null) =>
  useQuery({
    queryKey: ["posts", "list", category ?? "all"],
    queryFn: async () => {
      let query = postsQuery().order("created_at", { ascending: false });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

export const usePost = (id?: string) =>
  useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id!)
        .eq("draft", false)
        .maybeSingle();
      if (error) throw error;
      return data as Post | null;
    },
    enabled: Boolean(id),
  });

export interface PostTranslation {
  title: string | null;
  excerpt: string | null;
  content?: string | null;
}

/** Returns the translated fields for a post, or null when viewing in English. */
export const usePostTranslation = (id: string | undefined) => {
  const language = useLanguage((state) => state.language);

  return useQuery({
    queryKey: ["post-translation", id, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_translations")
        .select("title, excerpt, content")
        .eq("post_id", id!)
        .eq("language", language)
        .maybeSingle();

      if (error) {
        console.error("Translation fetch error:", error);
        return null;
      }
      return (data ?? null) as PostTranslation | null;
    },
    enabled: Boolean(id) && language !== "en",
    staleTime: 5 * 60_000,
  });
};
