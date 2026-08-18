import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClientOrNull, isSupabaseConfigured } from "@/lib/supabase";

export interface AuthState {
  user: User | null;
  session: Session | null;
  /** true while the initial session check is in flight */
  loading: boolean;
  /** true when Supabase env vars are not set */
  unconfigured: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: isSupabaseConfigured, // only show spinner if we can actually load
    unconfigured: !isSupabaseConfigured,
  });

  useEffect(() => {
    const client = getSupabaseClientOrNull();
    if (!client) return; // no-op when keys are missing

    // Hydrate from existing session on mount
    client.auth.getSession().then(({ data: { session } }) => {
      setState((s) => ({
        ...s,
        user: session?.user ?? null,
        session,
        loading: false,
      }));
    });

    // Keep in sync with Supabase auth state changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({
        ...s,
        user: session?.user ?? null,
        session,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = getSupabaseClientOrNull();
    if (!client) throw new Error("Auth is not configured on this server.");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const client = getSupabaseClientOrNull();
    if (!client) throw new Error("Auth is not configured on this server.");
    const { error } = await client.auth.signUp({ email, password });
    if (error) throw error;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const client = getSupabaseClientOrNull();
    if (!client) throw new Error("Auth is not configured on this server.");
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabaseClientOrNull();
    if (!client) return;
    await client.auth.signOut();
  }, []);

  return { ...state, signIn, signUp, signInWithGoogle, signOut };
}
