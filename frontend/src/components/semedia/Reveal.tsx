import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Reveal = ({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out will-change-transform", shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
};
