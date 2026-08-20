import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
  label?: string;
};

export function QuantitySelector({ value, onChange, size = "md", label = "Quantidade" }: Props) {
  const dimension = size === "sm" ? "size-8" : "size-11";
  return (
    <div className="inline-flex items-center rounded-xl border border-border bg-card p-1">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className={cn(
          "grid place-items-center rounded-lg transition-colors hover:bg-brand-soft disabled:opacity-40",
          dimension,
        )}
      >
        <Minus className="size-4" />
      </button>
      <span
        aria-live="polite"
        aria-label={`${label}: ${value}`}
        className={cn("min-w-10 text-center font-semibold", size === "sm" && "min-w-8 text-sm")}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => onChange(value + 1)}
        className={cn(
          "grid place-items-center rounded-lg transition-colors hover:bg-brand-soft",
          dimension,
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
