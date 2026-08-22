import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout, PolicySection } from "@/components/store/PolicyLayout";
import { useStore } from "@/hooks/use-store";
import { resolveStoreKey } from "@/lib/resolve-store-key";
import { STORES } from "@/lib/stores";

export const Route = createFileRoute("/entrega-e-reembolso")({
  loader: async () => ({ storeKey: await resolveStoreKey() }),
  head: ({ loaderData }) => {
    const store = STORES[loaderData?.storeKey ?? "patriot"];
    const title = `Entrega e reembolso | ${store.name}`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Prazos de envio, entrega e reembolso da ${store.name}.`,
        },
      ],
    };
  },
  component: EntregaReembolsoPage,
});

function EntregaReembolsoPage() {
  const store = useStore();
  return (
    <PolicyLayout kicker="Políticas" title="Entrega e reembolso">
      <p>
        Estas regras valem para compras feitas neste site da {store.name}. O pagamento é processado
        pelo checkout parceiro. A produção e o despacho ficam a cargo da operação da loja
        (Stampabr).
      </p>

      <PolicySection title="Envio">
        <p>
          Após a confirmação do pagamento, o pedido é separado e despachado em até{" "}
          <strong className="text-foreground">3 dias</strong> (úteis, salvo feriado ou recesso
          informado na loja).
        </p>
        <p>
          O prazo de transporte até o destino é de até{" "}
          <strong className="text-foreground">10 dias úteis</strong> depois do despacho, conforme a
          região e a transportadora ou Correios. Esse prazo é uma estimativa: atrasos da
          transportadora, endereço incompleto, ausência no local ou restrição de entrega não são
          responsabilidade da loja depois que o pedido saiu com o código de rastreio.
        </p>
        <p>
          O rastreio é enviado pelos canais da compra (e-mail, WhatsApp ou área do checkout) quando
          a etiqueta é gerada.
        </p>
      </PolicySection>

      <PolicySection title="Reembolso">
        <p>
          O pedido de reembolso pode ser feito em até{" "}
          <strong className="text-foreground">7 dias</strong> contados do recebimento da mercadoria.
        </p>
        <p>
          Para o valor ser devolvido, o produto precisa chegar de volta à companhia{" "}
          <strong className="text-foreground">nas mesmas condições em que foi entregue</strong>: sem
          uso, sem odor, com etiquetas, embalagem e acessórios originais, sem avarias causadas pelo
          cliente. Peça usada, lavada, customizada, rasgada ou incompleta não entra em reembolso.
        </p>
        <p>
          O reembolso só é liberado depois que a peça chega, é conferida e aprovada. O prazo de
          crédito segue o meio de pagamento (Pix, cartão ou outro usado na compra).
        </p>
        <p>
          O frete de devolução, quando o arrependimento é do cliente e o produto está em perfeito
          estado, fica a cargo de quem comprou, salvo defeito de fabricação ou erro nosso no envio.
        </p>
      </PolicySection>

      <PolicySection title="Como solicitar">
        <p>
          Entre em contato pelo canal de atendimento informado no checkout ou na embalagem, com o
          número do pedido, fotos da peça e da caixa. Sem essa conferência, a loja não inicia o
          reembolso.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
