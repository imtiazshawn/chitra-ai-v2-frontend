"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PromptConsole } from "@/components/PromptConsole";
import { PipelineTimeline } from "@/components/PipelineTimeline";
import { VideoResult } from "@/components/VideoResult";
import { ErrorPanel } from "@/components/ErrorPanel";
import { ReelGallery } from "@/components/ReelGallery";
import { GallerySkeleton } from "@/components/GallerySkeleton";
import { DemoDock, DemoScenario } from "@/components/DemoDock";
import { INITIAL_STAGES, PAST_REELS } from "@/lib/mock-data";
import { GenerationStatus, PipelineStage, ReelJob } from "@/lib/types";

const STAGE_DURATIONS: Record<string, number> = {
  scripting: 1300,
  audio: 1700,
  captions: 1200,
  assets: 1500,
  rendering: 2100,
};

const ERROR_STAGES: PipelineStage[] = INITIAL_STAGES.map((s) => {
  if (s.key === "scripting" || s.key === "audio" || s.key === "captions")
    return { ...s, status: "done", progress: 100 };
  if (s.key === "assets")
    return { ...s, status: "error", progress: 62 };
  return s;
});

function cloneStages() {
  return INITIAL_STAGES.map((s) => ({ ...s }));
}

export default function Home() {
  const [scenario, setScenario] = useState<DemoScenario>("idle");
  const [stages, setStages] = useState<PipelineStage[]>(cloneStages());
  const [job, setJob] = useState<ReelJob | null>(null);
  const [activePrompt, setActivePrompt] = useState("");
  const runId = useRef(0);

  const status: GenerationStatus =
    scenario === "processing"
      ? "processing"
      : scenario === "completed"
      ? "completed"
      : scenario === "error"
      ? "error"
      : "idle";

  // Drive the demo dock's static scenarios (jump straight to a state)
  const handleScenarioChange = (next: DemoScenario) => {
    runId.current += 1; // invalidate any running simulation
    setScenario(next);

    if (next === "error") {
      setStages(ERROR_STAGES);
      setJob({
        id: "reel_demo_err",
        prompt: activePrompt || "The last library on earth",
        status: "error",
        createdAt: new Date().toISOString(),
        errorMessage:
          "Asset fetch timed out — no footage matched 3 script lines.",
        errorStage: "assets",
      });
    } else if (next === "completed") {
      setStages(INITIAL_STAGES.map((s) => ({ ...s, status: "done", progress: 100 })));
      setJob({
        id: "reel_demo_complete",
        prompt: activePrompt || "Life is beautiful",
        status: "completed",
        createdAt: new Date().toISOString(),
        durationSeconds: 42,
        supabaseUrl:
          "https://xzkq-storage.supabase.co/storage/v1/object/public/reels/reel_demo.mp4",
      });
    } else if (next === "idle") {
      setStages(cloneStages());
      setJob(null);
    }
  };

  const runSimulation = async (prompt: string) => {
    const myRun = ++runId.current;
    setActivePrompt(prompt);
    setJob(null);
    setScenario("processing");
    const freshStages = cloneStages();
    setStages(freshStages);

    for (let i = 0; i < freshStages.length; i++) {
      if (runId.current !== myRun) return;
      const stageKey = freshStages[i].key;
      const duration = STAGE_DURATIONS[stageKey] ?? 1400;
      const steps = 16;
      const stepTime = duration / steps;

      setStages((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "active", progress: 0 } : s))
      );

      for (let step = 1; step <= steps; step++) {
        await new Promise((r) => setTimeout(r, stepTime));
        if (runId.current !== myRun) return;
        setStages((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, progress: Math.min(100, (step / steps) * 100) } : s
          )
        );
      }

      setStages((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "done", progress: 100 } : s))
      );
    }

    if (runId.current !== myRun) return;
    setJob({
      id: `reel_${Math.random().toString(36).slice(2, 8)}`,
      prompt,
      status: "completed",
      createdAt: new Date().toISOString(),
      durationSeconds: 38 + Math.round(Math.random() * 20),
      supabaseUrl:
        "https://xzkq-storage.supabase.co/storage/v1/object/public/reels/reel_new.mp4",
    });
    setScenario("completed");
  };

  const handleGenerate = (prompt: string) => {
    runSimulation(prompt);
  };

  const handleRegenerate = () => {
    if (activePrompt) runSimulation(activePrompt);
  };

  const handleRetry = () => {
    if (activePrompt) runSimulation(activePrompt);
    else setScenario("idle");
  };

  const galleryReels = scenario === "empty" ? [] : PAST_REELS;

  return (
    <>
      <div className="grain-field" />
      <div className="vignette" />

      <Navbar />

      <main id="top" className="flex-1">
        {/* ------------------------------------------------------------ */}
        {/* Hero / Studio                                                 */}
        {/* ------------------------------------------------------------ */}
        <section id="studio" className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
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
            <PromptConsole status={status} onGenerate={handleGenerate} />
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
                <motion.div key="error" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div className="mb-5">
                    <PipelineTimeline stages={stages} />
                  </div>
                  <ErrorPanel job={job} onRetry={handleRetry} />
                </motion.div>
              )}

              {scenario === "completed" && job && (
                <motion.div
                  key="result"
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-panel-hairline bg-panel/60 p-6 sm:p-9"
                >
                  <VideoResult job={job} onRegenerate={handleRegenerate} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Reel library                                                  */}
        {/* ------------------------------------------------------------ */}
        <section id="library" className="border-t border-panel-hairline px-5 py-16 sm:px-8 sm:py-20">
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
                {scenario === "loading"
                  ? "Loading…"
                  : `${galleryReels.length} reel${galleryReels.length === 1 ? "" : "s"}`}
              </span>
            </div>

            {scenario === "loading" ? (
              <GallerySkeleton />
            ) : (
              <ReelGallery reels={galleryReels} />
            )}
          </div>
        </section>
      </main>

      <Footer />

      <DemoDock scenario={scenario} onChange={handleScenarioChange} />
    </>
  );
}
