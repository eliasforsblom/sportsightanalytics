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

  const { data: posts, isLoading, error } = useQuery({
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-lg shadow-sm h-96">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

  // If there's an ID parameter, show the full post with Medium-style design
  if (id && posts) {
    const post = posts.find(post => post.id === id);
    
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
        
        <article className="w-full">
          {/* Hero Image Section */}
          <div className="w-full h-[60vh] relative mb-8">
            <div className="absolute inset-0 bg-black/40 z-10" /> {/* Darker overlay */}
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-20" />
            <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 pb-12 z-30">
              <Badge 
                variant="secondary" 
                className="mb-4 bg-white/90 text-gray-800 hover:bg-white/100"
              >
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-gray-200 mb-4">
                {post.excerpt}
              </p>
              <div className="text-sm text-gray-300">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {post.views && ` · ${post.views} views`}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto px-4 pb-16">
            <div 
              className="prose prose-lg max-w-none text-left prose-headings:font-bold prose-headings:text-gray-900 
                prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80
                prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 
                prose-pre:bg-gray-100 prose-img:rounded-lg prose-blockquote:border-l-primary
                prose-blockquote:text-gray-700 prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    );
  }

  // Show the list of posts (keeping existing code for the list view)
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