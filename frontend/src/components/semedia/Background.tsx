import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

const LIGHT_BLOBS = {
    A: {
        width: 700,
        height: 700,
        color: "#8b5cf6",
        startX: "-5%",
        startY: "-10%",
        duration: "18s",
        animationName: "drift-a",
    },
    B: {
        width: 600,
        height: 600,
        color: "#06b6d4",
        startX: "60%",
        startY: "40%",
        duration: "24s",
        animationName: "drift-b",
    },
    C: {
        width: 500,
        height: 500,
        color: "#ec4899",
        startX: "10%",
        startY: "70%",
        duration: "20s",
        animationName: "drift-c",
    },
    D: {
        width: 800,
        height: 800,
        color: "#6366f1",
        startX: "30%",
        startY: "-20%",
        duration: "30s",
        animationName: "drift-d",
    },
};

const DARK_BLOBS = {
    A: {
        width: 700,
        height: 700,
        color: "#3b0764",
        startX: "-5%",
        startY: "-10%",
        duration: "18s",
        animationName: "drift-a",
    },
    B: {
        width: 600,
        height: 600,
        color: "#0c1445",
        startX: "60%",
        startY: "40%",
        duration: "24s",
        animationName: "drift-b",
    },
    C: {
        width: 500,
        height: 500,
        color: "#4a0030",
        startX: "10%",
        startY: "70%",
        duration: "20s",
        animationName: "drift-c",
    },
    D: {
        width: 800,
        height: 800,
        color: "#06082a",
        startX: "30%",
        startY: "-20%",
        duration: "30s",
        animationName: "drift-d",
    },
};

const PARTICLE_CONFIG = {
    count: 55,
    minRadius: 0.5,
    maxRadius: 2.2,
    minSpeed: 0.08,
    maxSpeed: 0.35,
    horizontalDrift: 0.15,
    minOpacity: 0.03,
    maxOpacity: 0.45,
    fadeDistance: 80,
};

const PARTICLE_COLORS = [
    "rgba(124, 58, 237, alpha)", // violet
    "rgba(6, 182, 212, alpha)", // cyan
    "rgba(192, 38, 211, alpha)", // magenta
    "rgba(255, 255, 255, alpha)", // white
    "rgba(99, 102, 241, alpha)", // indigo
];

interface BackgroundProps {
    opacity?: number; // Blob opacity level
}

