import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { useParams, useSearchParams } from "react-router-dom";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Research = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', categoryFilter, id],
    queryFn: async () => {
      let query = supabase.from('posts').select('*');
      
      if (id) {
        query = query.eq('id', id);
      } else if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          {id ? (
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-12 w-3/4 mb-6" />
              <Skeleton className="h-6 w-48 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ) : (
            <div className="animate-pulse">
              <Skeleton className="h-8 w-1/4 mb-8" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-lg shadow-sm h-96">
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Posts</h2>
            <p className="text-gray-600">There was an error loading the posts. Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  // If there's an ID parameter, show the full post
  if (id && posts) {
    const post = posts[0]; // Since we filtered by ID, we expect only one post
    
    // Show not found state for single post
    if (!post) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
              <p className="text-gray-600 mb-8">The post you're looking for doesn't exist or has been removed.</p>
              <a 
                href="/research" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View all research posts
              </a>
            </div>
          </main>
        </div>
      );
    }

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

            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-auto rounded-lg mb-8"
            />

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </main>
      </div>
    );
  }

  // Show the list of posts
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
        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
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
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Posts Found</h2>
            <p className="text-gray-600">
              {categoryFilter 
                ? `No posts found in the ${categoryFilter} category.` 
                : 'No posts have been published yet.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Research;