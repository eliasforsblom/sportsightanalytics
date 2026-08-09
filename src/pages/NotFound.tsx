import { Link, useLocation } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Seo title="Page not found — SportSight Analytics" description="This page does not exist." />
      <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="eyebrow mb-4">Error 404</p>
        <h1 className="mb-4 text-5xl md:text-7xl">Off target</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          We couldn't find <span className="text-foreground">{pathname}</span>. It may have been
          moved or never existed.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/">Back to home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/research">Browse research</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
