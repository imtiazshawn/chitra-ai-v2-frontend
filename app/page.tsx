"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PromptConsole } from "@/components/PromptConsole";
import { PipelineTimeline } from "@/components/PipelineTimeline";
import { VideoResult } from "@/components/VideoResult";
import { ErrorPanel } from "@/components/ErrorPanel";
import { ReelGallery } from "@/components/ReelGallery";
import { GallerySkeleton } from "@/components/GallerySkeleton";
import { GalleryError } from "@/components/GalleryError";
import { DemoDock } from "@/components/DemoDock";
import { AuthModal } from "@/components/AuthModal";
import { PaywallModal } from "@/components/PaywallModal";
import { useReelGeneration } from "@/hooks/useReelGeneration";
import { useReelHistory } from "@/hooks/useReelHistory";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { GenerationStatus } from "@/lib/types";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const { user, signIn, signUp } = useAuth();
  const { profile, refreshProfile } = useUserProfile(!!user);

  const { reels, status: galleryStatus, errorMessage, reload, prepend } =
    useReelHistory();

  // Reload gallery + refresh profile when auth state changes
  useEffect(() => {
    reload();
    refreshProfile();
  }, [user, reload, refreshProfile]);

  const { scenario, stages, job, generate, regenerate, preview } =
    useReelGeneration({
      onCompleted: (completedJob) => {
        prepend(completedJob);
        refreshProfile();        // deduction already happened on backend; re-fetch to reflect new balance
      },
      onAuthRequired: () => setAuthOpen(true),
      onQuotaExceeded: () => setPaywallOpen(true),
    });

  const status: GenerationStatus =
    scenario === "processing"
      ? "processing"
      : scenario === "completed"
      ? "completed"
      : scenario === "error"
      ? "error"
      : "idle";

  const handleAuthClose = useCallback(() => setAuthOpen(false), []);
  const handlePaywallClose = useCallback(() => setPaywallOpen(false), []);

  return (
    <>
      <div className="grain-field" />
      <div className="vignette" />

      <Navbar />

      <main id="top" className="flex-1">
        {/* ---------------------------------------------------------------- */}
        {/* Hero / Studio                                                     */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="studio"
          className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] opacity-70"
            style={{
              background:
                "radial-gradient(60% 55% at 50% 0%, rgba(255,176,32,0.14), transparent 60%), radial-gradient(40% 40% at 85% 15%, rgba(76,224,210,0.10), transparent 60%)",
            }}
          />

          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-panel-hairline-strong bg-panel px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-dim"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Script to screen, fully automated
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-6xl"
            >
              Type a thought.
              <br />
              <span className="text-amber-400">Screen a reel.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto mt-4 max-w-xl text-balance text-[15.5px] leading-relaxed text-ink-dim sm:text-base"
            >
              One line in. ChitraAI writes the script, records the voiceover,
              syncs the captions, sources the footage, and cuts the final
              vertical edit — no timeline required, no editor needed.
            </motion.p>
          </div>

          <div className="mt-10">
            <PromptConsole
              status={status}
              isAuthenticated={!!user}
              onGenerate={generate}
              onAuthRequired={() => setAuthOpen(true)}
            />
          </div>

          {/* Live pipeline / result / error zone */}
          <div className="mx-auto mt-8 max-w-3xl">
            <AnimatePresence mode="wait">
              {scenario === "processing" && (
                <motion.div
                  key="pipeline"
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <PipelineTimeline stages={stages} />
                </motion.div>
              )}

              {scenario === "error" && job && (
                <motion.div
                  key="error"
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-5">
                    <PipelineTimeline stages={stages} />
                  </div>
                  <ErrorPanel job={job} onRetry={regenerate} />
                </motion.div>
              )}

              {scenario === "completed" && job && (
                <motion.div
                  key="result"
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-panel-hairline bg-panel/60 p-6 sm:p-9"
                >
                  <VideoResult job={job} onRegenerate={regenerate} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Reel library                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section
          id="library"
          className="border-t border-panel-hairline px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                  Reel library
                </span>
                <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  Your past takes
                </h2>
              </div>
              <span className="font-mono text-[12px] text-ink-faint">
                {galleryStatus === "loading"
                  ? "Loading…"
                  : galleryStatus === "ready"
                  ? `${reels.length} reel${reels.length === 1 ? "" : "s"}`
                  : ""}
              </span>
            </div>

            {galleryStatus === "loading" && <GallerySkeleton />}
            {galleryStatus === "error" && (
              <GalleryError
                message={errorMessage ?? "Something went wrong."}
                onRetry={reload}
              />
            )}
            {galleryStatus === "ready" && <ReelGallery reels={reels} />}
          </div>
        </section>
      </main>

      <Footer />

      <DemoDock scenario={scenario} onChange={preview} />

      {/* Auth modal — Navbar "Sign in" + unauthenticated generate attempts */}
      <AuthModal
        open={authOpen}
        onClose={handleAuthClose}
        onSignIn={signIn}
        onSignUp={signUp}
      />

      {/* Paywall — free quota exhausted or pro has no tokens */}
      <PaywallModal
        open={paywallOpen}
        onClose={handlePaywallClose}
        profile={profile}
      />
    </>
  );
}
