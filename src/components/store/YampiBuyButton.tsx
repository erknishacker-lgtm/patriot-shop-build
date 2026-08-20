import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://api.yampi.io/v2/camisetas2026/public/buy-button/1GVCGDOZY8/js";

export function YampiBuyButton({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Evita duplicar o script em re-renders / navegação
    if (container.querySelector("script.ymp-script")) return;

    const script = document.createElement("script");
    script.className = "ymp-script";
    script.src = SCRIPT_SRC;
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
