import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

interface ResearchParams {
  id?: string;
}

const Research = () => {
  // In a real application, you would fetch the post data based on the ID
  // This is mock data for demonstration
  const post = {
    title: "The Evolution of Press Resistance in Modern Football",
    date: "Feb 15, 2024",
    category: "Tactical Analysis",
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
    `,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1936&auto=format&fit=crop",
  };

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
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </div>
  );
};

export default Research;