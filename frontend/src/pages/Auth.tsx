import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { Background } from "@/components/semedia/Background";
import { Wordmark } from "@/components/semedia/Wordmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/useAuth";

type Tab = "signin" | "signup";

const MOOD_PHRASES = [
    "Ready to feel something?",
    "Your next obsession awaits.",
    "Describe the feeling. We'll find the film.",
];

const passwordStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0-4
};
const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = [
    "bg-white/10",
    "bg-red-500/70",
    "bg-orange-500/70",
    "bg-yellow-500/70",
    "bg-green-500/70",
];

const InputField = ({
    label,
    type = "text",
    value,
    onChange,
    autoComplete,
    error,
    success,
    rightSlot,
    disabled,
}: {
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    autoComplete?: string;
    error?: string;
    success?: boolean;
    rightSlot?: React.ReactNode;
    disabled?: boolean;
}) => (
    <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground/65 tracking-wide uppercase">
            {label}
        </label>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete={autoComplete}
                disabled={disabled}
                className={cn(
                    "glass-input w-full px-4 py-3 text-sm",
                    disabled && "opacity-50 cursor-not-allowed",
                    error &&
                        "border-destructive/70 focus:border-destructive/70",
                    success && "border-success/60",
                )}
            />
            {rightSlot && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {rightSlot}
                </div>
            )}
        </div>
        {error && <p className="text-xs text-destructive/90">{error}</p>}
    </div>
);

const GoogleButton = ({
    label,
    onClick,
    disabled,
}: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}) => (
    <button
        type="button"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "w-full glass-pill flex items-center justify-center gap-3 py-3 text-sm font-medium text-foreground/85 hover:text-foreground transition-opacity",
            disabled && "opacity-50 cursor-not-allowed",
        )}
    >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
            />
        </svg>
        {label}
    </button>
);

