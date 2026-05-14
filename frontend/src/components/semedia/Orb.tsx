import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface OrbProps {
  heartbeatTrigger?: number;
  className?: string;
}

export const Orb = ({ heartbeatTrigger, className }: OrbProps) => {
  const [isBeating, setIsBeating] = useState(false);

  useEffect(() => {
    if (heartbeatTrigger) {
      setIsBeating(true);
      const timer = setTimeout(() => setIsBeating(false), 200); // Shorter duration for calming effect
      return () => clearTimeout(timer);
    }
  }, [heartbeatTrigger]);

  return (
    <div className={cn("relative w-32 h-32 group cursor-default", className)}>
      <div 
        className={cn(
          "absolute inset-0 w-full h-full transition-all duration-300",
          isBeating && "animate-[heart-beat_0.2s_ease-in-out]"
        )}
      >
        {/* Outer Glow */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-brand opacity-40 blur-2xl animate-orb-morph transition-all duration-700 group-hover:opacity-60 group-hover:scale-110" 
          style={{ animationDuration: "12s" }}
        />
        
        {/* Middle Layer */}
        <div 
          className="absolute inset-2 rounded-full bg-gradient-brand opacity-50 blur-xl animate-orb-morph transition-all duration-700 group-hover:scale-105" 
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        />

        {/* Core */}
        <div 
          className="absolute inset-6 rounded-full bg-gradient-brand opacity-80 shadow-glow-violet animate-orb-morph transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_60px_hsl(var(--accent-violet)/0.4)]" 
          style={{ animationDuration: "8s" }}
        />
      </div>
    </div>
  );
};
