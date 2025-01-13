import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Research from "@/pages/Research";
import AdminLogin from "@/pages/AdminLogin";
import AdminPosts from "@/pages/AdminPosts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/research/:id" element={<Research />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/posts" element={<AdminPosts />} />
      </Routes>
    </Router>
  );
}

export default App;