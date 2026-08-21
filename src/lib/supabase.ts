import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string | undefined {
  const fromVite = import.meta.env[name];
  if (fromVite) return fromVite;
  if (typeof process !== "undefined") return process.env[name];
  return undefined;
}

export function getSupabaseConfig() {
  const url = readEnv("VITE_SUPABASE_URL")?.trim();
  const anonKey = readEnv("VITE_SUPABASE_ANON_KEY")?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

let browserClient: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;

  if (typeof window === "undefined") {
    return createClient(config.url, config.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  if (browserClient === undefined) {
    browserClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storage: {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        },
      },
    });
  }

  return browserClient;
}
