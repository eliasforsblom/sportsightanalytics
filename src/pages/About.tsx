import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Mail } from "lucide-react";

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
          </div>

          <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              @SportSightAI
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              SportSight Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              contact@sportsight.ai
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;