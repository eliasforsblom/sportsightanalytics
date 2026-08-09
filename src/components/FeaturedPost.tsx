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
    <div className="group relative h-[420px] w-full overflow-hidden md:h-[500px]">
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
            className="mb-5 inline-flex rounded bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            {category}
          </Link>
          <h2 className="mb-4 max-w-3xl text-3xl leading-[1.08] text-on-media md:text-5xl">
            <Link to={`/research/${id}`}>{title}</Link>
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-on-media-muted md:text-lg">
            {excerpt}
          </p>
          <Link
            to={`/research/${id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-on-media"
          >
            Read the full analysis
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

