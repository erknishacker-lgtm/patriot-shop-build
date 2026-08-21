import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { storeFromHost, type StoreKey } from "@/lib/stores";

export const resolveStoreKey = createIsomorphicFn()
  .client((): StoreKey =>
    storeFromHost(window.location.hostname, window.location.search, document.cookie),
  )
  .server((): StoreKey => {
    const req = getRequest();
    const url = new URL(req.url);
    return storeFromHost(url.hostname, url.search, req.headers.get("cookie"));
  });
