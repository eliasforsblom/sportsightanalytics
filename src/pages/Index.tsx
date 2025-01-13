import { Navbar } from "@/components/Navbar";
import { FeaturedPost } from "@/components/FeaturedPost";
import { PostCard } from "@/components/PostCard";

const Index = () => {
  // Temporary mock data
  const featuredPost = {
    title: "The Evolution of Press Resistance in Modern Football",
    excerpt: "An in-depth analysis of how top teams are adapting their build-up play to counter high-pressing tactics, with data from the top 5 European leagues.",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1936&auto=format&fit=crop",
    category: "Tactical Analysis"
  };

  const recentPosts = [
    {
      title: "Data-Driven Player Recruitment",
      excerpt: "How leading clubs are using advanced metrics to identify undervalued talent in the transfer market.",
      date: "Feb 15, 2024",
      category: "Recruitment",
      imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2066&auto=format&fit=crop"
    },
    {
      title: "Set-Piece Efficiency Analysis",
      excerpt: "Breaking down the most effective set-piece routines from the 2023/24 season with expected goals data.",
      date: "Feb 12, 2024",
      category: "Performance Analysis",
      imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2033&auto=format&fit=crop"
    },
    {
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
      <FeaturedPost {...featuredPost} />
      
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