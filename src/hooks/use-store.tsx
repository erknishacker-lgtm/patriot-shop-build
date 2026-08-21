import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { persistStoreCookie, STORES, type StoreConfig, type StoreKey } from "@/lib/stores";

const StoreContext = createContext<StoreConfig>(STORES.patriot);

export function StoreProvider({
  children,
  initialKey = "patriot",
}: {
  children: ReactNode;
  initialKey?: StoreKey;
}) {
  useEffect(() => {
    persistStoreCookie(initialKey);
    document.documentElement.setAttribute("data-store", initialKey);
    const store = STORES[initialKey];
    document.title = store.title;
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) icon.href = store.favicon;
  }, [initialKey]);

  const value = useMemo(() => STORES[initialKey], [initialKey]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
