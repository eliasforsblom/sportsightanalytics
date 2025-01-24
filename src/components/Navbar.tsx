import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/research", label: "Research" },
    { href: "/inflation-calculator", label: "Inflation Calculator" },
    { href: "/sports-dashboard", label: "Allsvenskan preseason" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
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

          <div className="flex items-center gap-4">
            <div className="relative z-50">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[120px] bg-white border-gray-200">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <img 
                        src={language === 'en' 
                          ? "/lovable-uploads/d8ee7063-fc30-48d7-a757-86f114f48f7b.png"
                          : "/lovable-uploads/ca0d8cb8-3ebc-497e-9fff-918686219f7e.png"
                        }
                        alt={language === 'en' ? "UK Flag" : "Swedish Flag"}
                        className="h-4 w-6 object-cover"
                      />
                      {language === "en" ? "English" : "Svenska"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-gray-200">
                  <SelectItem value="en" className="hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/d8ee7063-fc30-48d7-a757-86f114f48f7b.png"
                        alt="UK Flag"
                        className="h-4 w-6 object-cover"
                      />
                      English
                    </div>
                  </SelectItem>
                  <SelectItem value="sv" className="hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/ca0d8cb8-3ebc-497e-9fff-918686219f7e.png"
                        alt="Swedish Flag"
                        className="h-4 w-6 object-cover"
                      />
                      Svenska
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
      </div>
    </nav>
  );
};