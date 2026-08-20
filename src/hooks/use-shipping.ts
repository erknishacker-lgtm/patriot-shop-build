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
  const factor = Number(cep.slice(-1)) / 10;
  return [
    { id: "pac", name: "PAC", eta: "7 a 10 dias úteis", price: 19.9 + factor },
    { id: "sedex", name: "SEDEX", eta: "3 a 5 dias úteis", price: 29.9 + factor },
    {
      id: "express",
      name: "Entrega expressa",
      eta: "1 a 2 dias úteis",
      price: 39.9 + factor,
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
