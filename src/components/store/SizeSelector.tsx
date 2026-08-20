import type { ProductSize } from "@/data/product";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  sizes: ProductSize[];
  selected: string | null;
  onSelect: (size: string) => void;
  error?: boolean;
};

export function SizeSelector({ sizes, selected, onSelect, error }: Props) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-foreground">Selecione a Opção</legend>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {sizes.map((size) => {
          const isSelected = selected === size.label;
          return (
            <button
              key={size.label}
              type="button"
              disabled={!size.available}
              aria-pressed={isSelected}
              onClick={() => onSelect(size.label)}
              className={cn(
                "flex h-16 flex-col items-center justify-center rounded-xl border-2 px-1 text-sm font-semibold transition-all duration-200",
                isSelected
                  ? "border-brand bg-brand text-primary-foreground shadow-[var(--shadow-card)]"
                  : "border-border bg-card text-foreground hover:border-brand/50 hover:bg-brand-soft/50",
                !size.available && "cursor-not-allowed opacity-40",
                error && !selected && "border-destructive/50",
              )}
            >
              <span>{size.label}</span>
              {size.extra > 0 && (
                <span
                  className={cn(
                    "mt-0.5 text-[10px] font-medium",
                    isSelected ? "text-gold" : "text-muted-foreground",
                  )}
                >
                  + {formatBRL(size.extra)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {error && !selected && (
        <p className="mt-2 text-xs font-medium text-destructive">
          Escolha um tamanho para continuar.
        </p>
      )}
    </fieldset>
  );
}
