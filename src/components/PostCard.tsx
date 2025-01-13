import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Link to={`/research/${id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full border-gray-200 hover:border-gray-300">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          />
        </div>
        <CardHeader className="p-5 md:p-6 pb-0">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <Link 
              to={`/research?category=${encodeURIComponent(category)}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-block"
            >
              <Badge 
                variant="secondary" 
                className="text-xs md:text-sm hover:bg-secondary/80 transition-colors duration-200"
              >
                {category}
              </Badge>
            </Link>
            <span className="text-xs md:text-sm text-gray-500 font-medium">{date}</span>
          </div>
          <CardTitle className="text-lg md:text-xl hover:text-secondary transition-colors duration-200 line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 md:p-6 pt-3">
          <p className="text-sm md:text-base text-gray-600 line-clamp-2 md:line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};