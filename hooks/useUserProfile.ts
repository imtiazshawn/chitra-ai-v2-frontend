import { useCallback, useEffect, useState } from "react";
import { getMe, ApiError } from "@/lib/api";
import { UserProfile } from "@/lib/types";

export interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
}

/**
 * Fetches GET /me whenever `authenticated` flips to true.
 * Returns the full UserProfile (plan, quota, token_balance).
 * Silently clears on sign-out.
 */
export function useUserProfile(authenticated: boolean) {
  const [state, setState] = useState<UserProfileState>({
    profile: null,
    loading: false,
  });

  const refresh = useCallback(async () => {
    if (!authenticated) {
      setState({ profile: null, loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    try {
      const profile = await getMe();
      setState({ profile, loading: false });
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) {
        console.warn("Could not fetch user profile:", err);
      }
      setState({ profile: null, loading: false });
    }
  }, [authenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refreshProfile: refresh };
}
