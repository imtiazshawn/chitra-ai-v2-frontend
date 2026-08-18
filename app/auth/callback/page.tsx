"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientOrNull } from "@/lib/supabase";

/**
 * OAuth callback page.
 *
 * After Google/GitHub sign-in, Supabase redirects here with a `code`
 * query param. The Supabase JS client detects it automatically when
 * getSession() is called, exchanges the code, stores the session in
 * localStorage, and then onAuthStateChange fires on every tab/component
 * that has an active listener.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const client = getSupabaseClientOrNull();
    if (!client) {
      router.replace("/");
      return;
    }

    // getSession() triggers the PKCE code exchange when a `code` param
    // is present in the URL — Supabase JS handles this automatically.
    client.auth.getSession().then(() => {
      router.replace("/");
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-void">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-panel-hairline border-t-amber-400" />
        <p className="font-mono text-[12px] uppercase tracking-wider text-ink-faint">
          Signing you in…
        </p>
      </div>
    </div>
  );
}
