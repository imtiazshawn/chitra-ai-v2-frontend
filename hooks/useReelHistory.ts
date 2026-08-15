import { useCallback, useEffect, useState } from "react";
import { getHistory, ApiError } from "@/lib/api";
import { ReelJob } from "@/lib/types";

export type GalleryStatus = "loading" | "ready" | "error";

const THUMBNAIL_GRADIENTS = [
  "from-amber-500/40 via-ember-500/30 to-void",
  "from-cyan-500/40 via-panel-hi to-void",
  "from-amber-400/30 via-cyan-500/20 to-void",
];

export function useReelHistory() {
  const [reels, setReels] = useState<ReelJob[]>([]);
  const [status, setStatus] = useState<GalleryStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const { items } = await getHistory();
      setReels(
        items.map((item, i) => ({
          id: item.id,
          prompt: item.topic,
          status: "completed" as const,
          createdAt: item.created_at,
          supabaseUrl: item.video_url,
          thumbnailGradient: THUMBNAIL_GRADIENTS[i % THUMBNAIL_GRADIENTS.length],
        }))
      );
      setStatus("ready");
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : "Couldn't load your reel library."
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const prepend = (job: ReelJob) => {
    setReels((prev) => [
      { ...job, thumbnailGradient: THUMBNAIL_GRADIENTS[0] },
      ...prev.filter((r) => r.id !== job.id),
    ]);
  };

  return { reels, status, errorMessage, reload: load, prepend };
}