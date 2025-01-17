import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
}

export const PostCard = ({ id, title, excerpt, date, category, imageUrl }: PostCardProps) => {
  return (
    <Link to={`/research/${id}`} className="block group">
      <Card className="overflow-hidden border-none shadow-none hover:bg-accent/50 transition-colors duration-300">
        <div className="grid md:grid-cols-12 gap-6 p-4">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <Link 
                to={`/research?category=${encodeURIComponent(category)}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-block"
              >
                <Badge 
                  variant="secondary" 
                  className="text-xs font-medium hover:bg-secondary/80 transition-colors duration-200"
                >
                  {category}
                </Badge>
              </Link>
              <span className="text-sm text-muted-foreground">{date}</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            
            <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
              {excerpt}
            </p>
          </div>
          
          <div className="md:col-span-4 aspect-[4/3] md:aspect-square relative overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
};