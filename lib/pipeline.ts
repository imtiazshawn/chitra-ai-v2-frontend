import { INITIAL_STAGES } from "./mock-data";
import { PipelineStage, StageKey } from "./types";

const STAGE_ORDER: StageKey[] = [
  "scripting",
  "audio",
  "captions",
  "assets",
  "rendering",
];

function normalize(status: string) {
  return status.toUpperCase();
}

export function statusToStageKey(status: string): StageKey | null {
  const s = normalize(status);
  if (s.includes("SCRIPT")) return "scripting";
  if (s.includes("AUDIO") || s.includes("VOICE")) return "audio";
  if (s.includes("CAPTION")) return "captions";
  if (s.includes("ASSET") || s.includes("FOOTAGE") || s.includes("CLIP")) return "assets";
  if (s.includes("RENDER")) return "rendering";
  return null;
}

export function isQueuedStatus(status: string) {
  const s = normalize(status);
  return s.includes("QUEUE") || s.includes("PENDING");
}

export function isCompletedStatus(status: string) {
  const s = normalize(status);
  return s === "COMPLETED" || s === "COMPLETE" || s === "DONE" || s === "SUCCESS";
}

export function isFailedStatus(status: string) {
  const s = normalize(status);
  return s === "FAILED" || s === "ERROR";
}

export function buildStagesFromJob(params: {
  status: string;
  progress: number;
  lastActiveStatus: string | null;
}): PipelineStage[] {
  const { status, progress, lastActiveStatus } = params;
  const fresh: PipelineStage[] = INITIAL_STAGES.map((s) => ({ ...s }));

  if (isCompletedStatus(status)) {
    return fresh.map((s) => ({ ...s, status: "done", progress: 100 }));
  }

  if (isFailedStatus(status)) {
    const failedKey = statusToStageKey(lastActiveStatus ?? "") ?? "scripting";
    const failedIndex = STAGE_ORDER.indexOf(failedKey);
    return fresh.map((s, i) => {
      if (i < failedIndex) return { ...s, status: "done", progress: 100 };
      if (i === failedIndex)
        return { ...s, status: "error", progress: Math.max(progress, 8) };
      return s;
    });
  }

  const activeKey = statusToStageKey(status);
  if (!activeKey) {
    return fresh;
  }

  const activeIndex = STAGE_ORDER.indexOf(activeKey);
  return fresh.map((s, i) => {
    if (i < activeIndex) return { ...s, status: "done", progress: 100 };
    if (i === activeIndex) return { ...s, status: "active", progress };
    return s;
  });
}