"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Film, Loader2, Mail, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

type Mode = "signin" | "signup";

export function AuthModal({ open, onClose, onSignIn, onSignUp }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      setEmail("");
      setPassword("");
      setLoading(false);
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await onSignIn(email.trim(), password);
        onClose();
      } else {
        await onSignUp(email.trim(), password);
        setSuccess(
          "Account created! Check your email to confirm, then sign in."
        );
        setMode("signin");
        setPassword("");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal
            aria-labelledby="auth-title"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[10vh] z-50 mx-auto max-w-sm rounded-2xl border border-panel-hairline bg-[#111114] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* Header stripe */}
            <div
              className="flex h-7 items-stretch overflow-hidden rounded-t-2xl"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-32deg, #17171b 0 26px, #1f1a10 26px 30px, #17171b 30px 56px, #ffb020 56px 60px)",
              }}
              aria-hidden
            />

            {/* Content */}
            <div className="p-7">
              {/* Logo + close */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border border-panel-hairline-strong bg-panel">
                    <Film className="h-4 w-4 text-amber-400" strokeWidth={2.25} />
                  </span>
                  <span className="font-display text-[16px] font-semibold text-ink">
                    Chitra<span className="text-amber-400">AI</span>
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-panel hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h2
                id="auth-title"
                className="mt-5 font-display text-xl font-semibold text-ink"
              >
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1 text-sm text-ink-dim">
                {mode === "signin"
                  ? "Sign in to generate and manage your reels."
                  : "Start free — 2 reels per month, no card required."}
              </p>

              {/* Success message */}
              {success && (
                <div className="mt-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-300">
                  {success}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 rounded-lg border border-ember-500/30 bg-ember-500/10 p-3 text-sm text-ember-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div>
                  <label
                    htmlFor="auth-email"
                    className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-faint"
                  >
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    id="auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-panel-hairline bg-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="auth-password"
                    className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-faint"
                  >
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    required
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                    minLength={mode === "signup" ? 8 : undefined}
                    className="w-full rounded-xl border border-panel-hairline bg-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30 disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password.trim()}
                  className={cn(
                    "mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3",
                    "font-display text-sm font-semibold transition-all",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    "bg-amber-400 text-void hover:bg-amber-200 active:scale-[0.98]",
                    "shadow-[0_0_0_0_rgba(255,176,32,0)] hover:shadow-[0_0_24px_2px_rgba(255,176,32,0.25)]"
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {loading
                    ? "Please wait…"
                    : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
                </button>
              </form>

              {/* Toggle */}
              <p className="mt-5 text-center text-sm text-ink-dim">
                {mode === "signin" ? (
                  <>
                    No account yet?{" "}
                    <button
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-amber-400 hover:text-amber-200 transition-colors"
                    >
                      Sign up free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-amber-400 hover:text-amber-200 transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
