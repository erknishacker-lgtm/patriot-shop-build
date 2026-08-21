import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

const PIXEL_ID = "1691017478623685";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: Window["fbq"];
  }
}

function ensurePixel() {
  if (typeof window === "undefined") return;
  if (window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      (fbq.queue ??= []).push(args);
    }
  } as NonNullable<Window["fbq"]>;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

export function MetaPixel() {
  const router = useRouter();

  useEffect(() => {
    ensurePixel();
  }, []);

  useEffect(() => {
    let skipFirst = true;
    return router.subscribe("onResolved", () => {
      if (skipFirst) {
        skipFirst = false;
        return;
      }
      window.fbq?.("track", "PageView");
    });
  }, [router]);

  return (
    <noscript>
      <img
        height={1}
        width={1}
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
