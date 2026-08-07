import { Link } from "react-router-dom";
import { Twitter, Instagram } from "lucide-react";

const navGroups = [
  {
    title: "Research",
    links: [
      { href: "/research", label: "All research" },
      { href: "/allsvenskan-xg", label: "Allsvenskan xG" },
      { href: "/sports-dashboard", label: "League dashboard" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/inflation-calculator", label: "Inflation calculator" },
      { href: "/about", label: "About us" },
    ],
  },
];

export const Footer = () => (
  <footer className="mt-24 border-t border-border/70 bg-card/40 backdrop-blur-sm">
    <div className="container py-14">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="inline-flex items-center">
            <img
              src="/lovable-uploads/c029bee2-578d-4822-a0d2-4a13ae023b3d.png"
              alt="SportSight Analytics"
              className="h-9 w-auto brightness-0 invert"
              loading="lazy"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Football, read through data. Transfer market inflation, expected goals and league
            models — built by a group of friends who like the numbers as much as the game.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://x.com/sportsight_"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="SportSight on X"
              className="rounded-full border border-border/80 p-2.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/sportsightanalytics"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="SportSight on Instagram"
              className="rounded-full border border-border/80 p-2.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {navGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="eyebrow mb-4">{group.title}</h2>
            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} SportSight Analytics</p>
        <p>Independent football data research.</p>
      </div>
    </div>
  </footer>
);
