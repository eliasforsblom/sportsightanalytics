import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedPostProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
}

export const FeaturedPost = ({ id, title: defaultTitle, excerpt: defaultExcerpt, category, imageUrl }: FeaturedPostProps) => {
  const { language } = useLanguage();

  const { data: translation } = useQuery({
    queryKey: ['post-translation', id, language],
    queryFn: async () => {
      if (language === 'en') return null;
      
      const { data } = await supabase
        .from('post_translations')
        .select('title, excerpt')
        .eq('post_id', id)
        .eq('language', language)
        .single();
      
      return data;
    },
  });

  const title = translation?.title || defaultTitle;
  const excerpt = translation?.excerpt || defaultExcerpt;

  return (
    <Link to={`/research/${id}`} className="block relative w-full h-[400px] md:h-[500px] lg:h-[600px] group">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-16 px-8 md:pb-10 md:pt-20 md:px-10 lg:pb-12 lg:pt-24 lg:px-12 transform transition-all duration-300 group-hover:translate-y-[-8px]">
          <div className="max-w-3xl mx-auto">
            <Link
              to={`/research?category=${category}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-block px-4 py-1.5 mb-4 text-sm bg-white/95 text-gray-900 rounded-full hover:bg-white transition-colors duration-200 font-medium"
            >
              {category}
            </Link>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:underline decoration-2 underline-offset-4 leading-tight">
              {title}
            </h2>
            <p className="text-white/90 text-base md:text-lg lg:text-xl leading-relaxed">
              {excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};