import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Star, Clock, LogOut } from "lucide-react";
import { Background } from "@/components/semedia/Background";
import { Wordmark } from "@/components/semedia/Wordmark";
import { Reveal } from "@/components/semedia/Reveal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/useAuth";
import { api } from "@/lib/axios";

// ده النوع اللي بيجي من الـ Backend
export type DBRecommendation = {
    id: number;
    title: string;
    year?: number;
    director?: string;
    genres?: string[];
    match?: number;
    overview?: string;
    cast?: string[];
    runtime?: string;
    poster_path?: string;
    backdrop_path?: string;
};

/** API sends directors as one comma-separated string, e.g. "A, B". */
function splitCommaList(value?: string): string[] {
    if (!value?.trim()) return [];
    return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

// Component للبوستر بيدعم الـ API الحقيقي (زي TMDB)
const PosterPlaceholder = ({
    movie,
    className,
}: {
    movie: DBRecommendation;
    className?: string;
}) => {
    // لو الباك اند باعت مسار الصورة، هنستخدمه
    const hasImage = !!movie.poster_path;
    const imageUrl = hasImage
        ? movie.poster_path?.startsWith("http")
            ? movie.poster_path
            : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    return (
        <div
            className={cn(
                "relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-end p-4 overflow-hidden",
                className,
            )}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
            ) : (
                <>
                    <div className="absolute inset-0 noise-overlay" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative font-display text-2xl text-white/90 leading-tight">
                        {movie.title}
                    </div>
                </>
            )}
        </div>
    );
};

const RankBadge = ({ rank }: { rank: number }) => (
    <span className="glass-pill px-2.5 py-1 text-[11px] font-semibold text-foreground/90">
        #{rank}
    </span>
);

const MatchBadge = ({ match }: { match?: number }) => (
    <span className="px-2.5 py-1 text-[11px] font-bold text-white rounded-full bg-gradient-brand shadow-glow-violet">
        {match || 90}% match
    </span>
);

