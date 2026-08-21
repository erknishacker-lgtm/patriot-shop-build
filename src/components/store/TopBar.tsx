import { useEffect, useState } from "react";
import { BadgePercent, ShieldCheck, TrendingUp, Truck, type LucideIcon } from "lucide-react";
import { useStore } from "@/hooks/use-store";

const ICONS: LucideIcon[] = [ShieldCheck, BadgePercent, TrendingUp, Truck];

export function TopBar() {
  const store = useStore();
  const [index, setIndex] = useState(0);
  const messages = store.topbar;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % Math.max(messages.length, 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const current = messages[index % Math.max(messages.length, 1)] ?? "";
  const Icon = ICONS[index % ICONS.length]!;

  return (
    <div className="bg-brand-deep text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center px-4 py-2.5 text-center">
        <p
          key={current}
          className="flex animate-fade-in items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground/80 sm:text-xs"
        >
          <Icon className="size-4 text-gold" aria-hidden="true" />
          {current}
        </p>
      </div>
    </div>
  );
}
