import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
        .is('draft', false)
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
        .is('draft', false)
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="text-gray-400">Loading content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {highlightedPosts.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <Carousel 
            className="w-full relative rounded-xl overflow-hidden shadow-2xl" 
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
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-4 z-10">
              <CarouselPrevious className="relative left-0 translate-y-0 h-8 w-8 md:h-9 md:w-9 rounded-full border-none bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors text-white shadow-lg" />
              <div className="flex gap-1.5 md:gap-2 backdrop-blur-sm bg-black/10 px-4 py-2 rounded-full">
                {highlightedPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? "bg-white w-4 md:w-6" : "bg-white/50 w-1.5 md:w-2 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
              <CarouselNext className="relative right-0 translate-y-0 h-8 w-8 md:h-9 md:w-9 rounded-full border-none bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors text-white shadow-lg" />
            </div>
          </Carousel>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Latest Research
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Explore our latest insights and analysis on football transfer market trends and historical data.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {latestPosts.map((post) => (
            <div key={post.id} className="transform hover:-translate-y-1 transition-all duration-300">
              <PostCard 
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
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/research">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              View More Research
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;