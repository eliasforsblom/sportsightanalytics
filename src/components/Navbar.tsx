import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", end: true },
  { href: "/research", label: "Research" },
  { href: "/inflation-calculator", label: "Inflation Calculator" },
  { href: "/allsvenskan-xg", label: "Allsvenskan xG" },
  { href: "/about", label: "About" },
];

const FLAGS = {
  en: { src: "/lovable-uploads/d8ee7063-fc30-48d7-a757-86f114f48f7b.png", alt: "UK flag", label: "English" },
  sv: { src: "/lovable-uploads/ca0d8cb8-3ebc-497e-9fff-918686219f7e.png", alt: "Swedish flag", label: "Svenska" },
} as const;

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const active = FLAGS[language as keyof typeof FLAGS] ?? FLAGS.en;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
            <img
              src="/lovable-uploads/c029bee2-578d-4822-a0d2-4a13ae023b3d.png"
              alt="SportSight Analytics"
              className="h-8 w-auto brightness-0 invert md:h-9"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger
              className="h-9 w-[132px] rounded-full border-border/80 bg-card/60 text-sm"
              aria-label="Select language"
            >
              <SelectValue>
                <span className="flex items-center gap-2">
                  <img src={active.src} alt={active.alt} className="h-3.5 w-5 rounded-[2px] object-cover" />
                  {active.label}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FLAGS) as Array<keyof typeof FLAGS>).map((code) => (
                <SelectItem key={code} value={code}>
                  <span className="flex items-center gap-2">
                    <img
                      src={FLAGS[code].src}
                      alt={FLAGS[code].alt}
                      className="h-3.5 w-5 rounded-[2px] object-cover"
                    />
                    {FLAGS[code].label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] border-border/70 bg-card">
              <SheetTitle className="eyebrow">Navigate</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    end={link.end}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
