import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "./contexts/AuthContext"; // استدعاء الـ Provider
import ProtectedRoute from "./components/ProtectedRoute"; // استدعاء حامي المسارات

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Discover from "./pages/Discover";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <ThemeProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/auth" element={<Auth />} />

                            <Route element={<ProtectedRoute />}>
                                <Route
                                    path="/discover"
                                    element={<Discover />}
                                />
                                <Route
                                    path="/recommendations"
                                    element={<Recommendations />}
                                />
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </ThemeProvider>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
