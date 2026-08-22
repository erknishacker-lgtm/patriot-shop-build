import { Link, createFileRoute } from "@tanstack/react-router";
import { PolicyLayout, PolicySection } from "@/components/store/PolicyLayout";
import { useStore } from "@/hooks/use-store";
import { resolveStoreKey } from "@/lib/resolve-store-key";
import { STORES } from "@/lib/stores";

export const Route = createFileRoute("/privacidade")({
  loader: async () => ({ storeKey: await resolveStoreKey() }),
  head: ({ loaderData }) => {
    const store = STORES[loaderData?.storeKey ?? "patriot"];
    const title = `Privacidade | ${store.name}`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Como a ${store.name} trata dados e cookies.`,
        },
      ],
    };
  },
  component: PrivacidadePage,
});

function PrivacidadePage() {
  const store = useStore();
  return (
    <PolicyLayout kicker="Políticas" title="Política de privacidade">
      <p>
        Esta política descreve como a {store.name} trata dados neste site. O objetivo é operar a
        loja, cumprir a compra e proteger a operação contra uso indevido.
      </p>

      <PolicySection title="Quem trata os dados">
        <p>
          O responsável pelo site é a operação da {store.name} / Stampabr. Pagamento, antifraude e
          checkout ficam com o parceiro de pagamento (Yampi e meios como Pix e cartão). Hospedagem,
          e-mail e anúncios (incluindo Meta) são prestadores independentes. A loja não controla as
          políticas internas desses terceiros.
        </p>
      </PolicySection>

      <PolicySection title="O que coletamos">
        <p>Só o necessário para vender e atender:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>dados que você preenche no checkout (nome, contato, endereço, documento se o pagamento exigir);</li>
          <li>itens do carrinho, tamanho e valor, gravados neste aparelho;</li>
          <li>registros técnicos do acesso (IP, navegador, páginas), para segurança e medição;</li>
          <li>se você aceitar cookies de marketing, identificadores do Pixel da Meta para anúncios.</li>
        </ul>
        <p>
          Não pedimos senha de banco. Não vendemos lista de clientes. Não usamos dado de menor de 18
          anos de forma intencional: a loja é dirigida a adultos.
        </p>
      </PolicySection>

      <PolicySection title="Para que usamos">
        <ul className="list-disc space-y-1 pl-5">
          <li>separar, produzir, enviar e rastrear o pedido;</li>
          <li>prevenir fraude, abuso e chargeback;</li>
          <li>cumprir obrigação legal fiscal e de consumidor;</li>
          <li>com o seu aceite, medir campanhas e melhorar a loja.</li>
        </ul>
        <p>
          A recusa dos cookies de marketing não impede a compra. Sem os dados do checkout, o pedido
          não pode ser entregue.
        </p>
      </PolicySection>

      <PolicySection title="Cookies">
        <p>
          <strong className="text-foreground">Necessários:</strong> carrinho, escolha da loja e
          segurança do site. Sem eles a loja quebra.
        </p>
        <p>
          <strong className="text-foreground">Marketing (opcional):</strong> Pixel da Meta e
          semelhantes. Só entram depois de “Aceitar todos”. Você pode ficar só no necessário.
        </p>
      </PolicySection>

      <PolicySection title="Compartilhamento">
        <p>
          Dados seguem para quem executa a compra: checkout, meios de pagamento, Correios ou
          transportadora, impressão e estoque. Também podemos entregar informação se a lei, um
          processo ou uma disputa de pagamento exigir. A loja não se responsabiliza por falha,
          vazamento ou uso indevido ocorrido exclusivamente no ambiente do terceiro.
        </p>
      </PolicySection>

      <PolicySection title="Prazo e segurança">
        <p>
          Guardamos o que for preciso para o pedido, nota, garantia, fraude e obrigação legal. Não
          prometemos sistema infalível: adotamos medidas razoáveis e o visitante também deve proteger
          o próprio aparelho.
        </p>
      </PolicySection>

      <PolicySection title="Seus pedidos">
        <p>
          Para acessar, corrigir ou apagar dados que ainda estiver sob nosso controle, fale pelo
          canal de atendimento do pedido. Pedidos abusivos, genéricos ou que impeçam cumprir a lei
          podem ser recusados. Há mais detalhe em{" "}
          <Link to="/entrega-e-reembolso" className="font-semibold text-brand hover:underline">
            Entrega e reembolso
          </Link>
          .
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
