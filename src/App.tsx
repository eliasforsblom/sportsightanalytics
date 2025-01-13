import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Research from "@/pages/Research";
import AdminLogin from "@/pages/AdminLogin";
import AdminPosts from "@/pages/AdminPosts";
import About from "@/pages/About";
import InflationCalculator from "@/pages/InflationCalculator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research/:id" element={<Research />} />
        <Route path="/about" element={<About />} />
        <Route path="/inflation-calculator" element={<InflationCalculator />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/posts" element={<AdminPosts />} />
      </Routes>
    </Router>
  );
}

export default App;