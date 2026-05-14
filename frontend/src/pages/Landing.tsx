import { Link } from "react-router-dom";
import {
    ArrowRight,
    ArrowDown,
    Film,
    BarChart3,
    Brain,
    Sparkles,
    MessageCircle,
    ScanSearch,
    Lightbulb,
} from "lucide-react";
import { Background } from "@/components/semedia/Background";
import { SiteNav } from "@/components/semedia/SiteNav";
import { Footer } from "@/components/semedia/Footer";
import { Reveal } from "@/components/semedia/Reveal";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const TYPED =
    "I want something that makes me feel hopeful but a little melancholy — like a late Sunday evening...";

const ChatDemo = () => {
    const [text, setText] = useState("");
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        let i = 0;
        let typingTimer: number;
        let resultsTimer: number;
        let resetTimer: number;

        const tick = () => {
            setText(TYPED.slice(0, i));
            i++;
            if (i <= TYPED.length) {
                typingTimer = window.setTimeout(tick, 35 + Math.random() * 50);
            } else {
                resultsTimer = window.setTimeout(
                    () => setShowResults(true),
                    1400,
                );
                resetTimer = window.setTimeout(() => {
                    i = 0;
                    setShowResults(false);
                    setText("");
                    typingTimer = window.setTimeout(tick, 600);
                }, 6500);
            }
        };
        typingTimer = window.setTimeout(tick, 600);
        return () => {
            clearTimeout(typingTimer);
            clearTimeout(resultsTimer);
            clearTimeout(resetTimer);
        };
    }, []);

    return (
        <div className="glass-card p-6 md:p-7 space-y-5">
            <div className="flex items-start gap-3 justify-end">
                <div
                    className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-foreground/90"
                    style={{
                        background: "hsl(var(--accent-violet) / 0.15)",
                        border: "1px solid hsl(var(--accent-violet) / 0.3)",
                    }}
                >
                    {text}
                    <span className="ml-0.5 inline-block w-[2px] h-4 align-middle bg-foreground/70 animate-pulse" />
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground/70 pl-1">
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-[pulse_1.2s_ease-in-out_infinite]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-[pulse_1.2s_ease-in-out_infinite_0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-magenta animate-[pulse_1.2s_ease-in-out_infinite_0.4s]" />
                </span>
                SeMedia AI is thinking…
            </div>

            <div
                className={`grid grid-cols-3 gap-3 transition-all duration-500 ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
            >
                {[
                    "from-[#3b0764] via-[#0c1445] to-[#4a0030]",
                    "from-[#0c1445] via-[#3b0764] to-[#080810]",
                    "from-[#4a0030] via-[#080810] to-[#0c1445]",
                ].map((g, i) => (
                    <div
                        key={i}
                        className={`aspect-[2/3] rounded-lg bg-gradient-to-br ${g} blur-[1px] border border-white/10`}
                    />
                ))}
            </div>
        </div>
    );
};

const Landing = () => {
    return (
        <>
            <Background />
            <SiteNav />

            <main className="relative">
                <section className="relative min-h-screen flex items-center justify-center px-6">
                    <div className="max-w-[820px] mx-auto text-center pt-24 pb-20 animate-fade-in">
                        <div className="label-tracked mb-6 inline-flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-accent-cyan" />
                            <span className="gradient-text font-semibold">
                                AI-POWERED · MOOD-DRIVEN · CINEMATIC
                            </span>
                        </div>
                        <h1 className="font-display text-5xl md:text-7xl lg:text-[88px] leading-[1.05] tracking-tight text-foreground/95">
                            Tell us how you{" "}
                            <span className="gradient-text italic font-bold">
                                feel{" "}
                            </span>
                            . <br /> We'll find your next
                            <br />
                            favorite{" "}
                            <span className="gradient-text italic font-bold">
                                film{" "}
                            </span>
                            .
                        </h1>
                        <p className="mt-7 text-lg md:text-xl text-foreground/75 max-w-xl mx-auto leading-relaxed">
                            No ratings. No history. Just your mood — and the
                            perfect movie waiting on the other side.
                        </p>

                        <div className="mt-10 flex flex-col items-center gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="cta-pulse rounded-full bg-gradient-brand text-white border-0 px-8 py-6 text-base font-semibold hover:opacity-95"
                            >
                                <Link to="/discover">
                                    Start Discovering{" "}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                            <a
                                href="#how"
                                className="text-sm text-foreground/70 hover:text-foreground/90 transition-colors inline-flex items-center gap-1"
                            >
                                See how it works{" "}
                                <ArrowDown className="w-3 h-3" />
                            </a>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-foreground/65">
                            <div className="flex -space-x-2">
                                {[
                                    "#8b5cf6",
                                    "#06b6d4",
                                    "#ec4899",
                                    "#6366f1",
                                    "#a855f7",
                                ].map((c, i) => (
                                    <span
                                        key={i}
                                        className="w-7 h-7 rounded-full border-2 border-background"
                                        style={{
                                            background: `linear-gradient(135deg, ${c}, #f0f4f8)`,
                                        }}
                                    />
                                ))}
                            </div>
                            <span>
                                Join 12,000+ film lovers already discovering
                            </span>
                            <span className="text-accent-cyan">★★★★★</span>
                        </div>
                    </div>
                </section>

                <section className="container py-24">
                    <Reveal>
                        {/* ✨ ضفنا هنا الـ Glass Wrapper ✨ */}
                        <div className="glass-panel p-8 md:p-12 lg:p-16 rounded-3xl border border-foreground/10">
                            <div className="grid lg:grid-cols-2 gap-10 items-start">
                                <div className="space-y-5">
                                    <div className="label-tracked">
                                        The old way is broken
                                    </div>
                                    <h2 className="font-display text-4xl md:text-5xl leading-tight">
                                        You don't need{" "}
                                        <span className="gradient-text italic">
                                            more options
                                        </span>
                                        .
                                        <br />
                                        You need the right one.
                                    </h2>
                                    <p className="text-foreground/70 max-w-md">
                                        Streaming promised infinite choice. It
                                        delivered infinite scrolling.
                                    </p>

                                    <div className="space-y-4 pt-4">
                                        {[
                                            {
                                                icon: Film,
                                                title: "Choice Overload",
                                                body: "10,000 titles. Zero clarity. You scroll for 20 minutes and give up.",
                                            },
                                            {
                                                icon: BarChart3,
                                                title: "Static Algorithms",
                                                body: "Watched one rom-com? Now that's all you get. Forever.",
                                            },
                                            {
                                                icon: Brain,
                                                title: "Missing Your Mood",
                                                body: "No system asks: how do you actually feel right now?",
                                            },
                                        ].map(
                                            (
                                                { icon: Icon, title, body },
                                                i,
                                            ) => (
                                                <Reveal
                                                    key={title}
                                                    delay={i * 100}
                                                >
                                                    {/* الكروت الصغيرة دي هتفضل زي ما هي (إزاز جوة إزاز بيدي عمق حلو جداً) */}
                                                    <div className="glass-card p-6 flex gap-4">
                                                        <div
                                                            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                                                            style={{
                                                                background:
                                                                    "hsl(var(--accent-violet) / 0.12)",
                                                                border: "1px solid hsl(var(--accent-violet) / 0.3)",
                                                            }}
                                                        >
                                                            <Icon className="w-5 h-5 text-accent-cyan" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-foreground/90">
                                                                {title}
                                                            </h3>
                                                            <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
                                                                {body}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Reveal>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <Reveal
                                    delay={200}
                                    className="lg:sticky lg:top-28"
                                >
                                    <ChatDemo />
                                </Reveal>
                            </div>
                        </div>
                    </Reveal>
                </section>

                <section id="how" className="container py-24">
                    <Reveal>
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <div className="label-tracked mb-4">
                                The process
                            </div>
                            <h2 className="font-display text-4xl md:text-5xl leading-tight">
                                How{" "}
                                <span className="gradient-text">SeMedia</span>{" "}
                                thinks
                            </h2>
                        </div>
                    </Reveal>

                    <div className="relative grid md:grid-cols-3 gap-8">
                        <svg
                            className="hidden md:block absolute top-10 left-[15%] right-[15%] h-2 -z-0"
                            preserveAspectRatio="none"
                            viewBox="0 0 100 2"
                        >
                            <line
                                x1="0"
                                y1="1"
                                x2="100"
                                y2="1"
                                stroke="hsl(var(--accent-violet) / 0.3)"
                                strokeWidth="0.4"
                                strokeDasharray="2 2"
                                style={{
                                    animation: "dash-travel 2s linear infinite",
                                }}
                            />
                        </svg>

                        {[
                            {
                                n: 1,
                                title: "Describe Your Mood",
                                body: "Type anything. 'Sad but hopeful.' 'Intense and fast-paced.' 'Like a rainy Tuesday in Paris.'",
                            },
                            {
                                n: 2,
                                title: "AI Understands You",
                                body: "Our model decodes emotional intent, theme, tone, and pace — not just keywords.",
                            },
                            {
                                n: 3,
                                title: "Discover Your Film",
                                body: "Ranked, explained recommendations. Every one chosen for this version of you, right now.",
                            },
                        ].map((s, i) => (
                            <Reveal key={s.n} delay={i * 150}>
                                <div className="text-center px-4">
                                    <div className="relative mx-auto w-20 h-20 mb-6">
                                        <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-30 blur-xl" />
                                        <div className="relative w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-white font-display text-3xl font-bold shadow-glow-violet">
                                            {s.n}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {s.title}
                                    </h3>
                                    <p className="text-foreground/70 text-sm leading-relaxed">
                                        {s.body}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                <section className="container py-24">
                    <Reveal>
                        <div className="glass-panel p-8 md:p-14">
                            <div className="text-center mb-12">
                                <div className="label-tracked mb-3">
                                    What makes us different
                                </div>
                                <h2 className="font-display text-3xl md:text-4xl">
                                    Built around the way you actually feel
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: ScanSearch,
                                        title: "Mood-Semantic Search",
                                        body: "Finds films by emotional fingerprint, not just genre tags.",
                                    },
                                    {
                                        icon: Sparkles,
                                        title: "Zero Cold Start",
                                        body: "No watch history needed. Your mood is enough.",
                                    },
                                    {
                                        icon: MessageCircle,
                                        title: "Conversational Depth",
                                        body: "Ask follow-ups. Refine. The AI remembers your session.",
                                    },
                                    {
                                        icon: Lightbulb,
                                        title: "Explained Recommendations",
                                        body: "Every pick comes with a reason — no black-box guessing.",
                                    },
                                ].map(({ icon: Icon, title, body }, i) => (
                                    <Reveal key={title} delay={i * 100}>
                                        <div className="glass-card p-6 h-full">
                                            <Icon className="w-6 h-6 text-accent-cyan mb-4" />
                                            <h3 className="font-semibold text-lg mb-2">
                                                {title}
                                            </h3>
                                            <p className="text-sm text-foreground/75 leading-relaxed">
                                                {body}
                                            </p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </section>

                <section className="relative py-32 px-6 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-violet/40 to-transparent" />
                    <Reveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="font-display text-4xl md:text-6xl leading-tight">
                                Your next favorite film
                                <br />
                                is a{" "}
                                <span className="gradient-text italic">
                                    feeling
                                </span>{" "}
                                away.
                            </h2>
                            <div className="mt-10">
                                <Button
                                    asChild
                                    size="lg"
                                    className="cta-pulse rounded-full bg-gradient-brand text-white border-0 px-8 py-6 text-base font-semibold"
                                >
                                    <Link to="/discover">
                                        Start Discovering{" "}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Reveal>
                </section>

                <Footer />
            </main>
        </>
    );
};

export default Landing;
