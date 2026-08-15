"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonitorPlay, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { HeroScenario } from "@/hooks/useReelGeneration";

const SCENARIOS: { key: HeroScenario; label: string }[] = [
  { key: "idle", label: "Idle" },
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Completed" },
  { key: "error", label: "Error" },
];

export function DemoDock({
  scenario,
  onChange,
}: {
  scenario: HeroScenario;
  onChange: (s: HeroScenario) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass mb-3 w-60 rounded-xl border border-panel-hairline-strong p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
                <MonitorPlay className="h-3 w-3" />
                Preview monitor
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-faint hover:text-ink"
                aria-label="Close preview monitor"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SCENARIOS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => onChange(s.key)}
                  className={cn(
                    "rounded-md border px-2.5 py-2 text-left font-mono text-[10.5px] transition-colors",
                    scenario === s.key
                      ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                      : "border-panel-hairline bg-panel text-ink-dim hover:border-panel-hairline-strong hover:text-ink"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[10.5px] leading-snug text-ink-faint">
              Jumps the hero panel to a state without calling the API. The
              reel library below is always live.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-panel-hairline-strong bg-panel-hi text-amber-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] hover:bg-panel"
          aria-label="Open preview monitor"
        >
          <MonitorPlay className="h-4.5 w-4.5" />
        </motion.button>
      )}
    </div>
  );
}