import { PipelineStage, ReelJob } from "./types";

export const SAMPLE_PROMPTS = [
  "Life is beautiful",
  "The purpose of life",
  "Why we procrastinate",
  "A short history of the ocean",
  "What silence teaches us",
  "The economics of attention",
];

export const INITIAL_STAGES: PipelineStage[] = [
  {
    key: "scripting",
    label: "Scripting",
    verb: "Writing the script",
    description: "Drafting a narration script from your prompt.",
    status: "pending",
    progress: 0,
  },
  {
    key: "audio",
    label: "Audio Generation",
    verb: "Recording the voiceover",
    description: "Synthesizing an AI voiceover from the script.",
    status: "pending",
    progress: 0,
  },
  {
    key: "captions",
    label: "Caption Syncing",
    verb: "Syncing captions",
    description: "Aligning on-screen captions to every word.",
    status: "pending",
    progress: 0,
  },
  {
    key: "assets",
    label: "Asset Fetching",
    verb: "Sourcing footage",
    description: "Pulling matching background clips for each line.",
    status: "pending",
    progress: 0,
  },
  {
    key: "rendering",
    label: "Video Rendering",
    verb: "Rendering the reel",
    description: "Cutting the final 9:16 edit and encoding it.",
    status: "pending",
    progress: 0,
  },
];

export const PAST_REELS: ReelJob[] = [
  {
    id: "reel_9f3a",
    prompt: "The purpose of life",
    status: "completed",
    createdAt: "2026-08-12T09:14:00Z",
    durationSeconds: 42,
    supabaseUrl: "https://xzkq-storage.supabase.co/storage/v1/object/public/reels/reel_9f3a.mp4",
    thumbnailGradient: "from-amber-500/40 via-ember-500/30 to-void",
  },
  {
    id: "reel_2b7c",
    prompt: "Why we fear silence",
    status: "completed",
    createdAt: "2026-08-11T18:02:00Z",
    durationSeconds: 38,
    supabaseUrl: "https://xzkq-storage.supabase.co/storage/v1/object/public/reels/reel_2b7c.mp4",
    thumbnailGradient: "from-cyan-500/40 via-panel-hi to-void",
  },
  {
    id: "reel_e01d",
    prompt: "Small habits, big change",
    status: "completed",
    createdAt: "2026-08-10T07:45:00Z",
    durationSeconds: 51,
    supabaseUrl: "https://xzkq-storage.supabase.co/storage/v1/object/public/reels/reel_e01d.mp4",
    thumbnailGradient: "from-amber-400/30 via-cyan-500/20 to-void",
  },
  {
    id: "reel_88f1",
    prompt: "The last library on earth",
    status: "error",
    createdAt: "2026-08-09T21:30:00Z",
    errorMessage: "Asset fetch timed out — no footage matched 3 script lines.",
    errorStage: "assets",
  },
];
