import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import About from "./pages/About";
import Research from "./pages/Research";
import AdminLogin from "./pages/AdminLogin";
import AdminPosts from "./pages/AdminPosts";
import InflationCalculator from "./pages/InflationCalculator";
import { Toaster } from "./components/ui/sonner";
import { useTrackPageview } from "@/hooks/use-track-pageview";
import "./App.css";

const queryClient = new QueryClient();

function AppContent() {
  useTrackPageview();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research/:id" element={<Research />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/posts" element={<AdminPosts />} />
        <Route path="/inflation-calculator" element={<InflationCalculator />} />
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;