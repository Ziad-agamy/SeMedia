import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/useAuth";

export const SiteNav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, logout, loading } = useAuth();
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled ? "py-3" : "py-5"
            }`}
        >
            <div
                className={`container mx-auto px-6 transition-all duration-500 ${
                    isScrolled ? "glass-panel" : ""
                }`}
            >
                <div className="flex items-center justify-between">
                    <Wordmark />

                     <div className="hidden md:flex items-center gap-3">
                         {loading ? (
                             <div className="text-sm text-muted-foreground">
                                 Loading...
                             </div>
                         ) : user ? (
                             <div className="flex items-center gap-3">
                                 <span className="text-sm font-medium text-foreground">
                                     {user.first_name} {user.last_name}
                                 </span>
 
                                 <Button
                                     variant="ghost"
                                     size="sm"
                                     onClick={logout}
                                     className="rounded-full text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
                                 >
                                     <LogOut className="w-4 h-4 mr-1.5" />
                                     Logout
                                 </Button>
                             </div>
                         ) : (
                             <>
                                 <Button
                                     asChild
                                     size="sm"
                                     className="rounded-full bg-gradient-brand text-white border-0 shadow-glow-violet hover:opacity-95"
                                 >
                                     <Link to="/auth">Get Started</Link>
                                 </Button>
                             </>
                         )}
                     </div>
                     <div className="md:hidden flex items-center gap-2">
                         <button
                             className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                             onClick={() =>
                                 setIsMobileMenuOpen(!isMobileMenuOpen)
                             }
                         >
                             {isMobileMenuOpen ? (
                                 <X className="w-6 h-6" />
                             ) : (
                                 <Menu className="w-6 h-6" />
                             )}
                         </button>
                     </div>
                </div>

                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${
                        isMobileMenuOpen
                            ? "max-h-48 opacity-100 mt-4 pb-4"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <nav className="flex flex-col gap-3">
                        <Button
                            asChild
                            variant="ghost"
                            className="text-foreground/70 hover:text-foreground hover:bg-black/10 justify-start"
                        >
                            <Link to="/auth">Sign In</Link>
                        </Button>
                        <Button
                            asChild
                            className="rounded-full bg-gradient-brand text-white border-0 shadow-glow-violet hover:opacity-95"
                        >
                            <Link to="/auth">Get Started</Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
};
