import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { PostCard } from "@/components/PostCard";

const Research = () => {
  const { id } = useParams();

  // All research posts data
  const allPosts = [
    {
      id: "press-resistance",
      title: "The Evolution of Press Resistance in Modern Football",
      excerpt: "An in-depth analysis of how top teams are adapting their build-up play to counter high-pressing tactics, with data from the top 5 European leagues.",
      date: "Feb 18, 2024",
      category: "Tactical Analysis",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1936&auto=format&fit=crop",
      content: `
        <div class="prose prose-lg max-w-none">
          <p>An in-depth analysis of how top teams are adapting their build-up play to counter high-pressing tactics, with data from the top 5 European leagues.</p>
          
          <h2>Key Findings</h2>
          <p>Our analysis shows that successful teams employ various strategies to beat the press:</p>
          <ul>
            <li>Positional rotations between midfielders and fullbacks</li>
            <li>Strategic use of the goalkeeper as an additional passing option</li>
            <li>Quick switches of play to exploit space</li>
          </ul>

          <h2>Statistical Analysis</h2>
          <p>When examining the data from the top 5 leagues, we found that teams with higher press resistance success rates (PRSR) consistently achieved better results:</p>
          
          <div class="my-8 p-4 bg-accent rounded-lg">
            <p class="font-mono text-center">PRSR = (Successful Progressive Passes / Total Progressive Passes) × 100</p>
          </div>

          <h2>Visual Analysis</h2>
          <div class="aspect-video relative my-8">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1936&auto=format&fit=crop"
              alt="Tactical analysis diagram"
              class="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      `
    },
    {
      id: "player-recruitment",
      title: "Data-Driven Player Recruitment",
      excerpt: "How leading clubs are using advanced metrics to identify undervalued talent in the transfer market.",
      date: "Feb 15, 2024",
      category: "Recruitment",
      imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2066&auto=format&fit=crop"
    },
    {
      id: "set-piece-efficiency",
      title: "Set-Piece Efficiency Analysis",
      excerpt: "Breaking down the most effective set-piece routines from the 2023/24 season with expected goals data.",
      date: "Feb 12, 2024",
      category: "Performance Analysis",
      imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2033&auto=format&fit=crop"
    },
    {
      id: "goalkeeper-distribution",
      title: "Goalkeeper Distribution Patterns",
      excerpt: "Analysis of how modern goalkeepers are influencing play through their distribution choices.",
      date: "Feb 10, 2024",
      category: "Player Analysis",
      imageUrl: "https://images.unsplash.com/photo-1602472097151-72eeec7a3185?q=80&w=2071&auto=format&fit=crop"
    }
  ];

  // If there's an ID parameter, show the full post
  if (id) {
    const post = allPosts.find(post => post.id === id);
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
              <p className="text-gray-500">{post.date}</p>
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }}
            />
          </article>
        </main>
      </div>
    );
  }

  // Otherwise, show the list of all posts
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">All Research</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Research;
