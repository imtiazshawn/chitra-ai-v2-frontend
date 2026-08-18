"use client";

import { useState } from "react";
import { Clapperboard, Coins, Film, LibraryBig, LogOut, User } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { label: "Studio",      href: "#studio",  icon: Clapperboard },
  { label: "Reel Library", href: "#library", icon: LibraryBig },
];

export function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const { profile } = useUserProfile(!!user);

  const isAuthenticated = !!user;
  const isPro = profile?.plan === "pro";

  // What to show in the quota/token badge
  const badgeLabel = (() => {
    if (!profile) return null;
    if (isPro) {
      return profile.token_balance === 0
        ? "No tokens"
        : `${profile.token_balance} token${profile.token_balance === 1 ? "" : "s"}`;
    }
    return profile.quota_remaining === 0
      ? "Limit reached"
      : `${profile.quota_remaining}/${profile.quota_limit} reels left`;
  })();

  const badgeExhausted =
    profile !== null &&
    (isPro ? profile.token_balance === 0 : profile.quota_remaining === 0);

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="border-b border-panel-hairline bg-void/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

            {/* Logo */}
            <a href="#top" className="group flex items-center gap-2.5">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-panel-hairline-strong bg-panel">
                <Film className="h-4 w-4 text-amber-400" strokeWidth={2.25} />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ember-500 shadow-[0_0_8px_rgba(239,65,54,0.9)] animate-blink" />
              </span>
              <span className="font-display text-[17px] font-semibold tracking-tight text-ink">
                Chitra<span className="text-amber-400">AI</span>
              </span>
            </a>

            {/* Nav links */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-[12.5px] uppercase tracking-wider text-ink-dim transition-colors hover:bg-panel hover:text-ink"
                >
                  <link.icon className="h-3.5 w-3.5" strokeWidth={2} />
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Render engine status */}
              <div className="hidden items-center gap-1.5 rounded-full border border-panel-hairline-strong bg-panel px-3 py-1.5 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(76,224,210,0.9)]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
                  Render engine online
                </span>
              </div>

              {/* Plan badge — only shown when signed in */}
              {isAuthenticated && profile && (
                <div className="hidden items-center gap-2 sm:flex">
                  {/* Plan pill */}
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
                      isPro
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                        : "border-panel-hairline-strong bg-panel text-ink-faint"
                    )}
                  >
                    {isPro ? "Pro" : "Free"}
                  </span>

                  {/* Quota / token counter */}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider",
                      badgeExhausted
                        ? "border-ember-500/40 bg-ember-500/10 text-ember-400"
                        : "border-panel-hairline-strong bg-panel text-ink-dim"
                    )}
                    title={
                      isPro
                        ? `${profile.token_balance} tokens remaining`
                        : `${profile.quota_remaining} of ${profile.quota_limit} free reels remaining this month`
                    }
                  >
                    {isPro ? (
                      <Coins className="h-3 w-3 shrink-0" />
                    ) : (
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          badgeExhausted ? "bg-ember-400" : "bg-amber-400"
                        )}
                      />
                    )}
                    {badgeLabel}
                  </div>
                </div>
              )}

              {/* Auth control */}
              {loading ? (
                <div className="h-8 w-20 animate-pulse rounded-md bg-panel" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="hidden items-center gap-1.5 font-mono text-[11px] text-ink-faint sm:flex">
                    <User className="h-3 w-3" />
                    {user.email?.split("@")[0]}
                  </span>
                  <button
                    onClick={signOut}
                    title="Sign out"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-panel-hairline text-ink-faint transition-colors hover:bg-panel hover:text-ink"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="rounded-md bg-amber-400 px-4 py-2 font-display text-[13px] font-semibold text-void transition-all hover:bg-amber-200 active:scale-[0.97]"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignIn={signIn}
        onSignUp={signUp}
        onSignInWithGoogle={signInWithGoogle}
      />
    </>
  );
}
