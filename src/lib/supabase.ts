import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Chave pública (publishable). Pode ir no site; o cadeado do banco (RLS) que protege. */
const PUBLIC_SUPABASE_URL = "https://jycmajdulenpuotzecch.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_ll9MQUrsrTTopTokKuk9ag_O9Sky5uL";

function readEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string | undefined {
  const fromVite = import.meta.env[name];
  if (fromVite) return fromVite;
  if (typeof process !== "undefined") return process.env[name];
  return undefined;
}

export function getSupabaseConfig() {
  const url = readEnv("VITE_SUPABASE_URL")?.trim() || PUBLIC_SUPABASE_URL;
  const anonKey = readEnv("VITE_SUPABASE_ANON_KEY")?.trim() || PUBLIC_SUPABASE_ANON_KEY;
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
