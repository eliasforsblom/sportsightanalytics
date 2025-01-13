import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeaturedPostProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
}

export const FeaturedPost = ({ id, title, excerpt, imageUrl, category }: FeaturedPostProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-primary text-white h-[300px] md:h-[500px] mx-auto">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative h-full flex flex-col justify-end pb-6 md:pb-12 px-4 md:px-8">
        <Badge className="mb-3 md:mb-4 w-fit" variant="secondary">
          {category}
        </Badge>
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 max-w-2xl line-clamp-2 md:line-clamp-none">
          {title}
        </h1>
        <p className="text-base md:text-lg mb-4 md:mb-6 max-w-2xl text-gray-200 line-clamp-2 md:line-clamp-3">
          {excerpt}
        </p>
        <Link to={`/research/${id}`}>
          <Button className="w-fit text-sm md:text-base" variant="secondary">
            Read Analysis
          </Button>
        </Link>
      </div>
    </div>
  );
};