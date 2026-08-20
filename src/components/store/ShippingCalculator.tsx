import { useState } from "react";
import { Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShipping } from "@/hooks/use-shipping";
import { formatBRL, maskCep } from "@/lib/format";

export function ShippingCalculator() {
  const [cep, setCep] = useState("");
  const { loading, error, options, calculate } = useShipping();

  return (
    <section className="card-elevated p-4 sm:p-5" aria-labelledby="frete-titulo">
      <h2
        id="frete-titulo"
        className="flex items-center gap-2 text-sm font-semibold text-foreground"
      >
        <Truck className="size-4 text-brand" aria-hidden="true" />
        Simular Frete
      </h2>

      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void calculate(cep);
        }}
      >
        <label htmlFor="cep" className="sr-only">
          CEP
        </label>
        <Input
          id="cep"
          inputMode="numeric"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(maskCep(e.target.value))}
          className="h-11 flex-1"
        />
        <Button type="submit" variant="brand" size="lg" disabled={loading} className="sm:w-36">
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? "Calculando" : "Calcular"}
        </Button>
      </form>

      {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}

      {options && !loading && (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border animate-in fade-in slide-in-from-bottom-1">
          {options.map((option) => (
            <li key={option.id} className="flex items-center justify-between gap-3 px-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{option.name}</p>
                <p className="text-xs text-muted-foreground">{option.eta}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-brand">
                {formatBRL(option.price)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-muted-foreground">
        Valores simulados para demonstração. Prazos contam a partir da postagem.
      </p>
    </section>
  );
}
