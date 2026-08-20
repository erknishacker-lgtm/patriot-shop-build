# Sincronizar tamanho e quantidade com o carrinho e o checkout

Objetivo: o que o cliente escolhe na página (tamanho + quantidade) precisa chegar exatamente igual ao carrinho lateral e ao checkout da Yampi.

## O que está fora de sincronia hoje

- O carrinho lateral já recebe tamanho e quantidade corretos ao adicionar, mas o botão "Finalizar compra" soma **todas** as quantidades e envia apenas o tamanho do **primeiro** item. Com dois tamanhos no carrinho, o checkout sai errado.
- A barra fixa mobile só dispara um clique no botão principal; ela não mostra o tamanho/quantidade escolhidos e não avisa quando falta escolher tamanho.
- Na integração Yampi, o tamanho vai como texto livre (`tamanho` na rota da API, `variant` no link de fallback) e o SKU é escolhido por busca aproximada de título, podendo cair no primeiro SKU disponível quando não encontra correspondência.

## Mudanças propostas

1. **Carrinho fiel à seleção**
   - Cada linha do carrinho continua sendo produto+tamanho, com quantidade editável; o subtotal já reflete o preço com adicional do tamanho.
   - Ao adicionar um tamanho já existente, somar quantidade (comportamento atual mantido) e destacar visualmente a linha atualizada.

2. **Checkout Yampi item a item**
   - Enviar ao servidor a lista completa de itens (`[{ size, quantity }]`) em vez de um único par.
   - O servidor resolve o SKU de cada tamanho e monta um único link de checkout com todos os itens (formato de múltiplos SKUs da Yampi), mantendo fallback para o link estático quando a API não responder.
   - Padronizar o parâmetro de tamanho em um único nome nos dois caminhos (API e fallback).

3. **Mapa explícito de tamanho → SKU**
   - Adicionar em `src/lib/yampi.ts` um mapa `tamanho -> SKU/ID da Yampi`, usado como fonte primária; a busca por título vira apenas fallback e, se nada casar, o item não é silenciosamente trocado por outro SKU (mostra erro claro).

4. **Barra fixa mobile sincronizada**
   - Mostrar tamanho selecionado e quantidade na barra, com o total já calculado.
   - Se não houver tamanho selecionado, rolar até o seletor e sinalizar o erro em vez de adicionar item errado.

5. **Validação**
   - Testes de fluxo (Playwright) em mobile e desktop: escolher tamanho G + 2 un., adicionar, conferir carrinho, alterar quantidade, adicionar segundo tamanho e conferir a URL final de checkout.

## Detalhes técnicos

- `src/hooks/use-cart.tsx`: sem mudança estrutural; apenas expor os itens já existentes ao checkout.
- `src/lib/yampi.functions.ts`: `inputValidator` passa a aceitar `{ items: { size: string; quantity: number }[] }`, resolve SKUs em lote e monta a URL.
- `src/lib/yampi.ts`: constante `YAMPI_SKU_BY_SIZE` + `buildYampiCheckoutUrl(items)`.
- `src/components/store/MiniCart.tsx`: envia `items` completos.
- `src/components/store/StickyBuyBar.tsx` e `ProductInfo.tsx`: passam tamanho/quantidade selecionados e tratam a validação de tamanho.

Observação: para o mapa de SKUs ficar 100% correto preciso dos códigos de SKU de cada tamanho na sua loja Yampi. Sem eles, faço a resolução automática por título e deixo o mapa pronto para você preencher.
