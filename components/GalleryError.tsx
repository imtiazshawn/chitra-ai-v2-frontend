import { RefreshCw, WifiOff } from "lucide-react";

export function GalleryError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-ember-500/25 bg-ember-900/15 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ember-500/40 bg-ember-500/10">
        <WifiOff className="h-6 w-6 text-ember-400" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">
        Couldn&apos;t load your library
      </h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-dim">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="mt-5 flex items-center gap-2 rounded-xl border border-panel-hairline-strong bg-panel px-4 py-2.5 font-display text-sm font-semibold text-ink transition-all hover:border-amber-400/40 hover:text-amber-300 active:scale-[0.98]"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}