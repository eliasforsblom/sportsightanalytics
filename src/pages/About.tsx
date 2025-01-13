import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About SportSight Analytics</h1>
          
          <div className="prose prose-lg mb-8">
            <p>
              SportSight Analytics is a cutting-edge football analytics consultancy that combines 
              data science with deep football knowledge to provide unique insights into the beautiful game. 
              Our team of analysts and researchers work with clubs, scouts, and media organizations to 
              uncover meaningful patterns and trends in football data.
            </p>
            <p>
              We specialize in advanced metrics, tactical analysis, and player recruitment, 
              publishing our findings and methodologies to contribute to the wider football analytics community.
            </p>
            <p>
              We're a group of friends passionate about football and data, combining our love for the game with analytics to uncover deeper insights. Our hobby project focuses on conducting and sharing research that explores football from a fresh, data-driven perspective.
            </p>
            <p>
              Whether it's analyzing player performance, transfer trends, or tactical patterns, we aim to make complex analytics accessible and engaging for fans, enthusiasts, and anyone curious about the beautiful game.
            </p>
            <p>
              Follow us as we dive into the numbers and stories that shape football!
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open('https://x.com/sportsight_', '_blank')}>
              <Twitter className="w-4 h-4" />
              @SportSight_
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open('https://www.instagram.com/sportsightanalytics', '_blank')}>
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