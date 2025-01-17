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
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 pb-12 pt-32 px-8 md:pb-16 md:pt-40 md:px-10 lg:pb-20 lg:pt-48 lg:px-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <Link
              to={`/research?category=${category}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-block px-3 py-1 text-sm bg-white/10 text-white/90 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
            >
              {category}
            </Link>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight group-hover:underline decoration-2 underline-offset-4">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              {excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};