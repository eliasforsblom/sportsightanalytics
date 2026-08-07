import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePostTranslation } from "@/hooks/use-posts";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
}

export const PostCard = ({
  id,
  title: defaultTitle,
  excerpt: defaultExcerpt,
  date,
  category,
  imageUrl,
}: PostCardProps) => {
  const { data: translation } = usePostTranslation(id);

  const title = translation?.title || defaultTitle;
  const excerpt = translation?.excerpt || defaultExcerpt;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />
        <Link
          to={`/research?category=${encodeURIComponent(category)}`}
          className="absolute left-4 top-4 z-10"
        >
          <Badge className="border border-primary/30 bg-background/80 text-primary backdrop-blur-md hover:bg-background">
            {category}
          </Badge>
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="mb-3 font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {date}
        </span>
        <h3 className="mb-3 text-xl font-bold leading-snug transition-colors group-hover:text-primary">
          <Link to={`/research/${id}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-primary">
          Read analysis
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
};
