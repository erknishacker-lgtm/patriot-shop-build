import { useCallback, useState } from "react";
import { onlyDigits } from "@/lib/format";
import { quoteShipping } from "@/lib/shipping.functions";

export type ShippingOption = {
  id: string;
  name: string;
  eta: string;
  price: number;
};

export function useShipping() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ShippingOption[] | null>(null);

  const calculate = useCallback(async (rawCep: string) => {
    const cep = onlyDigits(rawCep);
    if (cep.length !== 8) {
      setError("Digite um CEP válido com 8 dígitos.");
      setOptions(null);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await quoteShipping({ data: { cep } });
      if (!result.options || result.options.length === 0) {
        setError("Não encontramos opções de entrega para este CEP.");
        setOptions(null);
      } else {
        setOptions(result.options);
      }
    } catch {
      setError("Não foi possível calcular o frete agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, options, calculate };
}
