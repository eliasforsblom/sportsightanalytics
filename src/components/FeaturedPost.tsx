import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeaturedPostProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
}

export const FeaturedPost = ({ title, excerpt, imageUrl, category }: FeaturedPostProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-primary text-white h-[500px]">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
        <Badge className="mb-4 w-fit" variant="secondary">
          {category}
        </Badge>
        <h1 className="text-4xl font-bold mb-4 max-w-2xl">{title}</h1>
        <p className="text-lg mb-6 max-w-2xl text-gray-200">{excerpt}</p>
        <Link to="/research">
          <Button className="w-fit" variant="secondary">
            Read Analysis
          </Button>
        </Link>
      </div>
    </div>
  );
};