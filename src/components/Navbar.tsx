import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-2xl font-bold text-primary">
              SportSight Analytics
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
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search research..."
                className="pl-10 w-[200px]"
              />
            </div>
            <Button variant="default">Admin Login</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};