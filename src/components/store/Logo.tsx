import { Link } from "@tanstack/react-router";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export function Logo({ compact = false }: { compact?: boolean }) {
  const store = useStore();
  return (
    <Link to="/" className="inline-flex min-w-0 items-center" aria-label={`${store.name} — início`}>
      <img
        src={store.logoSrc}
        alt={store.name}
        className={cn(
          "w-auto object-contain object-left",
          compact ? "h-8" : "h-9 sm:h-11",
        )}
      />
    </Link>
  );
}
