import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Wordmark = ({ className, to = "/" }: { className?: string; to?: string }) => (
  <Link to={to} className={cn("font-display text-2xl font-semibold tracking-wide text-foreground/95 hover:text-foreground transition-colors", className)}>
    Se<span className="gradient-text">Media</span>
  </Link>
);
