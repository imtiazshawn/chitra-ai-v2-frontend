"use client";

import { motion } from "framer-motion";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { ReelJob } from "@/lib/types";

const STAGE_LABEL: Record<string, string> = {
  scripting: "Scripting",
  audio: "Audio Generation",
  captions: "Caption Syncing",
  assets: "Asset Fetching",
  rendering: "Video Rendering",
};

export function ErrorPanel({
  job,
  onRetry,
}: {
  job: ReelJob;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-ember-500/30 bg-ember-900/20"
    >
      <div className="flex items-start gap-4 p-6 sm:p-7">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ember-500/40 bg-ember-500/10 text-ember-400">
          <TriangleAlert className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-display text-lg font-semibold text-ink">
              Render stopped
            </h3>
            {job.errorStage && (
              <span className="rounded-full border border-ember-500/40 bg-ember-500/10 px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-ember-400">
                {STAGE_LABEL[job.errorStage]}
              </span>
            )}
          </div>
          <p className="mt-1.5 max-w-lg text-[14.5px] leading-relaxed text-ink-dim">
            {job.errorMessage ??
              "The pipeline hit an unexpected error and couldn't finish this reel."}
          </p>

          <div className="mt-4 rounded-lg border border-panel-hairline bg-void/60 p-3 font-mono text-[11.5px] leading-relaxed text-ink-faint">
            <p>
              <span className="text-ember-400">error</span>{" "}
              stage=&quot;{job.errorStage}&quot; job=&quot;{job.id}&quot;
            </p>
            <p>reason: {job.errorMessage ?? "unknown_failure"}</p>
            <p>suggestion: retry, or rephrase the prompt for stronger footage matches.</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onRetry}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 font-display text-sm font-semibold text-void transition-all hover:bg-amber-200 active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              Retry from “{STAGE_LABEL[job.errorStage ?? "scripting"]}”
            </button>
            <a
              href="#studio"
              className="flex items-center gap-2 rounded-xl border border-panel-hairline-strong px-4 py-2.5 font-display text-sm font-semibold text-ink-dim transition-all hover:text-ink"
            >
              Edit prompt instead
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
