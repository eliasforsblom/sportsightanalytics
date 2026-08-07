import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const SiteLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main id="content" className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
