import { useEffect, useState } from "react";
import { BadgePercent, ShieldCheck, TrendingUp, Truck, type LucideIcon } from "lucide-react";

const messages: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: "Compra 100% segura" },
  { icon: BadgePercent, text: "Frete grátis acima de R$ 299" },
  { icon: TrendingUp, text: "Faça parte do movimento que mais cresce no Brasil" },
  { icon: Truck, text: "Envio para todo o Brasil" },
];

export function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const current = messages[index % messages.length] ?? messages[0];
  const Icon = current.icon;

  return (
    <div className="bg-brand-deep text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center px-4 py-2.5 text-center">
        <p
          key={current.text}
          className="flex animate-fade-in items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground/80 sm:text-xs"
        >
          <Icon className="size-4 text-gold" aria-hidden="true" />
          {current.text}
        </p>
      </div>
    </div>
  );
}
