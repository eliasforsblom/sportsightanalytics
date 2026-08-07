import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePostTranslation } from "@/hooks/use-posts";

interface FeaturedPostProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
}

export const FeaturedPost = ({
  id,
  title: defaultTitle,
  excerpt: defaultExcerpt,
  category,
  imageUrl,
}: FeaturedPostProps) => {
  const { data: translation } = usePostTranslation(id);

  const title = translation?.title || defaultTitle;
  const excerpt = translation?.excerpt || defaultExcerpt;

  return (
    <div className="group relative h-[420px] w-full overflow-hidden md:h-[520px] lg:h-[580px]">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-veil" />

      <div className="absolute inset-x-0 bottom-0 px-6 pb-20 pt-24 md:px-12 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <Link
            to={`/research?category=${encodeURIComponent(category)}`}
            className="mb-5 inline-flex rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-md transition-colors hover:bg-primary/20"
          >
            {category}
          </Link>
          <h2 className="mb-4 max-w-3xl text-3xl font-bold leading-[1.08] md:text-5xl">
            <Link to={`/research/${id}`}>{title}</Link>
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
            {excerpt}
          </p>
          <Link
            to={`/research/${id}`}
            className="inline-flex items-center gap-2 font-display text-sm font-semibold text-primary"
          >
            Read the full analysis
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
