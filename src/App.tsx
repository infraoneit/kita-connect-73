import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminLayout } from "./components/layout/AdminLayout";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import VerwaltungPage from "./pages/VerwaltungPage";
import VertraegePage from "./pages/VertraegePage";
import BelegungPage from "./pages/BelegungPage";
import PersonalPage from "./pages/PersonalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/verwaltung" element={<VerwaltungPage />} />
                      <Route path="/vertraege" element={<VertraegePage />} />
                      <Route path="/belegung" element={<BelegungPage />} />
                      <Route path="/personal" element={<PersonalPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
