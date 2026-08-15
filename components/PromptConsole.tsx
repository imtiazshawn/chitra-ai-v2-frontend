"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mic2, Ratio, Sparkles, Timer } from "lucide-react";
import { SAMPLE_PROMPTS } from "@/lib/mock-data";
import { GenerationStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const VOICE_OPTIONS = ["Warm Narrator", "Bright & Fast", "Documentary"];
const LENGTH_OPTIONS = ["30s", "45s", "60s"];

function useTypewriterPlaceholder(words: string[], active: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return;
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        setText(word.slice(0, charIndex));
        if (charIndex === word.length) {
          deleting = true;
          timeout = setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        setText(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      timeout = setTimeout(tick, deleting ? 28 : 55);
    };

    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, [words, active]);

  return text;
}

interface PromptConsoleProps {
  status: GenerationStatus;
  onGenerate: (prompt: string) => void;
}

export function PromptConsole({ status, onGenerate }: PromptConsoleProps) {
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState(VOICE_OPTIONS[0]);
  const [length, setLength] = useState(LENGTH_OPTIONS[1]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const placeholder = useTypewriterPlaceholder(SAMPLE_PROMPTS, !focused && prompt.length === 0);

  const busy = status === "queued" || status === "processing";

  const handleSubmit = () => {
    if (!prompt.trim() || busy) return;
    onGenerate(prompt.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-3xl"
    >
      {/* clapperboard stripe header */}
      <div
        className="flex h-8 items-stretch overflow-hidden rounded-t-2xl border border-b-0 border-panel-hairline-strong"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-32deg, #17171b 0 26px, #1f1a10 26px 30px, #17171b 30px 56px, #ffb020 56px 60px)",
        }}
        aria-hidden
      />

      <div
        className={cn(
          "glass rounded-b-2xl rounded-t-none border-t-0 p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] transition-shadow",
          focused && "shadow-[0_0_0_1px_rgba(255,176,32,0.4),0_30px_80px_-30px_rgba(0,0,0,0.9)]"
        )}
      >
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Scene 01 — Prompt
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-faint">
            <Sparkles className="h-3 w-3 text-amber-400" />
            auto-pipeline
          </span>
        </div>

        <div className="px-3 pb-1 pt-2">
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={2}
            disabled={busy}
            placeholder={placeholder || "Type a topic — try “Life is beautiful”"}
            className="w-full resize-none bg-transparent font-display text-2xl font-medium leading-snug text-ink placeholder:text-ink-faint focus:outline-none disabled:opacity-50 sm:text-[28px]"
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-panel-hairline px-3 pb-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <ChipSelect
              icon={Mic2}
              value={voice}
              options={VOICE_OPTIONS}
              onChange={setVoice}
            />
            <ChipSelect
              icon={Timer}
              value={length}
              options={LENGTH_OPTIONS}
              onChange={setLength}
            />
            <span className="flex items-center gap-1.5 rounded-full border border-panel-hairline bg-panel px-3 py-1.5 font-mono text-[11px] text-ink-dim">
              <Ratio className="h-3 w-3" />
              9:16
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || busy}
            className={cn(
              "group flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-display text-sm font-semibold transition-all",
              "disabled:cursor-not-allowed disabled:opacity-40",
              !busy &&
                "bg-amber-400 text-void hover:bg-amber-200 active:scale-[0.98] shadow-[0_0_0_0_rgba(255,176,32,0)] hover:shadow-[0_0_24px_2px_rgba(255,176,32,0.35)]",
              busy && "bg-panel-hi text-ink-dim"
            )}
          >
            {busy ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                Rolling…
              </>
            ) : (
              <>
                Action — Generate Reel
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ChipSelect({
  icon: Icon,
  value,
  options,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex items-center gap-1.5 rounded-full border border-panel-hairline bg-panel px-3 py-1.5 font-mono text-[11px] text-ink-dim transition-colors hover:border-panel-hairline-strong hover:text-ink">
      <Icon className="h-3 w-3" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-1 text-ink-dim outline-none hover:text-ink"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-panel-hi text-ink">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
