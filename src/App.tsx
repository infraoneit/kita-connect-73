import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import CalendarPage from "./pages/CalendarPage";
import DiaryPage from "./pages/DiaryPage";
import ChildrenPage from "./pages/ChildrenPage";
import AbsencePage from "./pages/AbsencePage";
import PinnwandPage from "./pages/PinnwandPage";
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
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/diary" element={<DiaryPage />} />
                      <Route path="/children" element={<ChildrenPage />} />
                      <Route path="/absence" element={<AbsencePage />} />
                      <Route path="/pinnwand" element={<PinnwandPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
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
