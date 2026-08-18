import { useCallback, useEffect, useState } from "react";
import { getQuota, ApiError } from "@/lib/api";
import { QuotaResponse } from "@/lib/types";

export interface QuotaState {
  quota: QuotaResponse | null;
  loading: boolean;
}

export function useQuota(authenticated: boolean) {
  const [state, setQuotaState] = useState<QuotaState>({ quota: null, loading: false });

  const refresh = useCallback(async () => {
    if (!authenticated) {
      setQuotaState({ quota: null, loading: false });
      return;
    }
    setQuotaState((s) => ({ ...s, loading: true }));
    try {
      const q = await getQuota();
      setQuotaState({ quota: q, loading: false });
    } catch (err) {
      // Non-fatal — just leave quota as null
      if (!(err instanceof ApiError && err.status === 401)) {
        console.warn("Could not fetch quota:", err);
      }
      setQuotaState({ quota: null, loading: false });
    }
  }, [authenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refreshQuota: refresh };
}
