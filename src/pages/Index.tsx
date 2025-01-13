import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FeaturedPost } from "@/components/FeaturedPost";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const { data: highlightedPosts = [], isLoading: isLoadingHighlighted } = useQuery({
    queryKey: ['highlighted-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('highlighted', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: latestPosts = [], isLoading: isLoadingLatest } = useQuery({
    queryKey: ['latest-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoadingHighlighted || isLoadingLatest) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {highlightedPosts.length > 0 && (
        <div className="container mx-auto px-4 py-4 md:py-8">
          <Carousel 
            className="w-full relative" 
            opts={{
              align: "start",
              loop: true
            }}
            setApi={setApi}
          >
            <CarouselContent>
              {highlightedPosts.map((post) => (
                <CarouselItem key={post.id}>
                  <FeaturedPost 
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    imageUrl={post.image_url}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-4">
              <CarouselPrevious className="relative left-0 translate-y-0 h-6 w-6 md:h-7 md:w-7 rounded-none border-none bg-transparent hover:bg-transparent text-white" />
              <div className="flex gap-1 md:gap-2">
                {highlightedPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-1.5 md:h-2 rounded-full transition-all ${
                      currentSlide === index ? "bg-white w-3 md:w-4" : "bg-white/50 w-1.5 md:w-2"
                    }`}
                  />
                ))}
              </div>
              <CarouselNext className="relative right-0 translate-y-0 h-6 w-6 md:h-7 md:w-7 rounded-none border-none bg-transparent hover:bg-transparent text-white" />
            </div>
          </Carousel>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Latest Research</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {latestPosts.map((post) => (
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

export default Index;