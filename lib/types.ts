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

/** User plan tiers */
export type UserPlan = "free" | "pro";

export interface GenerateRequest {
  topic: string;
}

export interface GenerateResponse {
  job_id: string;
  status: BackendStatus;
  quota_used: number;
  quota_limit: number;
}

export interface QuotaResponse {
  used: number;
  limit: number;
  remaining: number;
  resets_at: string;
}

/**
 * Full user profile returned by GET /me.
 * Free users consume monthly quota.
 * Pro users consume token_balance (purchased credits).
 */
export interface UserProfile {
  user_id: string;
  email: string | null;
  plan: UserPlan;
  /** Monthly videos used (free plan) */
  quota_used: number;
  /** Monthly video limit (free plan) */
  quota_limit: number;
  /** Remaining monthly videos (free plan) */
  quota_remaining: number;
  /** ISO datetime when free quota resets */
  quota_resets_at: string;
  /** Purchased token balance — only meaningful on pro plan */
  token_balance: number;
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