const Auth = () => {
    const [tab, setTab] = useState<Tab>("signin");
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Sign in state
    const [siEmail, setSiEmail] = useState("");
    const [siPw, setSiPw] = useState("");
    const [siShow, setSiShow] = useState(false);

    // Sign up state
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const { login } = useAuth();

    const strength = passwordStrength(pw);
    const matches = pw.length > 0 && pw === pw2;

    const [phraseIdx, setPhraseIdx] = useState(0);
    useEffect(() => {
        const id = setInterval(
            () => setPhraseIdx((i) => (i + 1) % MOOD_PHRASES.length),
            3500,
        );
        return () => clearInterval(id);
    }, []);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 400);
    };

    const handleTabChange = (newTab: Tab) => {
        setTab(newTab);
        setApiError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        if (tab === "signin") {
            if (!siEmail || !siPw) return triggerShake();

            try {
                setLoading(true);
                const response = await api.post("/api/auth/signin", {
                    email: siEmail,
                    password: siPw,
                });
                login(response.data.access_token, response.data.user);

                navigate("/discover");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setApiError(
                    error.response?.data?.detail ||
                        "Failed to sign in. Please try again.",
                );
                triggerShake();
            } finally {
                setLoading(false);
            }
        } else {
            if (!first || !last || !email || strength < 2 || !matches)
                return triggerShake();

            try {
                setLoading(true);
                const response = await api.post("/api/auth/signup", {
                    first_name: first,
                    last_name: last,
                    email: email,
                    password: pw,
                });

                navigate("/discover");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setApiError(
                    error.response?.data?.detail || "Failed to create account.",
                );
                triggerShake();
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoogleLogin = async () => {
        setApiError(null);
        try {
            setLoading(true);
            const response = await api.post("/api/auth/google-login");

            if (response.data?.url) {
                window.location.href = response.data.url;
            } else {
                navigate("/discover");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setApiError(error.response?.data?.detail || "Google login failed.");
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    const cardWidth = useMemo(
        () => (tab === "signup" ? "max-w-[480px]" : "max-w-[460px]"),
        [tab],
    );

    return (
        <>
            <Background />

            <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
                <Wordmark className="mb-8" />

                <form
                    onSubmit={handleSubmit}
                    className={cn(
                        "glass-card w-full p-8 md:p-10 animate-scale-in transition-all duration-500",
                        cardWidth,
                        shake && "animate-shake",
                    )}
                    style={{
                        background:
                            "linear-gradient(180deg, hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.03))",
                    }}
                >
                    {/* Tabs */}
                    <div className="glass-pill p-1 grid grid-cols-2 mb-7">
                        {(["signin", "signup"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => handleTabChange(t)}
                                disabled={loading}
                                className={cn(
                                    "py-2 text-sm font-medium rounded-full transition-all",
                                    tab === t
                                        ? "bg-gradient-brand text-white shadow-glow-violet"
                                        : "text-foreground/55 hover:text-foreground/85",
                                )}
                            >
                                {t === "signin" ? "Sign In" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    {apiError && (
                        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                            {apiError}
                        </div>
                    )}

                    {tab === "signin" ? (
                        <div className="space-y-5 animate-fade-in">
                            <h1 className="text-2xl font-semibold">
                                Welcome back
                            </h1>
                            <InputField
                                label="Email Address"
                                type="email"
                                value={siEmail}
                                onChange={setSiEmail}
                                autoComplete="email"
                                disabled={loading}
                            />
                            <InputField
                                label="Password"
                                type={siShow ? "text" : "password"}
                                value={siPw}
                                onChange={setSiPw}
                                autoComplete="current-password"
                                disabled={loading}
                                rightSlot={
                                    <button
                                        type="button"
                                        aria-label={
                                            siShow
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() => setSiShow((v) => !v)}
                                        className="text-foreground/50 hover:text-foreground/80"
                                        disabled={loading}
                                    >
                                        {siShow ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                }
                            />
                            <div className="text-right">
                                <a
                                    href="#"
                                    className="text-xs text-accent-cyan hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-brand text-white border-0 py-6 font-semibold hover:opacity-95 disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>

                            <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-foreground/40">
                                <div className="flex-1 h-px bg-white/10" /> or
                                continue with{" "}
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            <GoogleButton
                                label="Continue with Google"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                            />

                            <p className="text-center text-sm text-foreground/55">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="text-accent-cyan hover:underline"
                                    onClick={() => handleTabChange("signup")}
                                    disabled={loading}
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-fade-in">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Create your account
                                </h1>
                                <p
                                    key={phraseIdx}
                                    className="text-sm text-foreground/55 mt-1 animate-fade-in italic"
                                >
                                    {MOOD_PHRASES[phraseIdx]}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <InputField
                                    label="First Name"
                                    value={first}
                                    onChange={setFirst}
                                    autoComplete="given-name"
                                    disabled={loading}
                                />
                                <InputField
                                    label="Last Name"
                                    value={last}
                                    onChange={setLast}
                                    autoComplete="family-name"
                                    disabled={loading}
                                />
                            </div>
                            <InputField
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                autoComplete="email"
                                disabled={loading}
                            />

                            <div className="space-y-2">
                                <InputField
                                    label="Create Password"
                                    type={show ? "text" : "password"}
                                    value={pw}
                                    onChange={setPw}
                                    autoComplete="new-password"
                                    disabled={loading}
                                    rightSlot={
                                        <button
                                            type="button"
                                            aria-label="Toggle password"
                                            onClick={() => setShow((v) => !v)}
                                            className="text-foreground/50 hover:text-foreground/80"
                                            disabled={loading}
                                        >
                                            {show ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    }
                                />
                                {pw && (
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="grid grid-cols-4 gap-1 flex-1">
                                            {[1, 2, 3, 4].map((s) => (
                                                <span
                                                    key={s}
                                                    className={cn(
                                                        "h-1 rounded-full transition-colors",
                                                        s <= strength
                                                            ? STRENGTH_COLOR[
                                                                  strength
                                                              ]
                                                            : "bg-white/10",
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-foreground/55 w-12 text-right">
                                            {STRENGTH_LABEL[strength]}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <InputField
                                label="Confirm Password"
                                type={show2 ? "text" : "password"}
                                value={pw2}
                                onChange={setPw2}
                                autoComplete="new-password"
                                success={pw2.length > 0 && matches}
                                disabled={loading}
                                error={
                                    pw2.length > 0 && !matches
                                        ? "Passwords don't match"
                                        : undefined
                                }
                                rightSlot={
                                    <>
                                        {pw2.length > 0 &&
                                            (matches ? (
                                                <Check className="w-4 h-4 text-success" />
                                            ) : (
                                                <X className="w-4 h-4 text-destructive/80" />
                                            ))}
                                        <button
                                            type="button"
                                            aria-label="Toggle password"
                                            onClick={() => setShow2((v) => !v)}
                                            className="text-foreground/50 hover:text-foreground/80 ml-1"
                                            disabled={loading}
                                        >
                                            {show2 ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </>
                                }
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-brand text-white border-0 py-6 font-semibold hover:opacity-95 disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                            <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-foreground/40">
                                <div className="flex-1 h-px bg-white/10" /> or
                                continue with{" "}
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            <GoogleButton
                                label="Sign up with Google"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                            />

                            <p className="text-center text-sm text-foreground/55">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="text-accent-cyan hover:underline"
                                    onClick={() => handleTabChange("signin")}
                                    disabled={loading}
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    )}
                </form>

                <p className="text-xs text-foreground/40 mt-6 max-w-md text-center">
                    By {tab === "signin" ? "signing in" : "signing up"}, you
                    agree to our{" "}
                    <a href="#" className="underline hover:text-foreground/60">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-foreground/60">
                        Privacy Policy
                    </a>
                    .
                </p>

                <Link
                    to="/"
                    className="mt-4 text-xs text-foreground/40 hover:text-foreground/70"
                >
                    ← Back to home
                </Link>
            </main>
        </>
    );
};

export default Auth;
