import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
}

export const PostCard = ({ id, title: defaultTitle, excerpt: defaultExcerpt, date, category, imageUrl }: PostCardProps) => {
  const { language } = useLanguage();

  const { data: translation } = useQuery({
    queryKey: ['post-translation', id, language],
    queryFn: async () => {
      if (language === 'en') return null;
      
      const { data, error } = await supabase
        .from('post_translations')
        .select('title, excerpt')
        .eq('post_id', id)
        .eq('language', language)
        .single();
      
      if (error) {
        console.error('Translation fetch error:', error);
        return null;
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const title = translation?.title || defaultTitle;
  const excerpt = translation?.excerpt || defaultExcerpt;

  return (
    <Card className="overflow-hidden transition-all duration-300 h-full border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader className="p-5 md:p-6 pb-0">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <Link 
            to={`/research?category=${encodeURIComponent(category)}`}
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
        <Link to={`/research/${id}`}>
          <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="p-5 md:p-6 pt-3">
        <Link to={`/research/${id}`}>
          <p className="text-sm md:text-base text-gray-600 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </Link>
      </CardContent>
    </Card>
  );
};