import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface PostCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
}

export const PostCard = ({ title, excerpt, date, category, imageUrl }: PostCardProps) => {
  return (
    <Link to="/research" className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary">{category}</Badge>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
          <CardTitle className="text-xl hover:text-secondary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-3">{excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  );
};