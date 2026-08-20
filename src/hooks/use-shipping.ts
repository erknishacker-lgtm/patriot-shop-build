import { useCallback, useState } from "react";
import { onlyDigits } from "@/lib/format";

export type ShippingOption = {
  id: string;
  name: string;
  eta: string;
  price: number;
};

/**
 * Cálculo de frete em modo demonstração.
 * Substitua `mockQuote` por uma chamada real (Correios, Melhor Envio, etc.).
 */
async function mockQuote(cep: string): Promise<ShippingOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const far = Number(cep.slice(0, 1)) >= 6 ? 2 : 0;
  return [
    {
      id: "padrao",
      name: "Entrega padrão",
      eta: `${8 + far} a ${13 + far} dias úteis`,
      price: 0,
    },
    {
      id: "expressa",
      name: "Entrega expressa",
      eta: `${5 + far} a ${9 + far} dias úteis`,
      price: 19.9,
    },
  ];
}

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
      setOptions(await mockQuote(cep));
    } catch {
      setError("Não foi possível calcular o frete agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, options, calculate };
}
