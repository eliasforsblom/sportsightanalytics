import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { useParams, useSearchParams } from "react-router-dom";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Research = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // If there's an ID parameter, show the full post
  if (id && posts) {
    const post = posts.find(post => post.id === id);
    if (!post) return <div>Post not found</div>;

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-12">
          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-gray-500">
                {new Date(post.created_at || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            {categoryFilter ? `${categoryFilter} Research` : 'All Research'}
          </h1>
          {categoryFilter && (
            <Badge 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('category');
                window.history.pushState({}, '', url);
                window.location.reload();
              }}
            >
              Clear Filter
            </Badge>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <PostCard 
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              date={new Date(post.created_at || '').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
              category={post.category}
              imageUrl={post.image_url}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Research;