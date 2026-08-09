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
    <article className="group relative flex h-full flex-col">
      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <Link
            to={`/research?category=${encodeURIComponent(category)}`}
            className="relative z-10 text-primary transition-colors hover:text-primary-glow"
          >
            {category}
          </Link>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{date}</span>
        </div>

        <h3 className="mb-3 text-2xl leading-snug transition-colors group-hover:text-primary">
          <Link to={`/research/${id}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read analysis
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
};

