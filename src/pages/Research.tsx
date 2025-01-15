import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Research = () => {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Track post view when the post is loaded
  useEffect(() => {
    const trackPostView = async () => {
      if (!post?.id) return;

      try {
        // Insert the view record
        const { error: viewError } = await supabase
          .from("post_views")
          .insert({
            post_id: post.id,
            page_path: `/research/${post.id}`,
          });

        if (viewError) {
          console.error("Error tracking post view:", viewError);
          return;
        }

        // Update the post's view count using the RPC function
        const { error: updateError } = await supabase
          .rpc('increment_post_views', {
            post_id: post.id
          });

        if (updateError) {
          console.error("Error updating post views:", updateError);
        }
      } catch (error) {
        console.error("Error tracking post view:", error);
      }
    };

    trackPostView();
  }, [post?.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
      <p>Views: {post?.views}</p>
    </div>
  );
};

export default Research;