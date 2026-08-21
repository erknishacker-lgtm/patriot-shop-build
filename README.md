# Patriot Storefront

Crie uma página de produto de e-commerce inspirada e estruturalmente equivalente à página:

https://clubebolsonaro.com.br/produto/camiseta-bolsonaro

IMPORTANTE: quero reproduzir a EXPERIÊNCIA, estrutura, hierarquia visual e funcionalidades da página de referência, mas usando código próprio e componentes próprios. Não copie código-fonte proprietário. A página deve ser responsiva e ter excelente aparência tanto no desktop quanto no celular.

1. TECNOLOGIA

Utilize:

React

TypeScript

Tailwind CSS

Componentes reutilizáveis

Lucide React para ícones

Layout totalmente responsivo

Código limpo e organizado

Componentização adequada

Animações sutis e profissionais

Não utilize elementos desnecessários ou efeitos exagerados.

2. OBJETIVO DA PÁGINA

Criar uma página de produto premium para venda de uma camiseta.

Produto:

Camiseta Clube Bolsonaro

Categoria:
Vestuário

Preço:
R$ 239,80

A página deve ter foco total em conversão, mantendo aparência de loja profissional.

3. ESTRUTURA GERAL

A página deve possuir:

Barra superior promocional

Header principal

Menu de navegação

Campo de busca

Ícone do carrinho

Breadcrumb

Galeria de imagens do produto

Informações do produto

Seleção de tamanho

Controle de quantidade

Botão "Adicionar ao Carrinho"

Favoritar

Compartilhar

Simulador de frete

Descrição detalhada

Especificações técnicas

Rodapé completo

Informações de pagamento

Links institucionais

4. BARRA SUPERIOR

No topo da página, criar uma barra horizontal com destaque visual contendo:

"Faça parte do movimento que mais cresce no Brasil →"

A barra deve ocupar toda a largura da tela.

Utilize fundo escuro e texto claro.

No mobile, manter o texto centralizado e reduzir o tamanho da fonte.

5. HEADER

Criar um header limpo e profissional.

Desktop:

Logo à esquerda

Menu central

Campo de busca

Ícone do carrinho à direita

Menu:

Início

A Loja

Sobre

Campo de busca com placeholder:

"O que você procura?"

Adicionar ícone de pesquisa.

Carrinho:

Ícone de carrinho

Badge indicando quantidade de produtos

Ao clicar, abrir um mini-cart lateral ou dropdown

Mobile:

Logo

Ícone de busca

Ícone do carrinho

Menu hamburger

O header deve ficar fixo ou sticky no topo ao rolar a página.

6. BREADCRUMB

Logo abaixo do header:

Home / Vestuário / Camiseta Clube Bolsonaro

Utilizar tipografia pequena e discreta.

O breadcrumb deve ser clicável onde fizer sentido.

7. ÁREA PRINCIPAL DO PRODUTO

Criar um layout em duas colunas no desktop.

COLUNA ESQUERDA:

Galeria de imagens.

COLUNA DIREITA:

Informações de compra.

No mobile:

Empilhar a galeria primeiro e as informações depois.

8. GALERIA DE PRODUTO

Criar uma galeria moderna.

A imagem principal deve ocupar grande parte da coluna.

Abaixo ou ao lado, dependendo do breakpoint, exibir thumbnails.

Utilizar aproximadamente 5 a 9 imagens do produto.

Criar suporte para:

Clique na thumbnail

Troca da imagem principal

Zoom

Navegação anterior/próxima

Lightbox ao clicar na imagem

Se não houver imagens reais disponíveis, criar placeholders elegantes e deixar a estrutura preparada para substituir facilmente pelas imagens reais.

A imagem principal deve ter fundo limpo e aparência premium.

9. INFORMAÇÕES DO PRODUTO

Exibir:

Badge:

"DESTAQUE"

Título:

"Camiseta Clube Bolsonaro"

Categoria:

"Vestuário"

Preço:

"R$ 239,80"

O preço deve ter bastante destaque visual.

Adicionar possibilidade de mostrar preço antigo riscado caso uma promoção seja configurada posteriormente.

10. SELEÇÃO DE TAMANHO

Criar título:

"Selecione a Opção"

Exibir botões:

P
M
G
GG
G1
G2

Os tamanhos G1 e G2 devem apresentar adicional:

G1 + R$ 9,15
G2 + R$ 19,15

Comportamento:

