import {
  GenerateResponse,
  HistoryResponse,
  JobStatusResponse,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError(
      `Couldn't reach the ChitraAI API at ${API_BASE_URL}. Is the backend running?`
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.detail ?? body?.message ?? "";
    } catch {
      /* response wasn't JSON — ignore */
    }
    throw new ApiError(
      detail || `Request to ${path} failed (${res.status})`,
      res.status
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

/** GET /history — list previously completed reels. */
export function getHistory(): Promise<HistoryResponse> {
  return request<HistoryResponse>("/history");
}