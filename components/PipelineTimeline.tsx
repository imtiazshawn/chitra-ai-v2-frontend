"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  Captions,
  Check,
  Clapperboard,
  Images,
  PenLine,
  TriangleAlert,
} from "lucide-react";
import { PipelineStage, StageKey } from "@/lib/types";
import { cn } from "@/lib/cn";

const STAGE_ICONS: Record<StageKey, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  scripting: PenLine,
  audio: AudioLines,
  captions: Captions,
  assets: Images,
  rendering: Clapperboard,
};

function overallProgress(stages: PipelineStage[]) {
  const weight = 100 / stages.length;
  return stages.reduce((acc, s) => {
    if (s.status === "done") return acc + weight;
    if (s.status === "active" || s.status === "error")
      return acc + (weight * s.progress) / 100;
    return acc;
  }, 0);
}

export function PipelineTimeline({ stages }: { stages: PipelineStage[] }) {
  const progress = overallProgress(stages);
  const erroredIndex = stages.findIndex((s) => s.status === "error");
  const activeStage = stages.find((s) => s.status === "active" || s.status === "error");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-panel-hairline bg-panel/70">
      <div className="sprocket-rail h-3" aria-hidden />

      <div className="px-5 pb-7 pt-5 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <h3 className="font-display text-base font-semibold text-ink">
              Live Pipeline
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {activeStage && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                {activeStage.status === "error" ? "Halted at" : "Now"} · {activeStage.verb}
              </span>
            )}
            <span className="rounded-full border border-panel-hairline-strong bg-panel-hi px-2.5 py-1 font-mono text-[11px] text-ink-dim">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Track */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-[19px] h-[3px] rounded-full bg-panel-hi" />
          <motion.div
            className={cn(
              "absolute left-0 top-[19px] h-[3px] rounded-full",
              erroredIndex >= 0
                ? "bg-gradient-to-r from-amber-400 to-ember-500"
                : "bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* playhead */}
          {progress > 0 && progress < 100 && (
            <motion.div
              className="absolute top-[6px] z-10 flex -translate-x-1/2 flex-col items-center"
              initial={{ left: 0 }}
              animate={{ left: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                className={cn(
                  "h-4 w-[2px] rounded-full",
                  erroredIndex >= 0 ? "bg-ember-400" : "bg-cyan-300"
                )}
              />
              <div
                className={cn(
                  "-mt-0.5 h-2 w-2 rounded-full shadow-[0_0_10px_2px]",
                  erroredIndex >= 0
                    ? "bg-ember-400 shadow-ember-500/70"
                    : "bg-cyan-300 shadow-cyan-400/70"
                )}
              />
            </motion.div>
          )}

          <div className="relative grid grid-cols-5 gap-2">
            {stages.map((stage) => (
              <StageNode key={stage.key} stage={stage} />
            ))}
          </div>
        </div>
      </div>

      <div className="sprocket-rail h-3" aria-hidden />
    </div>
  );
}

function StageNode({ stage }: { stage: PipelineStage }) {
  const Icon = STAGE_ICONS[stage.key];
  const isDone = stage.status === "done";
  const isActive = stage.status === "active";
  const isError = stage.status === "error";

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500",
          isDone && "border-amber-400 bg-amber-400/10 text-amber-300",
          isActive && "border-cyan-400 bg-cyan-400/10 text-cyan-300",
          isError && "border-ember-500 bg-ember-500/10 text-ember-400",
          stage.status === "pending" &&
            "border-panel-hairline-strong bg-panel text-ink-faint"
        )}
      >
        {isDone ? (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        ) : isError ? (
          <TriangleAlert className="h-4 w-4" strokeWidth={2.25} />
        ) : (
          <Icon className="h-4 w-4" strokeWidth={2.25} />
        )}
        {isActive && (
          <span className="absolute h-10 w-10 animate-ping rounded-full border border-cyan-400/50" />
        )}
      </div>

      <span
        className={cn(
          "mt-2.5 font-display text-[12.5px] font-semibold leading-tight sm:text-sm",
          isError ? "text-ember-400" : isActive ? "text-cyan-300" : isDone ? "text-ink" : "text-ink-faint"
        )}
      >
        {stage.label}
      </span>

      <span className="mt-1 hidden max-w-[120px] font-mono text-[10.5px] leading-snug text-ink-faint sm:block">
        {isError ? stage.description : stage.description}
      </span>

      {isActive && (
        <div className="mt-2 flex h-3 items-end gap-[2px]" aria-hidden>
          {[3, 8, 5, 11, 4, 9, 6].map((h, i) => (
            <motion.span
              key={i}
              className="w-[2px] rounded-full bg-cyan-400/80"
              animate={{ height: [h * 0.4, h, h * 0.5] }}
              transition={{
                duration: 0.9 + i * 0.07,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {isActive && (
        <span className="mt-1.5 font-mono text-[10px] text-cyan-400/80">
          {Math.round(stage.progress)}%
        </span>
      )}
    </div>
  );
}