Apenas um tamanho pode ser selecionado

Estado selecionado deve ficar visualmente destacado

Atualizar automaticamente o preço quando G1 ou G2 forem selecionados

Impedir adicionar ao carrinho sem selecionar tamanho

Mostrar uma mensagem amigável caso o usuário tente comprar sem selecionar

11. CONTROLE DE QUANTIDADE

Criar controle:

[-] 1 [+]

Funcionalidade:

Botão "-" diminui quantidade

Botão "+" aumenta quantidade

Nunca permitir quantidade menor que 1

Atualizar valor total dinamicamente

12. BOTÃO DE COMPRA

Criar botão grande:

"Adicionar ao Carrinho"

O botão deve ser o principal CTA da página.

Ao clicar:

Validar tamanho

Adicionar produto ao carrinho

Atualizar contador do carrinho

Mostrar feedback visual

Abrir mini-cart lateral ou mostrar confirmação

Adicionar estado de loading durante a ação.

13. FAVORITAR E COMPARTILHAR

Abaixo do botão principal:

♡ Favoritar

e

Compartilhar

Favoritar deve alterar o estado do ícone quando ativado.

Compartilhar deve abrir opções:

WhatsApp

Facebook

X

Copiar link

No mobile, utilizar uma interface compacta.

14. SIMULADOR DE FRETE

Criar uma seção:

"Simular Frete"

Campo:

"00000-000"

Botão:

"Calcular"

Ao clicar:

Validar CEP

Mostrar estado de carregamento

Exibir opções simuladas de entrega

Criar inicialmente uma lógica mock para demonstração.

Exemplo:

PAC — 7 a 10 dias
R$ 19,90

SEDEX — 3 a 5 dias
R$ 29,90

Entrega expressa — 1 a 2 dias
R$ 39,90

Deixar essa estrutura preparada para posteriormente integrar uma API real de frete.

15. DESCRIÇÃO DO PRODUTO

Criar uma seção visualmente bem organizada:

"Descrição do Produto"

Texto:

"A Camiseta Oficial Clube Bolsonaro foi criada para quem deseja vestir mais do que uma roupa: deseja expressar uma mensagem. Com visual marcante, acabamento de qualidade e identidade patriótica, é uma peça que carrega força, presença e personalidade.

Sua construção em tecido Dry proporciona conforto térmico e praticidade no uso, sendo uma excelente opção para quem procura uma camiseta leve, resistente e com ótimo caimento. A arte foi desenvolvida para destacar os elementos visuais do projeto, valorizando as cores do Brasil e criando uma peça com presença forte tanto em ambientes casuais quanto em eventos.

O produto faz parte da linha Clube Bolsonaro, pensada para quem busca peças com identidade, qualidade e propósito. Uma camiseta desenvolvida para unir conforto, estilo e sentimento patriótico em uma única peça."

16. ESPECIFICAÇÕES

Criar uma seção de especificações usando cards ou uma tabela visual elegante.

Informações:

Gênero:
Masculino / Feminino / Infantil

Marca:
Clube Bolsonaro

Indicado para:
Dia a dia, eventos, encontros, uso casual e ocasiões especiais

Composição:
Tecido Dry 3D 100% poliéster

Gola:
Polo V com Retilínea

Gramatura:
130g/m²

Acabamentos:
Escudos em Alto Relevo Emborrachado 3D, DTF Localizado

Fabricação:
Nacional

Envio:
Produto enviado com Nota Fiscal

17. MINI-CART

Criar um carrinho lateral moderno.

Quando o usuário adicionar o produto:

Abrir automaticamente um drawer pela direita.

Mostrar:

Imagem do produto
Nome
Tamanho escolhido
Quantidade
Preço unitário
Subtotal

Botões:

"Continuar comprando"

"Finalizar compra"

Permitir remover produto e alterar quantidade.

O carrinho deve persistir enquanto o usuário navega pela página.

Utilizar localStorage para persistência.

18. CHECKOUT

Criar estrutura preparada para checkout.

O botão:

"Finalizar compra"

deve levar para uma página /checkout.

Criar uma página de checkout simples e profissional contendo:

Dados pessoais
Nome
E-mail
Telefone

Endereço
CEP
Rua
Número
Complemento
Bairro
Cidade
Estado

Forma de pagamento:

Pix
Cartão
Boleto

Resumo do pedido.

IMPORTANTE:

Não criar integração real de pagamento neste momento.

