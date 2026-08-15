import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-panel-hairline">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:justify-between sm:px-8">
        <div className="flex items-center gap-2 text-ink-faint">
          <Film className="h-3.5 w-3.5" />
          <span className="font-mono text-[11px] uppercase tracking-wider">
            ChitraAI · automated reel studio
          </span>
        </div>
        <p className="font-mono text-[11px] text-ink-faint">
          Script → Voice → Captions → Footage → Render, in one take.
        </p>
      </div>
    </footer>
  );
}
