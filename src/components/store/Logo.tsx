import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="inline-flex min-w-0 items-center"
      aria-label="Clube Bolsonaro — início"
    >
      <img
        src="/brand/clube-bolsonaro.png"
        alt="Clube Bolsonaro"
        className={cn(
          "w-auto object-contain object-left",
          compact ? "h-8" : "h-9 sm:h-11",
        )}
      />
    </Link>
  );
}
