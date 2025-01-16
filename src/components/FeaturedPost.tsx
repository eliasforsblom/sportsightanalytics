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
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 transform transition-all duration-300 group-hover:translate-y-[-8px]">
          <Link
            to={`/research?category=${category}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-block px-4 py-1.5 mb-4 text-sm bg-white/95 text-gray-900 rounded-full hover:bg-white transition-colors duration-200 font-medium"
          >
            {category}
          </Link>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 group-hover:underline decoration-2 underline-offset-4 leading-tight">
            {title}
          </h2>
          <p className="text-white/90 text-sm md:text-base lg:text-lg line-clamp-2 leading-relaxed max-w-3xl">
            {excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
};