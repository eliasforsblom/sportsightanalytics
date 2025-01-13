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
    <div className="relative overflow-hidden rounded-xl bg-primary text-white h-[300px] md:h-[500px] mx-auto shadow-xl">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 hover:scale-105"
      />
      <div className="relative h-full flex flex-col justify-end pb-8 md:pb-12 px-6 md:px-10">
        <Badge className="mb-4 md:mb-6 w-fit bg-white/90 text-primary hover:bg-white">
          {category}
        </Badge>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-5 max-w-3xl line-clamp-2 md:line-clamp-none">
          {title}
        </h1>
        <p className="text-base md:text-lg mb-5 md:mb-7 max-w-2xl text-gray-100 line-clamp-2 md:line-clamp-3">
          {excerpt}
        </p>
        <Link to={`/research/${id}`}>
          <Button className="w-fit text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200" variant="secondary">
            Read Analysis
          </Button>
        </Link>
      </div>
    </div>
  );
};