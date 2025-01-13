import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">About SportSight Analytics</h1>
          
          <div className="prose prose-lg mb-12 prose-headings:text-primary prose-p:text-gray-600">
            <p className="mb-6">
              We're a group of friends passionate about football and data, combining our love for the game with analytics to uncover deeper insights. Our hobby project focuses on conducting and sharing research that explores football from a fresh, data-driven perspective.
            </p>
            <p className="mb-6">
              Whether it's analyzing player performance, transfer trends, or tactical patterns, we aim to make complex analytics accessible and engaging for fans, enthusiasts, and anyone curious about the beautiful game.
            </p>
            <p className="mb-10">
              Follow us as we dive into the numbers and stories that shape football!
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Connect With Us</h2>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors duration-200" 
              onClick={() => window.open('https://x.com/sportsight_', '_blank')}
            >
              <Twitter className="w-4 h-4" />
              @SportSight_
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors duration-200" 
              onClick={() => window.open('https://www.instagram.com/sportsightanalytics', '_blank')}
            >
              <Instagram className="w-4 h-4" />
              @SportSightanalytics
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;