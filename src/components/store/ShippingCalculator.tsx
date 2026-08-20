import { useState } from "react";
import { Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShipping } from "@/hooks/use-shipping";
import { formatBRL, maskCep } from "@/lib/format";

type Props = {
  compact?: boolean;
};

export function ShippingCalculator({ compact }: Props) {
  const [cep, setCep] = useState("");
  const { loading, error, options, calculate } = useShipping();

  const Wrapper = compact ? "div" : "section";
  const wrapperClass = compact
    ? ""
    : "mx-auto max-w-[1200px] px-4 py-12";

  return (
    <Wrapper aria-labelledby="frete-titulo" className={wrapperClass}>
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <h2
              id="frete-titulo"
              className="flex items-center gap-2 font-display text-xl font-bold text-brand-deep sm:text-2xl"
            >
              <Truck className="size-5 text-brand" aria-hidden="true" />
              Calcule o prazo de entrega
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Informe seu CEP para ver as opções de envio disponíveis para a sua região.
            </p>

            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
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
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(maskCep(e.target.value))}
                className="h-12 flex-1"
              />
              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={loading}
                className="h-12 sm:w-36"
              >
                {loading ? <Loader2 className="animate-spin" /> : null}
                {loading ? "Calculando" : "Calcular"}
              </Button>
            </form>
            {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
          </div>

          <div>
            {options && !loading ? (
              <ul className="divide-y divide-border rounded-xl border border-border animate-in fade-in slide-in-from-bottom-1">
                {options.map((option) => (
                  <li
                    key={option.id}
                    className="flex items-center justify-between gap-3 px-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-deep">
                        {option.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{option.eta}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-brand">
                      {option.price === 0 ? "Grátis" : formatBRL(option.price)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground">
                As opções de entrega aparecem aqui após o cálculo.
              </div>
            )}
            <p className="mt-3 text-[11px] text-muted-foreground">
              Valores simulados para demonstração. Prazos contam a partir da postagem.
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
