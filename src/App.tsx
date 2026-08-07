import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ToastToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteFallback } from "@/components/layout/RouteFallback";
import { useTrackPageview } from "@/hooks/use-track-pageview";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Research = lazy(() => import("./pages/Research"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPosts = lazy(() => import("./pages/AdminPosts"));
const InflationCalculator = lazy(() => import("./pages/InflationCalculator"));
const SportsDashboard = lazy(() => import("./pages/SportsDashboard"));
const AllsvenskanXG = lazy(() => import("./pages/AllsvenskanXG"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  useTrackPageview();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:id" element={<Research />} />
          <Route path="/inflation-calculator" element={<InflationCalculator />} />
          <Route path="/sports-dashboard" element={<SportsDashboard />} />
          <Route path="/allsvenskan-xg" element={<AllsvenskanXG />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/posts" element={<AdminPosts />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200}>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
            <Toaster />
            <ToastToaster />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
