import { Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";

const principles = [
  {
    title: "Open method",
    body: "Every model we publish comes with the reasoning behind it — assumptions, data sources and limits included.",
  },
  {
    title: "Context over noise",
    body: "A number means nothing on its own. We anchor stats to the era, league and market they came from.",
  },
  {
    title: "Made for fans",
    body: "No jargon walls. If a supporter can't follow the argument, we haven't finished writing it.",
  },
];

const About = () => (
  <>
    <Seo
      title="About — SportSight Analytics"
      description="Who we are: a group of friends turning football curiosity into open, data-driven research."
      canonicalPath="/about"
    />

    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-50" />
      <div className="container relative py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5">About us</p>
          <h1 className="text-4xl font-bold leading-[1.06] md:text-6xl">
            A hobby project with a <span className="text-gradient">serious data habit.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            We're a group of friends passionate about football and data, combining our love for the
            game with analytics to uncover deeper insights. Our research explores football from a
            fresh, data-driven perspective — player performance, transfer trends and tactical
            patterns.
          </p>
        </div>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-5 md:grid-cols-3">
        {principles.map((item, index) => (
          <div key={item.title} className="rounded-2xl border border-border/70 bg-card/50 p-7">
            <span className="font-display text-sm text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="mb-2 mt-3 text-xl font-bold">{item.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="surface-card mt-14 flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Follow the research</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            New studies, charts and model updates land on our socials first.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-full" asChild>
            <a href="https://x.com/sportsight_" target="_blank" rel="noreferrer noopener">
              <Twitter className="mr-1 h-4 w-4" />
              @SportSight_
            </a>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <a
              href="https://www.instagram.com/sportsightanalytics"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Instagram className="mr-1 h-4 w-4" />
              @SportSightanalytics
            </a>
          </Button>
        </div>
      </div>
    </section>
  </>
);

export default About;
