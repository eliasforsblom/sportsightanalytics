import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/research", label: "Research" },
    { href: "/inflation-calculator", label: "Inflation Calculator" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <a href="/" className="flex items-center transition-transform hover:scale-105 duration-200">
              <img 
                src="/lovable-uploads/c029bee2-578d-4822-a0d2-4a13ae023b3d.png" 
                alt="SportSight Analytics" 
                className="h-8 md:h-10 w-auto"
              />
            </a>
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-all duration-200 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 ${
                    isActive(link.href)
                      ? "text-primary after:w-full"
                      : "text-gray-600 hover:text-primary after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition-colors duration-200">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary hover:translate-x-1"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};