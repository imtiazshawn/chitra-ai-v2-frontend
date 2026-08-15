"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Captions,
  Check,
  Copy,
  Download,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { ReelJob } from "@/lib/types";
import { cn } from "@/lib/cn";

const CAPTION_LINES = [
  "life is beautiful,",
  "not because it's easy —",
  "but because it ends.",
];

export function VideoResult({
  job,
  onRegenerate,
}: {
  job: ReelJob;
  onRegenerate: () => void;
}) {
  const [playing, setPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!job.supabaseUrl) return;
    try {
      await navigator.clipboard.writeText(job.supabaseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — silently ignore in this demo */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-center"
    >
      {/* Vertical player mock */}
      <div className="mx-auto w-full max-w-[280px]">
        <div className="relative aspect-9/16 overflow-hidden rounded-[28px] border border-panel-hairline-strong bg-black shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
          {/* mock footage layers */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/50 via-void to-cyan-900/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,176,32,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_80%,rgba(76,224,210,0.2),transparent_55%)]" />
          <div className="grain-field !opacity-[0.08]" />

          {/* top bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <span className="rounded-full bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/70 backdrop-blur-sm">
              ChitraAI
            </span>
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 font-mono text-[9px] text-white/70 backdrop-blur-sm">
              <Volume2 className="h-2.5 w-2.5" /> On
            </span>
          </div>

          {/* caption overlay */}
          <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-1 px-6 text-center">
            {CAPTION_LINES.map((line, i) => (
              <span
                key={line}
                className={cn(
                  "font-display text-[15px] font-bold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]",
                  i === 1 ? "text-amber-300" : "text-white"
                )}
              >
                {line}
              </span>
            ))}
          </div>

          {/* scrub bar */}
          <div className="absolute inset-x-3 bottom-4">
            <div className="mb-2 h-[3px] w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-[38%] rounded-full bg-amber-400" />
            </div>
            <div className="flex items-center justify-between font-mono text-[9px] text-white/60">
              <span>00:16</span>
              <span>
                {job.durationSeconds
                  ? `00:${String(job.durationSeconds).padStart(2, "0")}`
                  : "00:42"}
              </span>
            </div>
          </div>

          {/* play toggle */}
          <button
            onClick={() => setPlaying((p) => !p)}
            className="absolute inset-0 flex items-center justify-center transition-opacity hover:bg-black/10"
            aria-label={playing ? "Pause preview" : "Play preview"}
          >
            {!playing && (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
              </span>
            )}
          </button>

          {playing && (
            <button
              onClick={() => setPlaying(false)}
              className="absolute right-3 top-11 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm"
              aria-label="Pause preview"
            >
              <Pause className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10.5px] text-ink-faint">
          <Captions className="h-3 w-3" />
          Captions synced · 9:16 · {job.durationSeconds ?? 42}s
        </div>
      </div>

      {/* Details + actions */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-amber-300">
          <Check className="h-3 w-3" /> Render complete
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
          &ldquo;{job.prompt}&rdquo;
        </h3>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-dim">
          Scripted, voiced, captioned, and cut in one automated take. Your reel
          is live in Supabase Storage and ready to share.
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-sm">
          <Stat label="Duration" value={`${job.durationSeconds ?? 42}s`} />
          <Stat label="Format" value="9:16 · MP4" />
          <Stat label="Captions" value="12 lines" />
        </dl>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={job.supabaseUrl}
            download
            className="group flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-semibold text-void transition-all hover:bg-amber-200 hover:shadow-[0_0_24px_2px_rgba(255,176,32,0.35)] active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Download Video
          </a>

          <button
            onClick={handleCopy}
            className="flex min-w-[196px] items-center justify-center gap-2 rounded-xl border border-panel-hairline-strong bg-panel px-5 py-3 font-display text-sm font-semibold text-ink transition-all hover:border-cyan-400/40 hover:text-cyan-300 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-cyan-300" />
                Copied URL
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Supabase URL
              </>
            )}
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 rounded-xl border border-panel-hairline-strong bg-transparent px-5 py-3 font-display text-sm font-semibold text-ink-dim transition-all hover:border-ember-500/40 hover:text-ember-400 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            Regenerate
          </button>
        </div>

        {job.supabaseUrl && (
          <p className="mt-4 truncate rounded-lg border border-panel-hairline bg-panel/60 px-3 py-2 font-mono text-[11px] text-ink-faint">
            {job.supabaseUrl}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-panel-hairline bg-panel/60 px-3 py-2.5">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        {label}
      </dt>
      <dd className="mt-0.5 font-display text-sm font-semibold text-ink">
        {value}
      </dd>
    </div>
  );
}
