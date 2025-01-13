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

const Index = () => {
  // Temporary mock data - moved featured post into an array
  const featuredPosts = [
    {
      id: "press-resistance",
      title: "The Evolution of Press Resistance in Modern Football",
      excerpt: "An in-depth analysis of how top teams are adapting their build-up play to counter high-pressing tactics, with data from the top 5 European leagues.",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1936&auto=format&fit=crop",
      category: "Tactical Analysis"
    },
    {
      id: "player-recruitment",
      title: "Data-Driven Player Recruitment",
      excerpt: "How leading clubs are using advanced metrics to identify undervalued talent in the transfer market.",
      imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2066&auto=format&fit=crop",
      category: "Recruitment"
    },
    {
      id: "set-piece-efficiency",
      title: "Set-Piece Efficiency Analysis",
      excerpt: "Breaking down the most effective set-piece routines from the 2023/24 season with expected goals data.",
      imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2033&auto=format&fit=crop",
      category: "Performance Analysis"
    }
  ];

  const recentPosts = [
    {
      id: "goalkeeper-distribution",
      title: "Goalkeeper Distribution Patterns",
      excerpt: "Analysis of how modern goalkeepers are influencing play through their distribution choices.",
      date: "Feb 10, 2024",
      category: "Player Analysis",
      imageUrl: "https://images.unsplash.com/photo-1602472097151-72eeec7a3185?q=80&w=2071&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Carousel className="w-full">
          <CarouselContent>
            {featuredPosts.map((post, index) => (
              <CarouselItem key={index}>
                <FeaturedPost {...post} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
      
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Latest Research</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;