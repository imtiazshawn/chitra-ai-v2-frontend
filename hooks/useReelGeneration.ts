import { useRef, useState } from "react";
import { generateReel, getJobStatus, ApiError } from "@/lib/api";
import { buildStagesFromJob, isCompletedStatus, isFailedStatus, isQueuedStatus } from "@/lib/pipeline";
import { INITIAL_STAGES } from "@/lib/mock-data";
import { PipelineStage, ReelJob } from "@/lib/types";

const POLL_INTERVAL_MS = 1500;

export type HeroScenario = "idle" | "processing" | "completed" | "error";

interface UseReelGenerationOptions {
  /** Called once a job completes, so the caller can prepend it to the gallery. */
  onCompleted?: (job: ReelJob) => void;
}

export function useReelGeneration({ onCompleted }: UseReelGenerationOptions = {}) {
  const [scenario, setScenario] = useState<HeroScenario>("idle");
  const [stages, setStages] = useState<PipelineStage[]>(
    INITIAL_STAGES.map((s) => ({ ...s }))
  );
  const [job, setJob] = useState<ReelJob | null>(null);
  const [activeTopic, setActiveTopic] = useState("");

  const runId = useRef(0);
  const lastActiveStatus = useRef<string | null>(null);

  const resetToIdle = () => {
    runId.current += 1;
    setScenario("idle");
    setStages(INITIAL_STAGES.map((s) => ({ ...s })));
    setJob(null);
  };

  const poll = async (jobId: string, topic: string, myRun: number) => {
    if (runId.current !== myRun) return;

    try {
      const snapshot = await getJobStatus(jobId);

      if (runId.current !== myRun) return;

      if (!isQueuedStatus(snapshot.status) && !isFailedStatus(snapshot.status)) {
        lastActiveStatus.current = snapshot.status;
      }

      setStages(
        buildStagesFromJob({
          status: snapshot.status,
          progress: snapshot.progress,
          lastActiveStatus: lastActiveStatus.current,
        })
      );

      if (isCompletedStatus(snapshot.status)) {
        const completedJob: ReelJob = {
          id: snapshot.job_id,
          prompt: snapshot.topic || topic,
          status: "completed",
          createdAt: new Date().toISOString(),
          supabaseUrl: snapshot.video_url ?? undefined,
        };
        setJob(completedJob);
        setScenario("completed");
        onCompleted?.(completedJob);
        return;
      }

      if (isFailedStatus(snapshot.status)) {
        setJob({
          id: snapshot.job_id,
          prompt: snapshot.topic || topic,
          status: "error",
          createdAt: new Date().toISOString(),
          errorMessage:
            snapshot.error_message ?? "The pipeline hit an unexpected error.",
          errorStage:
            buildStagesFromJob({
              status: snapshot.status,
              progress: snapshot.progress,
              lastActiveStatus: lastActiveStatus.current,
            }).find((s) => s.status === "error")?.key ?? "scripting",
        });
        setScenario("error");
        return;
      }

      setTimeout(() => poll(jobId, topic, myRun), POLL_INTERVAL_MS);
    } catch (err) {
      if (runId.current !== myRun) return;
      setJob({
        id: jobId,
        prompt: topic,
        status: "error",
        createdAt: new Date().toISOString(),
        errorMessage:
          err instanceof ApiError
            ? err.message
            : "Lost connection to the ChitraAI API while checking job status.",
      });
      setScenario("error");
    }
  };

  const generate = async (topic: string) => {
    const myRun = ++runId.current;
    lastActiveStatus.current = null;
    setActiveTopic(topic);
    setJob(null);
    setScenario("processing");
    setStages(INITIAL_STAGES.map((s) => ({ ...s })));

    try {
      const { job_id } = await generateReel(topic);
      if (runId.current !== myRun) return;
      poll(job_id, topic, myRun);
    } catch (err) {
      if (runId.current !== myRun) return;
      setJob({
        id: "unknown",
        prompt: topic,
        status: "error",
        createdAt: new Date().toISOString(),
        errorMessage:
          err instanceof ApiError
            ? err.message
            : "Couldn't start the job. Check that the API is running.",
      });
      setScenario("error");
    }
  };

  const regenerate = () => {
    if (activeTopic) generate(activeTopic);
  };

  const preview = (next: HeroScenario) => {
    runId.current += 1;
    setScenario(next);

    if (next === "idle") {
      setStages(INITIAL_STAGES.map((s) => ({ ...s })));
      setJob(null);
    } else if (next === "processing") {
      setStages(
        buildStagesFromJob({ status: "AUDIO", progress: 55, lastActiveStatus: "AUDIO" })
      );
      setJob(null);
    } else if (next === "completed") {
      setStages(INITIAL_STAGES.map((s) => ({ ...s, status: "done", progress: 100 })));
      setJob({
        id: "preview_completed",
        prompt: activeTopic || "Life is beautiful",
        status: "completed",
        createdAt: new Date().toISOString(),
        supabaseUrl:
          "https://dsraidmozhvbkfpwbxqd.supabase.co/storage/v1/object/public/chitra-ai-generated-reels/sample.mp4",
      });
    } else if (next === "error") {
      setStages(
        buildStagesFromJob({ status: "FAILED", progress: 62, lastActiveStatus: "ASSETS" })
      );
      setJob({
        id: "preview_error",
        prompt: activeTopic || "The last library on earth",
        status: "error",
        createdAt: new Date().toISOString(),
        errorMessage: "Asset fetch timed out — no footage matched 3 script lines.",
        errorStage: "assets",
      });
    }
  };

  return { scenario, stages, job, activeTopic, generate, regenerate, resetToIdle, preview };
}