const Recommendations = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [searchParams] = useSearchParams();
    const threadId = searchParams.get("thread");

    const [movies, setMovies] = useState<DBRecommendation[]>([]);
    const [summary, setSummary] = useState("Curated for you");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState<DBRecommendation | null>(null);
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const convRes = await api.get("/api/conversations/");

                const activeConv = convRes.data.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (c: any) => c.thread_id === threadId,
                );

                if (activeConv) {
                    setSummary(activeConv.title || "Based on your mood");

                    const recRes = await api.get(
                        `/api/conversations/${activeConv.id}/recommendations`,
                    );
                    setMovies(recRes.data);
                }
            } catch (error) {
                console.error("Failed to load recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        if (threadId) {
            fetchRecommendations();
        } else {
            setLoading(false);
        }
    }, [threadId]);

    const userInitial = user?.first_name?.charAt(0).toUpperCase() || "U";

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <>
                <Background opacity={0.3} />
                <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center">
                    <Wordmark className="mb-6" />
                    <h2 className="text-2xl font-display mb-2">
                        No recommendations found.
                    </h2>
                    <p className="text-foreground/60 mb-6">
                        We couldn't find any movies for this conversation.
                    </p>
                    <Button
                        onClick={() => navigate("/discover")}
                        className="bg-gradient-brand text-white border-0"
                    >
                        Go Back to Discover
                    </Button>
                </div>
            </>
        );
    }

    const featured = movies[0];
    const rest = movies.slice(1);

    return (
        <>
            <Background opacity={0.3} />

            <header className="sticky top-0 z-30 glass-panel rounded-none border-x-0 border-t-0 px-6 py-3 flex items-center justify-between">
                <Wordmark />
                <Button
                    variant="ghost"
                    onClick={() => navigate("/discover")}
                    className="text-foreground/65 hover:text-foreground hover:bg-white/5"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Refine My Search
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-9 h-9 rounded-full bg-gradient-brand text-white text-sm font-semibold flex items-center justify-center hover:opacity-90 shadow-glow-violet">
                            {userInitial}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-panel border-white/10 mr-2 mt-1">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <main className="container py-10 space-y-14">
                <Reveal>
                    <section className="glass-panel relative overflow-hidden p-8 md:p-12">
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-violet to-transparent" />
                            <div
                                className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent"
                                style={{ transform: "translateY(8px)" }}
                            />
                        </div>
                        <div className="relative max-w-3xl">
                            <div className="label-tracked mb-3">
                                Based on your mood
                            </div>
                            <p className="font-display text-2xl md:text-3xl leading-snug text-foreground/95">
                                "{summary}"
                            </p>
                        </div>
                    </section>
                </Reveal>

                {featured && (
                    <Reveal delay={150}>
                        <section>
                            <div className="glass-card overflow-hidden grid md:grid-cols-2 gap-0 p-0 hover:translate-y-0">
                                <div className="relative h-72 md:h-auto min-h-[420px]">
                                    <PosterPlaceholder movie={featured} />
                                    <div className="hidden md:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[hsl(var(--card)_/_0.6)]" />
                                </div>
                                <div className="p-8 md:p-10 flex flex-col">
                                    <span className="self-start px-3 py-1 text-[11px] font-bold text-white rounded-full bg-gradient-brand shadow-glow-violet mb-4">
                                        #1 PICK
                                    </span>

                                    <h2 className="font-display text-4xl md:text-5xl leading-tight">
                                        {featured.title}
                                    </h2>
                                    <div className="text-sm text-white/55 mt-5">
                                        {featured.year || "N/A"} ·{" "}
                                        {featured.runtime || "N/A"}
                                    </div>
                                    <div className="flex items-center gap-5 mt-5 text-sm text-foreground/70">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-accent-cyan" />
                                            TMDB
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-gradient-brand text-white">
                                            {featured.match || 90}% match
                                        </span>
                                    </div>

                                    <div
                                        className="mt-5 p-4 rounded-xl bg-white/5 border-l-2 border-accent-violet"
                                        style={{
                                            borderImage:
                                                "linear-gradient(180deg, hsl(var(--accent-violet)), hsl(var(--accent-cyan))) 1",
                                        }}
                                    >
                                        <div className="label-tracked mb-2 text-white/50">
                                            Film Description
                                        </div>
                                        <p className="text-sm leading-relaxed text-foreground/85">
                                            {featured.overview ||
                                                "No overview available."}
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <div className="label-tracked mb-3 text-white/50">
                                            Genres
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(featured.genres || []).map(
                                                (g) => (
                                                    <span
                                                        key={g}
                                                        className="glass-pill px-3 py-1 text-xs text-white/80"
                                                    >
                                                        {g}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="label-tracked mb-3 text-white/50">
                                            Cast
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(featured.cast || []).map((c) => (
                                                <span
                                                    key={c}
                                                    className="glass-pill px-3 py-1 text-xs text-white/80"
                                                >
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="label-tracked mb-3 text-white/50">
                                            Director
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(() => {
                                                const dirs = splitCommaList(
                                                    featured.director,
                                                );
                                                if (dirs.length === 0) {
                                                    return (
                                                        <span className="text-sm text-white/85 font-medium">
                                                            Unknown
                                                        </span>
                                                    );
                                                }
                                                return dirs.map((d) => (
                                                    <span
                                                        key={d}
                                                        className="glass-pill px-3 py-1 text-xs text-white/80"
                                                    >
                                                        {d}
                                                    </span>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Reveal>
                )}

                <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {rest.map((m, i) => (
                        <Reveal key={m.id} delay={i * 50}>
                            <button
                                onClick={() => setOpen(m)}
                                className="text-left w-full glass-card overflow-hidden group block"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <div
                                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                        style={{ filter: "saturate(0.85)" }}
                                    >
                                        <PosterPlaceholder movie={m} />
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <RankBadge rank={i + 2} />
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <MatchBadge match={m.match} />
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-base leading-tight line-clamp-1">
                                            {m.title}
                                        </h3>
                                        <div className="text-[10px] text-foreground/50 mt-0.5">
                                            {m.year} ·{" "}
                                            {(m.genres || [])
                                                .slice(0, 2)
                                                .join(", ")}
                                        </div>
                                    </div>
                                    <p className="text-xs text-foreground/65 leading-relaxed line-clamp-2 pl-2 border-l border-accent-violet/60">
                                        {m.overview}
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] text-foreground/55">
                                        <span className="flex items-center gap-2">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />{" "}
                                                {m.runtime || "N/A"}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </Reveal>
                    ))}
                </section>

                <Reveal>
                    <section className="glass-panel max-w-3xl mx-auto p-8 md:p-10 text-center">
                        <h3 className="font-display text-3xl md:text-4xl">
                            Not quite right?
                        </h3>
                        <p className="text-foreground/55 mt-2">
                            Refine your mood, or start a new conversation.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Button
                                onClick={() =>
                                    navigate(`/discover?thread=${threadId}`)
                                }
                                className="rounded-full bg-gradient-brand text-white border-0 shadow-glow-violet"
                            >
                                Refine My Search
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                className="rounded-full glass-pill"
                            >
                                <Link to="/discover">Start Fresh</Link>
                            </Button>
                        </div>
                    </section>
                </Reveal>

                <footer className="text-center text-xs text-foreground/35 pt-6">
                    © 2026 SeMedia · Curated by feeling.
                </footer>
            </main>

            <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-white/10 bg-transparent text-white">
                    {open && (
                        <div className="glass-card p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                            <div
                                className={`relative h-80 bg-gradient-to-br from-white/10 to-white/5`}
                            >
                                {open.backdrop_path ? (
                                    <img
                                        src={
                                            open.backdrop_path.startsWith(
                                                "http",
                                            )
                                                ? open.backdrop_path
                                                : `https://image.tmdb.org/t/p/w1280${open.backdrop_path}`
                                        }
                                        alt="Backdrop"
                                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    />
                                ) : (
                                    <div className="absolute inset-0 noise-overlay" />
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                            </div>
                            <div className="p-8 pt-12 relative">
                                <DialogTitle className="font-display text-4xl text-white">
                                    {open.title}
                                </DialogTitle>
                                <div className="text-sm text-white/55 mt-1">
                                    {open.year} · {open.runtime}
                                </div>
                                <div className="flex items-center gap-5 mt-3 text-sm text-white/70">
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-gradient-brand text-white">
                                        {open.match || 90}% match
                                    </span>
                                </div>

                                <div className="mt-6 p-4 rounded-xl bg-white/5 border-l-2 border-accent-violet">
                                    <div className="label-tracked mb-2 text-white/50">
                                        Film Description
                                    </div>
                                    <p className="text-sm leading-relaxed text-white/85">
                                        {open.overview}
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <div className="label-tracked mb-3 text-white/50">
                                        Genres
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(open.genres || []).map((g) => (
                                            <span
                                                key={g}
                                                className="glass-pill px-3 py-1 text-xs text-white/80"
                                            >
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="label-tracked mb-3 text-white/50">
                                        Cast
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(open.cast || []).map((c) => (
                                            <span
                                                key={c}
                                                className="glass-pill px-3 py-1 text-xs text-white/80"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="label-tracked mb-3 text-white/50">
                                        Director
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            const dirs = splitCommaList(
                                                open.director,
                                            );
                                            if (dirs.length === 0) {
                                                return (
                                                    <span className="text-sm text-white/85">
                                                        Unknown
                                                    </span>
                                                );
                                            }
                                            return dirs.map((d) => (
                                                <span
                                                    key={d}
                                                    className="glass-pill px-3 py-1 text-xs text-white/80"
                                                >
                                                    {d}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Recommendations;
