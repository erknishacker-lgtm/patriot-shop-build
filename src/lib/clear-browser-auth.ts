export function clearBrowserAuthJunk() {
  if (typeof window === "undefined") return;
  try {
    for (let i = window.localStorage.length - 1; i >= 0; i -= 1) {
      const key = window.localStorage.key(i);
      if (key && (key.startsWith("sb-") || key.toLowerCase().includes("supabase"))) {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // ignore quota / privacy mode
  }
}
