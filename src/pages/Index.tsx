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

const Index = () => {
  const latestPosts = [
    {
      id: "press-resistance",
      title: "The Evolution of Press Resistance in Modern Football",
      excerpt: "An in-depth analysis of how top teams are adapting their build-up play to counter high-pressing tactics, with data from the top 5 European leagues.",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1936&auto=format&fit=crop",
      category: "Tactical Analysis",
      date: "Feb 20, 2024"
    },
    {
      id: "player-recruitment",
      title: "Data-Driven Player Recruitment",
      excerpt: "How leading clubs are using advanced metrics to identify undervalued talent in the transfer market.",
      imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2066&auto=format&fit=crop",
      category: "Recruitment",
      date: "Feb 18, 2024"
    },
    {
      id: "set-piece-efficiency",
      title: "Set-Piece Efficiency Analysis",
      excerpt: "Breaking down the most effective set-piece routines from the 2023/24 season with expected goals data.",
      imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2033&auto=format&fit=crop",
      category: "Performance Analysis",
      date: "Feb 15, 2024"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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
            {latestPosts.map((post, index) => (
              <CarouselItem key={index}>
                <FeaturedPost {...post} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-4">
            <CarouselPrevious className="relative left-0 translate-y-0 h-6 w-6 md:h-7 md:w-7 rounded-none border-none bg-transparent hover:bg-transparent text-white" />
            <div className="flex gap-1 md:gap-2">
              {latestPosts.map((_, index) => (
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
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Latest Research</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {latestPosts.map((post, index) => (
            <PostCard 
              key={index}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              category={post.category}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;