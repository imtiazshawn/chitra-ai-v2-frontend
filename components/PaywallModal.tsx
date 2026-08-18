"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Clapperboard, Crown, Sparkles, X, Zap } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile | null;
}

const PRO_FEATURES = [
  { icon: Zap,         text: "Token-based — buy exactly what you need" },
  { icon: Sparkles,    text: "Priority render queue" },
  { icon: Crown,       text: "Premium voice options" },
  { icon: Clapperboard, text: "HD 1080p exports" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

export function PaywallModal({ open, onClose, profile }: PaywallModalProps) {
  const isPro   = profile?.plan === "pro";
  const isNoTokens = isPro && (profile?.token_balance ?? 0) === 0;

  const heading = isNoTokens
    ? "You're out of tokens"
    : "You've hit the free limit";

  const subtext = isNoTokens
    ? "Purchase more tokens to keep generating reels."
    : `Free accounts get ${profile?.quota_limit ?? 2} reels per month. Upgrade to Pro to keep the camera rolling.`;

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
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal
            aria-labelledby="paywall-title"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[8vh] z-50 mx-auto max-w-md rounded-2xl border border-amber-400/20 bg-[#111114] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* Amber glow bar */}
            <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

            <div className="p-7">
              {/* Close */}
              <div className="flex items-center justify-end">
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-panel hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Icon + heading */}
              <div className="mt-1 text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
                  <Crown className="h-7 w-7 text-amber-400" />
                </span>
                <h2
                  id="paywall-title"
                  className="mt-4 font-display text-2xl font-semibold text-ink"
                >
                  {heading}
                </h2>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-dim">
                  {subtext}
                </p>
              </div>

              {/* Context row */}
              {!isNoTokens && profile?.quota_resets_at && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-panel-hairline bg-panel p-3">
                  <CalendarClock className="h-4 w-4 shrink-0 text-ink-dim" />
                  <p className="text-sm text-ink-dim">
                    Free credits reset on{" "}
                    <span className="text-ink font-medium">
                      {formatDate(profile.quota_resets_at)}
                    </span>
                    .
                  </p>
                </div>
              )}

              {/* Feature list — shown for free→pro upsell only */}
              {!isNoTokens && (
                <ul className="mt-5 space-y-2.5">
                  {PRO_FEATURES.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm text-ink-dim">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10">
                        <Icon className="h-3.5 w-3.5 text-amber-400" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              )}

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={() => {
                    // Payment system coming next sprint
                    alert("Payment coming soon! Check back shortly.");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-semibold text-void transition-all hover:bg-amber-200 active:scale-[0.98] shadow-[0_0_24px_2px_rgba(255,176,32,0.2)]"
                >
                  <Crown className="h-4 w-4" />
                  {isNoTokens ? "Buy more tokens" : "Upgrade to Pro"}
                </button>
                <button
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-panel-hairline px-5 py-2.5 font-display text-sm font-semibold text-ink-dim transition-all hover:border-panel-hairline-strong hover:text-ink"
                >
                  {isNoTokens
                    ? "Close"
                    : `Wait until ${profile?.quota_resets_at ? formatDate(profile.quota_resets_at) : "next month"}`}
                </button>
              </div>

              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                No charge today — coming soon
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
