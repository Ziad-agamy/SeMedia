import { cn } from "@/lib/utils";

export const MeshBackground = ({ className, subtle = false }: { className?: string; subtle?: boolean }) => (
  <div className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background noise-overlay", className)}>
    <div
      className="absolute -inset-[20%] animate-mesh-drift"
      style={{
        backgroundImage: 'var(--gradient-mesh-1), var(--gradient-mesh-2), var(--gradient-mesh-3)',
        opacity: subtle ? 0.55 : 1,
      }}
    />
    {/* Sparse star particles */}
    <div className="absolute inset-0">
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="absolute block rounded-full bg-white/40"
          style={{
            width: Math.random() > 0.85 ? 2 : 1,
            height: Math.random() > 0.85 ? 2 : 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
        />
      ))}
    </div>
    {/* Vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,hsl(var(--background))_100%)]" />
  </div>
);
