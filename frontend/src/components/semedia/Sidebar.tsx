import { MessageSquare, Plus, X, History, Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type Conversation = {
    id: number;
    thread_id: string;
    title: string;
    summary: string;
    created_at?: string; // ضفنا التاريخ هنا
};

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    conversations: Conversation[];
    activeThreadId: string | null;
    onSelect: (threadId: string) => void;
    onNewChat: () => void;
    onDelete?: (conversationId: number) => Promise<void>;
}

export const Sidebar = ({
    isOpen,
    setIsOpen,
    conversations,
    activeThreadId,
    onSelect,
    onNewChat,
    onDelete,
}: SidebarProps) => {
    // ترتيب المحادثات من الأحدث للأقدم بناءً على التاريخ
    const sortedConversations = [...conversations].sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    });

    // دالة لتنسيق التاريخ عشان يظهر بشكل شيك (مثال: Oct 24, 2026)
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar container */}
            <aside
                className={cn(
                    "fixed lg:static top-0 left-0 h-full z-50 flex flex-col w-[280px] transition-transform duration-300 ease-in-out glass-panel rounded-none border-y-0 border-l-0",
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0",
                )}
            >
                <div className="p-4 flex items-center justify-between">
                    <button
                        onClick={onNewChat}
                        className="flex-1 glass-pill py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
                    >
                        <Plus className="w-4 h-4 text-accent-cyan" />
                        New Chat
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="ml-3 p-2 rounded-full lg:hidden hover:bg-white/5 text-foreground/60"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2">
                        <History className="w-3.5 h-3.5" />
                        Past Recommendations
                    </div>

                    <div className="space-y-1">
                        {sortedConversations.length === 0 ? (
                            <p className="text-xs text-foreground/40 px-3 py-4 text-center">
                                No past searches yet.
                            </p>
                        ) : (
                            sortedConversations.map((conv) => (
                                <div
                                    key={conv.thread_id}
                                    className={cn(
                                        "relative group px-3 py-3 rounded-xl flex items-start gap-3 transition-all",
                                        activeThreadId === conv.thread_id
                                            ? "bg-gradient-to-r from-accent-violet/20 to-transparent border-l-2 border-accent-violet text-foreground"
                                            : "hover:bg-white/5 text-foreground/70 hover:text-foreground",
                                    )}
                                >
                                    <button
                                        onClick={() => {
                                            onSelect(conv.thread_id);
                                            if (window.innerWidth < 1024)
                                                setIsOpen(false);
                                        }}
                                        className="flex-1 min-w-0 flex items-start gap-3"
                                    >
                                        <MessageSquare
                                            className={cn(
                                                "w-4 h-4 mt-0.5 shrink-0 transition-colors",
                                                activeThreadId === conv.thread_id
                                                    ? "text-accent-violet"
                                                    : "text-foreground/40 group-hover:text-foreground/60",
                                            )}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {conv.title || "New Conversation"}
                                            </p>

                                            <div className="flex items-center justify-between mt-1.5">
                                                {conv.summary ? (
                                                    <p className="text-[11px] text-foreground/40 truncate max-w-[60%]">
                                                        {conv.summary}
                                                    </p>
                                                ) : (
                                                    <div />
                                                )}

                                                {conv.created_at && (
                                                    <span className="flex items-center gap-1 text-[10px] text-foreground/35 whitespace-nowrap">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(
                                                            conv.created_at,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    {onDelete && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/20 text-foreground/40 hover:text-destructive transition-all shrink-0"
                                                    title="Delete conversation"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="glass-panel border-white/10">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently remove "{conv.title || "this conversation"}" and all its recommendations. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => onDelete(conv.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};
