import { Link } from "react-router-dom";

interface FeaturedPostProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
}

export const FeaturedPost = ({ id, title, excerpt, category, imageUrl }: FeaturedPostProps) => {
  return (
    <Link to={`/research/${id}`} className="block relative w-full h-[400px] md:h-[500px] lg:h-[600px] group">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
          <Link
            to={`/research?category=${category}`}
            className="inline-block px-3 py-1 mb-3 text-sm bg-white/90 text-gray-800 rounded-full hover:bg-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {category}
          </Link>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:underline">
            {title}
          </h2>
          <p className="text-white/90 text-sm md:text-base lg:text-lg line-clamp-2">
            {excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
};