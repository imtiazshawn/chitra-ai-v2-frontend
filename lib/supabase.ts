import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Reject placeholder values from .env.example
export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  !supabaseUrl.includes("your-project-ref");

// Module-level singleton — one instance for the entire browser session.
// Declared outside any function so it is truly created once per module load,
// which prevents the "Multiple GoTrueClient instances" warning.
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file."
    );
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Tells the client to look for a `code` param in the URL on load
        // and automatically exchange it for a session (PKCE flow).
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }
  return _client;
}

/**
 * Returns the Supabase client, or null if not configured.
 * Use this everywhere so the app degrades gracefully when keys are missing.
 */
export function getSupabaseClientOrNull(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return getSupabaseClient();
}
