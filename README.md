# ChitraAI — Frontend Template

A cinematic, dark-mode "creator studio" frontend for ChitraAI, an AI reel-generation
platform. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion,
and Lucide icons. No backend/API calls are wired up — this is UI only, with a demo
control dock so you can preview every state without a live pipeline.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> Note: `next/font/google` fetches Space Grotesk, Manrope, and JetBrains Mono at build
> time. This needs normal internet access to fonts.googleapis.com — if you're behind a
> restrictive proxy, swap the fonts in `app/layout.tsx` for `next/font/local` or a
> different Google font.

## What's in here

- `app/layout.tsx` — fonts + root shell
- `app/globals.css` — design tokens (`@theme`), film-grain/vignette textures, sprocket
  motifs, glass utility, keyframes
- `app/page.tsx` — assembles the studio page and simulates the generation pipeline
  client-side (setTimeout-driven) so the UI is fully interactive without a backend
- `components/Navbar.tsx` — top nav
- `components/PromptConsole.tsx` — hero input styled as a director's slate, with a
  typewriter placeholder cycling through sample prompts, voice/length chips, and the
  "Action — Generate Reel" trigger
- `components/PipelineTimeline.tsx` — **signature piece**: the live pipeline tracker,
  built as a film-strip editing timeline (sprocket rails, a moving playhead, waveform
  ticks on the active stage) instead of a plain progress bar
- `components/VideoResult.tsx` — 9:16 result player mock + Download / Copy Supabase URL
  / Regenerate actions
- `components/ErrorPanel.tsx` — diagnostic error state tied to the stage that failed,
  with a retry action
- `components/ReelGallery.tsx` — past-reels grid + empty state
- `components/GallerySkeleton.tsx` — loading skeleton for the library
- `components/DemoDock.tsx` — floating "preview monitor" to jump between every state
  (idle / processing / completed / error / loading / empty) for demoing the UI. Safe to
  delete once real data is wired in.
- `lib/types.ts`, `lib/mock-data.ts` — shared types + mock content for the demo

## Wiring up the real pipeline

Everything is written to swap cleanly:

1. Replace `runSimulation()` in `app/page.tsx` with real calls to your generation API,
   updating the same `stages` / `job` state shape as events come in (poll, SSE, or
   websocket all work — just call the same `setStages` / `setJob` setters).
2. Replace `PAST_REELS` in `lib/mock-data.ts` with a fetch from Supabase.
3. Remove `components/DemoDock.tsx` and its usage in `app/page.tsx` once you don't need
   manual state previews anymore.
