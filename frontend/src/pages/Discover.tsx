import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ArrowRight, LogOut, Menu } from "lucide-react";
import { Background } from "@/components/semedia/Background";
import { Wordmark } from "@/components/semedia/Wordmark";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/useAuth";
import { Sidebar, Conversation } from "@/components/semedia/Sidebar";
import { api } from "@/lib/axios";

type Msg = { id: string; role: "user" | "ai"; text: string };

const SUGGESTIONS = [
    "Something intense and thought-provoking",
    "Lighthearted, I need to laugh",
    "Epic adventure — take me somewhere",
    "Quiet and deeply emotional",
];

const TypingDots = () => (
    <span className="inline-flex items-end gap-1 h-4">
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="block w-1.5 h-3 rounded-full bg-foreground/60 origin-bottom"
                style={{
                    animation: `typing-dot 1.2s ease-in-out infinite ${i * 0.15}s`,
                }}
            />
        ))}
    </span>
);

const Discover = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const [revealing, setRevealing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Backend States
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [threadId, setThreadId] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const taRef = useRef<HTMLTextAreaElement>(null);

    const showProceed = messages.some((m) => m.role === "ai") && !thinking;

    const fetchConversations = async () => {
        try {
            const res = await api.get("/api/conversations/");
            setConversations(res.data);
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, thinking]);

    const send = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Msg = {
            id: crypto.randomUUID(),
            role: "user",
            text: text.trim(),
        };
        setMessages((m) => [...m, userMsg]);
        setInput("");

        if (taRef.current) taRef.current.style.height = "auto";
        setThinking(true);

        try {
            const res = await api.post("/api/ai/chat/", {
                message: text.trim(),
                thread_id: threadId,
                proceed: false,
            });

            const data = res.data;

            if (!threadId && data.thread_id) {
                setThreadId(data.thread_id);
                fetchConversations();
            }

            if (data.message) {
                setMessages((m) => [
                    ...m,
                    { id: crypto.randomUUID(), role: "ai", text: data.message },
                ]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((m) => [
                ...m,
                {
                    id: crypto.randomUUID(),
                    role: "ai",
                    text: "I'm having trouble connecting right now. Please try again.",
                },
            ]);
        } finally {
            setThinking(false);
        }
    };

    const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(input);
        }
    };

    const onProceed = async () => {
        setThinking(true);
        try {
            await api.post("/api/ai/chat/", {
                message: "I am ready for recommendations.",
                thread_id: threadId,
                proceed: true,
            });

            setRevealing(true);
            setTimeout(
                () => navigate(`/recommendations?thread=${threadId}`),
                700,
            );
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        } finally {
            setThinking(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleNewChat = () => {
        setThreadId(null);
        setMessages([]);
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    const handleSelectConversation = (selectedThreadId: string) => {
        navigate(`/recommendations?thread=${selectedThreadId}`);
    };

    const userInitial = user?.first_name?.charAt(0).toUpperCase() || "U";

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">
            <Background opacity={0.25} />

            {revealing && (
                <div
                    className="fixed inset-0 z-[100] bg-gradient-brand pointer-events-none"
                    style={{
                        animation: "radial-reveal 700ms ease-out forwards",
                    }}
                />
            )}

            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                conversations={conversations}
                activeThreadId={threadId}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
                onDelete={async (id) => {
                    const conv = conversations.find((c) => c.id === id);
                    await api.delete(`/api/conversations/${id}`);
                    setConversations((cs) => cs.filter((c) => c.id !== id));
                    if (conv && conv.thread_id === threadId) {
                        setThreadId(null);
                        setMessages([]);
                    }
                }}
            />

            <div className="flex-1 flex flex-col relative min-w-0">
                <header className="glass-panel rounded-none border-x-0 border-t-0 px-4 md:px-6 py-3 flex items-center justify-between gap-4 z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-full hover:bg-white/5 text-foreground/80"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Wordmark />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-9 h-9 rounded-full bg-gradient-brand text-white text-sm font-semibold flex items-center justify-center hover:opacity-90 shadow-glow-violet">
                                {userInitial}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-panel border-white/10 mr-2 mt-1 min-w-[200px]">
                            <div className="px-2 py-1.5 text-sm">
                                <p className="font-medium text-foreground">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="text-xs text-foreground/60 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <div className="h-px bg-white/10 my-1" />
                            <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                <main
                    ref={scrollRef}
                     className="flex-1 overflow-y-auto relative z-0"
                >
                    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 pb-32">
                        {messages.length === 0 ? (
                            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
                                <h1 className="font-display text-3xl md:text-4xl mb-3">
                                    What kind of story do you need tonight?
                                </h1>
                                <p className="text-foreground/55 mb-8 max-w-md">
                                    Describe a mood, an emotion, a craving.
                                    There's no wrong answer.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => send(s)}
                                            className="glass-pill px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-white/10"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 mb-10">
                                {messages.map((m, idx) => (
                                    <div
                                        key={m.id}
                                        className={cn(
                                            "flex animate-slide-up",
                                            m.role === "user"
                                                ? "justify-end"
                                                : "justify-start",
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[85%] md:max-w-[80%] flex flex-col gap-1.5",
                                                m.role === "user"
                                                    ? "items-end"
                                                    : "items-start",
                                            )}
                                        >
                                            {m.role === "ai" &&
                                                (idx === 0 ||
                                                    messages[idx - 1]?.role !==
                                                        "ai") && (
                                                    <div className="text-[11px] text-accent-cyan flex items-center gap-1.5 pl-1 opacity-80">
                                                        SeMedia AI
                                                    </div>
                                                )}
                                            <div
                                                className={cn(
                                                    "px-5 py-3.5 text-[15px] leading-relaxed backdrop-blur-md shadow-sm",
                                                    m.role === "user"
                                                        ? "rounded-[22px] rounded-tr-[8px] text-white"
                                                        : "rounded-[22px] rounded-tl-[8px] text-foreground/90 border border-white/10",
                                                )}
                                                style={
                                                    m.role === "user"
                                                        ? {
                                                              background:
                                                                  "linear-gradient(135deg, hsl(var(--accent-violet) / 0.8), hsl(var(--accent-cyan) / 0.6))",
                                                          }
                                                        : {
                                                              background:
                                                                  "hsl(0 0% 100% / 0.03)",
                                                          }
                                                }
                                            >
                                                {m.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {thinking && (
                                    <div className="flex justify-start animate-slide-up">
                                        <div
                                            className="px-5 py-4 rounded-[22px] rounded-tl-[8px] border border-white/10 backdrop-blur-md"
                                            style={{
                                                background:
                                                    "hsl(0 0% 100% / 0.03)",
                                            }}
                                        >
                                            <TypingDots />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                <div className="absolute bottom-0 left-0 right-0 w-full bg-gradient-to-t from-background via-background/90 to-transparent pt-10 pb-4 px-4 md:px-6 z-20">
                    <div className="max-w-3xl mx-auto space-y-3">
                        {showProceed && (
                            <div className="animate-slide-up">
                                <button
                                    onClick={onProceed}
                                    disabled={thinking}
                                    className="w-full block group disabled:opacity-50"
                                >
                                    <div className="relative glass-card px-4 py-3 flex items-center justify-between gap-3 hover:scale-[1.01] transition-transform">
                                        <div className="absolute -inset-px rounded-xl bg-gradient-brand opacity-0 group-hover:opacity-30 transition-opacity blur-md" />
                                        <div className="text-sm font-medium text-foreground relative z-10">
                                            {thinking
                                                ? "Preparing your recommendations..."
                                                : "I'm ready. Find my film"}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative z-10">
                                            <ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )}

                        <div className="flex items-end gap-2">
                            <div className="flex-1 glass-input p-1.5 flex items-end rounded-[24px]">
                                <textarea
                                    ref={taRef}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        const el = e.currentTarget;
                                        el.style.height = "auto";
                                        el.style.height =
                                            Math.min(el.scrollHeight, 120) +
                                            "px";
                                    }}
                                    onKeyDown={onKey}
                                    rows={1}
                                    placeholder="Tell me how you're feeling..."
                                    className="w-full resize-none bg-transparent outline-none px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/35 thin-scroll max-h-[120px]"
                                />
                            </div>
                            <Button
                                onClick={() => send(input)}
                                disabled={!input.trim() || thinking}
                                className={cn(
                                    "w-12 h-12 shrink-0 p-0 rounded-full border-0 transition-all",
                                    input.trim() && !thinking
                                        ? "bg-gradient-brand text-white shadow-glow-violet"
                                        : "bg-white/5 text-foreground/40",
                                )}
                            >
                                <Send className="w-4.5 h-4.5 ml-0.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;