Deixar a arquitetura preparada para posteriormente integrar Mercado Pago, Stripe, PagSeguro ou outro gateway.

19. RODAPÉ

Criar um footer profissional.

Colunas:

Institucional

Início

A Loja

Sobre

Atendimento

Fale conosco

Política de Privacidade

Termos de Uso

Pagamento:

Exibir ícones/logos de:

Pix

Visa

Mastercard

American Express

Boleto

Adicionar seção:

"Acompanhe nas redes"

com ícones sociais.

Na parte inferior:

"CAPITAO STORE BRASIL LTDA"

"CNPJ: 66.716.746/0001-04"

"© 2026 Clube Bolsonaro. Todos os direitos reservados."

20. DESIGN VISUAL

A estética deve ser inspirada em uma loja premium de produtos patrióticos.

Paleta:

Verde escuro

Verde

Amarelo/dourado

Branco

Preto/cinza escuro

Não exagerar no uso do amarelo.

Usar amarelo principalmente para:

CTAs

destaques

badges

pequenos detalhes

Cards com bordas suaves.

Sombras discretas.

Tipografia moderna.

Muito espaço em branco.

Layout organizado.

Visual premium.

21. RESPONSIVIDADE

Desktop:

Layout de duas colunas

Galeria grande

Informações de compra ao lado

Tablet:

Reduzir espaçamentos

Manter duas colunas quando houver espaço suficiente

Mobile:

Uma coluna

Galeria em primeiro lugar

Informações abaixo

Botões grandes

Menu hamburger

Carrinho lateral ocupando aproximadamente 90% da largura

Seleção de tamanho com grid

Simulador de frete em largura total

Garantir que não exista overflow horizontal.

22. EXPERIÊNCIA E MICROINTERAÇÕES

Adicionar microinterações elegantes:

Hover nos botões

Transição nas thumbnails

Animação ao favoritar

Feedback ao adicionar ao carrinho

Loading no cálculo de frete

Animação suave do mini-cart

Toast de confirmação

Evitar animações exageradas.

23. SEO

Configurar:

Title:

"Camiseta Clube Bolsonaro | Loja Oficial"

Description:

"Camiseta Clube Bolsonaro com tecido Dry 3D, acabamento premium e identidade patriótica. Confira tamanhos e compre online."

Utilizar:

H1 apenas no título do produto

H2 nas seções

Alt text nas imagens

URLs amigáveis

Criar também dados estruturados Schema.org para Product.

24. PERFORMANCE

Priorizar:

Lazy loading nas imagens

Componentes reutilizáveis

Imagens otimizadas

CSS eficiente

Evitar bibliotecas desnecessárias

Boa pontuação Lighthouse

25. ESTRUTURA DE COMPONENTES

Organizar o projeto aproximadamente assim:

components/
Header
TopBar
Breadcrumb
ProductGallery
ProductInfo
SizeSelector
QuantitySelector
AddToCartButton
ShippingCalculator
ProductDescription
ProductSpecifications
MiniCart
Footer
Toast

pages/
ProductPage
CheckoutPage

hooks/
useCart
useProduct
useShipping

Criar dados do produto em um arquivo separado para facilitar futuras alterações.

26. IMPORTANTE SOBRE O PRODUTO

Deixar todos os seguintes dados facilmente editáveis em um único objeto:

nome
categoria
preço
preço antigo
imagens
tamanhos
adicionais por tamanho
descrição
especificações
estoque
SKU

Assim será possível posteriormente transformar a página em um sistema com vários produtos.

27. RESULTADO FINAL

Quero que o resultado pareça uma loja profissional real, e não um protótipo.

Prioridades:

Aparência premium

Fidelidade à estrutura da página de referência

Excelente experiência mobile

Foco em conversão

Carrinho funcional

Seleção de tamanho funcional

Simulador de frete funcional em modo demonstração

Código organizado

Componentização

Preparação para integração futura com checkout e gateway de pagamento

Antes de finalizar, teste todas as interações:

selecionar tamanho

alterar quantidade

alterar preço G1/G2

adicionar ao carrinho

abrir carrinho

remover produto

alterar quantidade no carrinho

favoritar

compartilhar

calcular frete

navegar no mobile

abrir checkout

Não entregue elementos meramente decorativos quando eles puderem ser funcionais.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://patriot-shop-build.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ab54765e-34a8-4d4a-8453-a2ae33a07b4a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