export const Background = ({ opacity = 0.55 }: BackgroundProps) => {
    const { theme } = useTheme();
    const BLOB_CONFIG = theme === "dark" ? DARK_BLOBS : LIGHT_BLOBS;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const particlesRef = useRef<any[]>([]);
    const requestRef = useRef<number>(null);

    // Parallax refs for the inner parallax containers
    const parallaxRefs = {
        A: useRef<HTMLDivElement>(null),
        B: useRef<HTMLDivElement>(null),
        C: useRef<HTMLDivElement>(null),
        D: useRef<HTMLDivElement>(null),
    };

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) =>
            setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    // Particle Engine
    useEffect(() => {
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const dpr = 0.5; // Render at 0.5x as per instructions
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = "100vw";
            canvas.style.height = "100vh";
            ctx.scale(dpr, dpr);
        };

        const random = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const weightedRandomColor = () => {
            const r = Math.random();
            if (r < 0.2) return PARTICLE_COLORS[0]; // violet
            if (r < 0.35) return PARTICLE_COLORS[1]; // cyan
            if (r < 0.45) return PARTICLE_COLORS[2]; // magenta
            if (r < 0.95) return PARTICLE_COLORS[3]; // white
            return PARTICLE_COLORS[4]; // indigo
        };

        const createParticle = () => ({
            x: Math.random() * window.innerWidth,
            y: window.innerHeight * 1.1,
            radius: random(
                PARTICLE_CONFIG.minRadius,
                PARTICLE_CONFIG.maxRadius,
            ),
            speedY: random(PARTICLE_CONFIG.minSpeed, PARTICLE_CONFIG.maxSpeed),
            opacity: random(
                PARTICLE_CONFIG.minOpacity,
                PARTICLE_CONFIG.maxOpacity,
            ),
            color: weightedRandomColor(),
            swayAmplitude: random(0.3, 1.5),
            swayFrequency: random(0.002, 0.008),
            swayOffset: random(0, Math.PI * 2),
        });

        particlesRef.current = Array.from(
            { length: PARTICLE_CONFIG.count },
            createParticle,
        );

        const animateParticles = (timestamp: number) => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            particlesRef.current.forEach((p) => {
                p.y -= p.speedY;
                const xOffset =
                    Math.sin(timestamp * p.swayFrequency + p.swayOffset) *
                    p.swayAmplitude;
                const currentX = p.x + xOffset;

                let currentOpacity = p.opacity;
                if (p.y < PARTICLE_CONFIG.fadeDistance) {
                    currentOpacity *= p.y / PARTICLE_CONFIG.fadeDistance;
                }
                if (currentOpacity < 0) currentOpacity = 0;

                const gradient = ctx.createRadialGradient(
                    currentX,
                    p.y,
                    0,
                    currentX,
                    p.y,
                    p.radius * 2,
                );
                gradient.addColorStop(
                    0,
                    p.color.replace("alpha", currentOpacity.toString()),
                );
                gradient.addColorStop(1, p.color.replace("alpha", "0"));

                ctx.beginPath();
                ctx.arc(currentX, p.y, p.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                if (p.y < -20) {
                    Object.assign(p, createParticle());
                }
            });

            requestRef.current = requestAnimationFrame(animateParticles);
        };

        resize();
        requestRef.current = requestAnimationFrame(animateParticles);

        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [prefersReducedMotion]);

    // Mouse Parallax Logic
    useEffect(() => {
        if (prefersReducedMotion || window.innerWidth < 768) return;

        let currentX = 0,
            currentY = 0;
        let targetX = 0,
            targetY = 0;
        let parallaxRequestRef: number;

        const handleMouseMove = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            targetX = (e.clientX - cx) / cx;
            targetY = (e.clientY - cy) / cy;
        };

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const updateParallax = () => {
            currentX = lerp(currentX, targetX, 0.04);
            currentY = lerp(currentY, targetY, 0.04);

            if (parallaxRefs.A.current) {
                parallaxRefs.A.current.style.transform = `translate(${currentX * 12}px, ${currentY * 8}px)`;
            }
            if (parallaxRefs.B.current) {
                parallaxRefs.B.current.style.transform = `translate(${currentX * -8}px, ${currentY * 6}px)`;
            }
            if (parallaxRefs.C.current) {
                parallaxRefs.C.current.style.transform = `translate(${currentX * 15}px, ${currentY * -10}px)`;
            }
            if (parallaxRefs.D.current) {
                parallaxRefs.D.current.style.transform = `translate(${currentX * -5}px, ${currentY * 12}px)`;
            }

            parallaxRequestRef = requestAnimationFrame(updateParallax);
        };

        window.addEventListener("mousemove", handleMouseMove);
        parallaxRequestRef = requestAnimationFrame(updateParallax);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(parallaxRequestRef);
        };
    }, [
        parallaxRefs.A,
        parallaxRefs.B,
        parallaxRefs.C,
        parallaxRefs.D,
        prefersReducedMotion,
    ]);

    const [grainSeed, setGrainSeed] = useState(0);

    useEffect(() => {
        if (prefersReducedMotion) return;
        const interval = setInterval(() => {
            setGrainSeed(Math.random());
        }, 500); // 2fps
        return () => clearInterval(interval);
    }, [prefersReducedMotion]);

    const baseColor = theme === "dark" ? "#080810" : "#f0f4f8";
    const vignetteColor =
        theme === "dark" ? "rgba(4, 4, 12, 0.55)" : "rgba(0, 0, 0, 0.08)";

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: -1 }}
        >
            <div
                className="absolute inset-0"
                style={{ zIndex: -1, backgroundColor: baseColor }}
            />

            <div
                className="bg-blob-layer absolute inset-0 transition-opacity duration-1000"
                style={{
                    zIndex: 0,
                    opacity: prefersReducedMotion ? opacity * 0.5 : opacity,
                }}
            >
                {(
                    Object.entries(BLOB_CONFIG) as [
                        keyof typeof BLOB_CONFIG,
                        typeof BLOB_CONFIG.A,
                    ][]
                ).map(([key, config]) => (
                    <div
                        key={key}
                        className="drift-container absolute"
                        style={{
                            top: config.startY,
                            left: config.startX,
                            width: config.width,
                            height: config.height,
                            animation: prefersReducedMotion
                                ? "none"
                                : `${config.animationName} ${config.duration} ease-in-out infinite alternate`,
                            willChange: "transform",
                        }}
                    >
                        <div
                            ref={parallaxRefs[key]}
                            className="blob w-full h-full"
                            style={{
                                background: `radial-gradient(circle at center, ${config.color} 0%, transparent 70%)`,
                                borderRadius: "50%",
                                filter: "blur(80px)",
                                opacity: 1,
                                willChange: "transform",
                            }}
                        />
                    </div>
                ))}
            </div>

            <div
                className="glass-panel absolute inset-0 transition-colors duration-500 backdrop-blur-4xl"
                style={{
                    zIndex: 1,
                    backgroundColor:
                        theme === "dark"
                            ? "rgba(0, 0, 0, 0.2)"
                            : "rgba(255, 255, 255, 0.15)",
                }}
            />

            {!prefersReducedMotion && (
                <canvas
                    ref={canvasRef}
                    className="particle-canvas absolute inset-0"
                    style={{ zIndex: 2, opacity: 0.8 }}
                />
            )}

            <svg
                className="grain-overlay absolute inset-0 w-full h-full mix-blend-overlay"
                style={{ zIndex: 3, opacity: 0.03 }}
            >
                <filter id="background-grain">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        stitchTiles="stitch"
                        seed={grainSeed}
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect
                    width="100%"
                    height="100%"
                    filter="url(#background-grain)"
                />
            </svg>
        </div>
    );
};
