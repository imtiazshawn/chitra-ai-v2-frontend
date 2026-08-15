export type StageKey =
  | "scripting"
  | "audio"
  | "captions"
  | "assets"
  | "rendering";

export type StageStatus = "pending" | "active" | "done" | "error";

export interface PipelineStage {
  key: StageKey;
  label: string;
  verb: string;
  description: string;
  status: StageStatus;
  /** 0–100, only meaningful while status === "active" */
  progress: number;
  etaSeconds?: number;
}

export type GenerationStatus =
  | "idle"
  | "queued"
  | "processing"
  | "completed"
  | "error";

export interface ReelJob {
  id: string;
  prompt: string;
  status: GenerationStatus;
  createdAt: string;
  durationSeconds?: number;
  supabaseUrl?: string;
  thumbnailGradient?: string;
  errorMessage?: string;
  errorStage?: StageKey;
}


export type BackendStatus = string;

export interface GenerateRequest {
  topic: string;
}

export interface GenerateResponse {
  job_id: string;
  status: BackendStatus;
}

export interface JobStatusResponse {
  job_id: string;
  topic: string;
  status: BackendStatus;
  progress: number;
  video_url: string | null;
  error_message: string | null;
}

export interface HistoryItem {
  id: string;
  topic: string;
  video_url: string;
  created_at: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
}