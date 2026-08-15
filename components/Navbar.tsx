"use client";

import { Clapperboard, Film, LibraryBig } from "lucide-react";

const NAV_LINKS = [
  { label: "Studio", href: "#studio", icon: Clapperboard },
  { label: "Reel Library", href: "#library", icon: LibraryBig },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-panel-hairline bg-void/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-panel-hairline-strong bg-panel">
              <Film className="h-4 w-4 text-amber-400" strokeWidth={2.25} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ember-500 shadow-[0_0_8px_rgba(239,65,54,0.9)] animate-blink" />
            </span>
            <span className="font-display text-[17px] font-semibold tracking-tight text-ink">
              Chitra<span className="text-amber-400">AI</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-[12.5px] uppercase tracking-wider text-ink-dim transition-colors hover:bg-panel hover:text-ink"
              >
                <link.icon className="h-3.5 w-3.5" strokeWidth={2} />
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-panel-hairline-strong bg-panel px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(76,224,210,0.9)]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
                Render engine online
              </span>
            </div>
            <button className="rounded-md bg-amber-400 px-4 py-2 font-display text-[13px] font-semibold text-void transition-all hover:bg-amber-200 active:scale-[0.97]">
              New Reel
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
