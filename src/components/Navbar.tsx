import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center">
              <img 
                src="/lovable-uploads/c029bee2-578d-4822-a0d2-4a13ae023b3d.png" 
                alt="SportSight Analytics" 
                className="h-10 w-auto"
              />
            </a>
            <div className="hidden md:flex space-x-6">
              <a href="/research" className="text-gray-600 hover:text-primary">
                Research
              </a>
              <a href="/inflation-calculator" className="text-gray-600 hover:text-primary">
                Inflation Calculator
              </a>
              <a href="/about" className="text-gray-600 hover:text-primary">
                About
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};