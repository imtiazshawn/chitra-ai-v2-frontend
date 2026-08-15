"use client";

import { motion } from "framer-motion";
import { Clapperboard, Play, TriangleAlert } from "lucide-react";
import { ReelJob } from "@/lib/types";
import { cn } from "@/lib/cn";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function ReelGallery({ reels }: { reels: ReelJob[] }) {
  if (reels.length === 0) {
    return <EmptyGallery />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {reels.map((reel, i) => (
        <motion.div
          key={reel.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          className="group relative overflow-hidden rounded-xl border border-panel-hairline bg-panel"
        >
          <div
            className={cn(
              "relative aspect-9/16 bg-gradient-to-br",
              reel.thumbnailGradient ?? "from-panel-hi to-void"
            )}
          >
            <div className="grain-field !opacity-[0.06]" />
            {reel.status === "error" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/40 p-3 text-center">
                <TriangleAlert className="h-5 w-5 text-ember-400" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-ember-400">
                  Failed
                </span>
              </div>
            ) : (
              <button
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Play ${reel.prompt}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                  <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
                </span>
              </button>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5 pt-8">
              <p className="line-clamp-2 font-display text-[12.5px] font-semibold leading-tight text-white">
                {reel.prompt}
              </p>
              <div className="mt-1 flex items-center justify-between font-mono text-[9.5px] text-white/60">
                <span>{formatDate(reel.createdAt)}</span>
                {reel.durationSeconds && <span>{reel.durationSeconds}s</span>}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function EmptyGallery() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-panel-hairline-strong bg-panel/40 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-panel-hairline-strong bg-panel">
        <Clapperboard className="h-6 w-6 text-ink-faint" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">
        No reels cut yet
      </h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-dim">
        Every reel you generate lands here. Type a topic above and run your
        first take — it&apos;ll show up in this reel the moment it renders.
      </p>
    </div>
  );
}
