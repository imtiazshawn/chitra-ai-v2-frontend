import {
  GenerateResponse,
  HistoryResponse,
  JobStatusResponse,
  QuotaResponse,
  UserProfile,
} from "./types";
import { getSupabaseClientOrNull } from "./supabase";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status?: number;
  /** Structured detail from 402 responses */
  detail?: Record<string, unknown>;
  constructor(message: string, status?: number, detail?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

/** Retrieve the current Supabase access token, or null if not signed in. */
async function getAccessToken(): Promise<string | null> {
  const client = getSupabaseClientOrNull();
  if (!client) return null;
  const { data: { session } } = await client.auth.getSession();
  return session?.access_token ?? null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      ...init,
      headers,
    });
  } catch {
    throw new ApiError(
      `Couldn't reach the ChitraAI API at ${API_BASE_URL}. Is the backend running?`
    );
  }

  if (!res.ok) {
    let detail: Record<string, unknown> | undefined;
    let message = "";
    try {
      const body = await res.json();
      if (typeof body?.detail === "object" && body.detail !== null) {
        detail = body.detail as Record<string, unknown>;
        // Both quota_exceeded (free) and no_tokens (pro) surface as 402
        const code = detail.code as string | undefined;
        if (code === "quota_exceeded" || code === "no_tokens") {
          throw new ApiError(detail.message as string, res.status, detail);
        }
      }
      message = (typeof body?.detail === "string" ? body.detail : null)
        ?? body?.message
        ?? "";
    } catch (inner) {
      if (inner instanceof ApiError) throw inner;
    }
    throw new ApiError(
      message || `Request to ${path} failed (${res.status})`,
      res.status,
      detail,
    );
  }

  return res.json() as Promise<T>;
}

/** POST /generate — kick off a new reel job for a topic. */
export function generateReel(topic: string): Promise<GenerateResponse> {
  return request<GenerateResponse>("/generate", {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}

/** GET /jobs/{jobId} — poll the status of a running job. */
export function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  return request<JobStatusResponse>(`/jobs/${jobId}`);
}

/** GET /history — list previously completed reels for the current user. */
export function getHistory(): Promise<HistoryResponse> {
  return request<HistoryResponse>("/history");
}

/** GET /me — current user's plan, quota, and token balance. */
export function getMe(): Promise<UserProfile> {
  return request<UserProfile>("/me");
}

/** GET /quota — lightweight quota check (free plan only). */
export function getQuota(): Promise<QuotaResponse> {
  return request<QuotaResponse>("/quota");
}
