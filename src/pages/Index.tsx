import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo } from "@/components/Seo";
import { PostCard } from "@/components/PostCard";
import { FeaturedPost } from "@/components/FeaturedPost";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useHighlightedPosts, useLatestPosts } from "@/hooks/use-posts";
import { formatDate } from "@/lib/date-utils";


const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const { data: highlightedPosts = [], isLoading: isLoadingHighlighted } = useHighlightedPosts();
  const { data: latestPosts = [], isLoading: isLoadingLatest } = useLatestPosts(6);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <>
      <Seo
        title="SportSight Analytics — Football Data Research & Tools"
        description="Data-driven football research: transfer market inflation, Allsvenskan xG models and league analytics, explained clearly."
        canonicalPath="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SportSight Analytics",
          url: "https://sportsightanalytics.lovable.app/",
          sameAs: [
            "https://x.com/sportsight_",
            "https://www.instagram.com/sportsightanalytics",
          ],
        }}
      />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow mb-6">Independent football data research</p>
            <h1 className="text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              <span className="italic">The game,</span>{" "}
              <span className="text-primary">read through numbers.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We build models and tools that make football analytics legible — transfer market
              inflation, expected goals and league performance, without the jargon.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/research">
                  Explore research
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Highlighted carousel */}
      {isLoadingHighlighted ? (
        <div className="container py-12">
          <Skeleton className="h-[420px] w-full rounded-3xl md:h-[500px]" />
        </div>
      ) : (
        highlightedPosts.length > 0 && (
          <section className="container py-16 md:py-20" aria-label="Featured research">
            <Carousel
              className="relative w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-soft"
              opts={{ align: "start", loop: true }}
              setApi={setApi}
            >
              <CarouselContent className="ml-0">
                {highlightedPosts.map((post) => (
                  <CarouselItem key={post.id} className="pl-0">
                    <FeaturedPost
                      id={post.id}
                      title={post.title}
                      excerpt={post.excerpt}
                      category={post.category}
                      imageUrl={post.image_url}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {highlightedPosts.length > 1 && (
                <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
                  <CarouselPrevious className="relative left-0 h-9 w-9 translate-y-0 rounded-full border-transparent bg-card/90 backdrop-blur-md" />
                  <div className="flex gap-2 rounded-full bg-card/80 px-4 py-2.5 backdrop-blur-md">
                    {highlightedPosts.map((post, index) => (
                      <button
                        key={post.id}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? "w-6 bg-primary"
                            : "w-1.5 bg-foreground/25 hover:bg-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                  <CarouselNext className="relative right-0 h-9 w-9 translate-y-0 rounded-full border-transparent bg-card/90 backdrop-blur-md" />
                </div>
              )}
            </Carousel>
          </section>
        )
      )}

      {/* Latest research grid */}
      <section className="container pb-8 md:pb-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <h2 className="text-3xl md:text-4xl">Recent research</h2>
          <Link
            to="/research"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-glow"
          >
            View all studies
          </Link>
        </div>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingLatest
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[420px] rounded-2xl" />
              ))
            : latestPosts.map((post) => (
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
      </section>
    </>
  );
};

export default Index;
