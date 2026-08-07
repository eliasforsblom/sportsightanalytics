import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo } from "@/components/Seo";
import { PostCard } from "@/components/PostCard";
import { usePost, usePosts, usePostTranslation } from "@/hooks/use-posts";
import { formatDate } from "@/lib/date-utils";

const GridSkeleton = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-[420px] rounded-2xl" />
    ))}
  </div>
);

const PostDetail = ({ id }: { id: string }) => {
  const { data: post, isLoading, error } = usePost(id);
  const { data: translation } = usePostTranslation(id);

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="mb-8 h-[45vh] w-full rounded-3xl" />
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="eyebrow mb-4">Not found</p>
        <h1 className="mb-3 text-3xl font-bold">This analysis isn't available</h1>
        <p className="mb-8 text-muted-foreground">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="rounded-full">
          <Link to="/research">View all research</Link>
        </Button>
      </div>
    );
  }

  const title = translation?.title || post.title;
  const excerpt = translation?.excerpt || post.excerpt;
  const content = translation?.content || post.content;

  return (
    <>
      <Seo
        title={`${title} — SportSight Analytics`}
        description={excerpt}
        image={post.image_url}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: excerpt,
          image: post.image_url,
          datePublished: post.created_at,
          articleSection: post.category,
          author: { "@type": "Organization", name: "SportSight Analytics" },
        }}
      />

      <article>
        <header className="relative h-[56vh] min-h-[380px] w-full overflow-hidden">
          <img src={post.image_url} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/40" />
          <div className="absolute inset-0 bg-gradient-veil" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="container pb-12">
              <div className="mx-auto max-w-3xl">
                <Link
                  to="/research"
                  className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" /> All research
                </Link>
                <Badge className="mb-4 border border-primary/40 bg-primary/10 text-primary">
                  {post.category}
                </Badge>
                <h1 className="mb-4 text-3xl font-bold leading-[1.08] md:text-5xl">{title}</h1>
                <p className="mb-4 text-lg text-foreground/75">{excerpt}</p>
                <div className="flex items-center gap-4 font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{formatDate(post.created_at)}</span>
                  {post.views ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      {post.views} views
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-14">
          <div
            className="prose prose-lg mx-auto max-w-3xl text-left"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>
    </>
  );
};

const Research = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const { data: posts, isLoading, error } = usePosts(categoryFilter);

  if (id) return <PostDetail id={id} />;

  return (
    <>
      <Seo
        title={
          categoryFilter
            ? `${categoryFilter} research — SportSight Analytics`
            : "Research — SportSight Analytics"
        }
        description="Every SportSight study: transfer market inflation, expected goals models and league performance analysis."
        canonicalPath="/research"
      />

      <div className="container py-14 md:py-20">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Archive</p>
            <h1 className="text-4xl font-bold md:text-5xl">
              {categoryFilter ? `${categoryFilter} research` : "All research"}
            </h1>
          </div>
          {categoryFilter && (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setSearchParams({}, { replace: true })}
            >
              <X className="mr-1 h-4 w-4" />
              Clear filter
            </Button>
          )}
        </div>

        {isLoading ? (
          <GridSkeleton />
        ) : error ? (
          <div className="surface-card p-10 text-center">
            <h2 className="mb-2 text-2xl font-bold">Couldn't load research</h2>
            <p className="text-muted-foreground">Please try again in a moment.</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                date={formatDate(post.created_at || "")}
                category={post.category}
                imageUrl={post.image_url}
              />
            ))}
          </div>
        ) : (
          <div className="surface-card p-12 text-center">
            <h2 className="mb-2 text-2xl font-bold">No posts found</h2>
            <p className="text-muted-foreground">
              {categoryFilter
                ? `Nothing published in the ${categoryFilter} category yet.`
                : "No posts have been published yet."}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Research;
