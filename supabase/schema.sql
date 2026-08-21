-- Patriot Shop — cofre (Supabase)
-- Cole este arquivo inteiro no SQL Editor e clique em Run.

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'Vestuário',
  category_slug text not null default 'vestuario',
  badge text,
  sku text not null unique,
  brand text not null default 'Clube Bolsonaro',
  stock integer not null default 0,
  price numeric(10, 2) not null,
  old_price numeric(10, 2),
  pix_discount numeric(6, 4) not null default 0.03,
  max_installments integer not null default 12,
  images jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  description jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  size_chart jsonb not null default '[]'::jsonb,
  reviews jsonb not null default '[]'::jsonb,
  rank integer not null default 100,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_rank_idx
  on public.products (published, rank);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row
  execute function public.touch_updated_at();

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create or replace function public.sync_admin_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(coalesce(new.email, '')) = 'louzadaof@gmail.com' then
    insert into public.admins (user_id, email)
    values (new.id, lower(new.email))
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.sync_admin_user();

insert into public.admins (user_id, email)
select id, lower(email)
from auth.users
where lower(email) = 'louzadaof@gmail.com'
on conflict (user_id) do nothing;

alter table public.admins enable row level security;
alter table public.products enable row level security;

drop policy if exists "published products are public" on public.products;
create policy "published products are public"
  on public.products for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admins read all products" on public.products;
create policy "admins read all products"
  on public.products for select
  to authenticated
  using (private.is_admin());

drop policy if exists "admins insert products" on public.products;
create policy "admins insert products"
  on public.products for insert
  to authenticated
  with check (private.is_admin());

drop policy if exists "admins update products" on public.products;
create policy "admins update products"
  on public.products for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists "admins delete products" on public.products;
create policy "admins delete products"
  on public.products for delete
  to authenticated
  using (private.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

drop policy if exists "admin insert product images" on storage.objects;
create policy "admin insert product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and private.is_admin());

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and private.is_admin())
  with check (bucket_id = 'product-images' and private.is_admin());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and private.is_admin());

insert into public.products (
  slug, name, category, category_slug, badge, sku, brand, stock, price, old_price,
  pix_discount, max_installments, images, sizes, description, specifications,
  highlights, faq, size_chart, reviews, rank, published
)
values (
  'camiseta-clube-bolsonaro',
  'Camiseta Clube Bolsonaro - #Mitinho',
  'Vestuário',
  'vestuario',
  'DESTAQUE',
  'CB-CAM-0001',
  'Clube Bolsonaro',
  42,
  89.90,
  119.90,
  0.03,
  12,
  $json$[
    {"src":"/__l5e/assets-v1/a1879851-8bcc-4c36-a852-74748aa443a8/mitinho-4.png","alt":"Camiseta amarela Clube Bolsonaro #Mitinho vista de frente"},
    {"src":"/__l5e/assets-v1/1735b942-1d89-4400-896a-718a4f8e300b/mitinho-5.png","alt":"Modelo vestindo a camiseta amarela #Mitinho"},
    {"src":"/__l5e/assets-v1/a9e9dbef-46d3-4d8a-880e-f0660af86d3f/mitinho-6.png","alt":"Modelo de costas com a camiseta amarela lisa"},
    {"src":"/__l5e/assets-v1/ea7f7d41-7043-490d-ab07-40b9ce8ad992/mitinho-7.png","alt":"Camiseta amarela #Mitinho em flat lay pelas costas"}
  ]$json$::jsonb,
  $json$[
    {"label":"P","extra":0,"available":true},
    {"label":"M","extra":0,"available":true},
    {"label":"G","extra":0,"available":true},
    {"label":"GG","extra":0,"available":true},
    {"label":"G1","extra":9.15,"available":true},
    {"label":"G2","extra":19.15,"available":true}
  ]$json$::jsonb,
  $json$[
    "A Camiseta Oficial Clube Bolsonaro foi criada para quem deseja vestir mais do que uma roupa: deseja expressar uma mensagem. Com visual marcante, acabamento de qualidade e identidade patriótica, é uma peça que carrega força, presença e personalidade.",
    "Sua construção em tecido Dry proporciona conforto térmico e praticidade no uso, sendo uma excelente opção para quem procura uma camiseta leve, resistente e com ótimo caimento. A arte foi desenvolvida para destacar os elementos visuais do projeto, valorizando as cores do Brasil e criando uma peça com presença forte tanto em ambientes casuais quanto em eventos.",
    "O produto faz parte da linha Clube Bolsonaro, pensada para quem busca peças com identidade, qualidade e propósito. Uma camiseta desenvolvida para unir conforto, estilo e sentimento patriótico em uma única peça."
  ]$json$::jsonb,
  $json$[
    {"label":"Gênero","value":"Masculino / Feminino / Infantil"},
    {"label":"Marca","value":"Clube Bolsonaro"},
    {"label":"Indicado para","value":"Dia a dia, eventos, encontros, uso casual e ocasiões especiais"},
    {"label":"Composição","value":"Tecido Dry 3D 100% poliéster"},
    {"label":"Gola","value":"Polo V com Retilínea"},
    {"label":"Gramatura","value":"130g/m²"},
    {"label":"Acabamentos","value":"Escudos em Alto Relevo Emborrachado 3D, DTF Localizado"},
    {"label":"Fabricação","value":"Nacional"},
    {"label":"Nota Fiscal","value":"Sim, todo pedido é enviado com Nota Fiscal"}
  ]$json$::jsonb,
  $json$[
    {"title":"Tecido Dry 3D","text":"Confortável, leve e adequado para o uso no dia a dia."},
    {"title":"Alto Relevo 3D","text":"Detalhes emborrachados que valorizam o acabamento da peça."},
    {"title":"Identidade Marcante","text":"Design desenvolvido para quem deseja vestir sua identidade e seus valores."},
    {"title":"Fabricação Nacional","text":"Produto fabricado no Brasil com controle de qualidade."}
  ]$json$::jsonb,
  $json$[
    {"question":"Quais tamanhos estão disponíveis?","answer":"P, M, G, GG, G1 e G2."},
    {"question":"Como escolher o tamanho?","answer":"Clique em \"Consulte nossa tabela de medidas\" antes de adicionar o produto ao carrinho e confira largura, comprimento e ombro de cada tamanho."},
    {"question":"O produto possui Nota Fiscal?","answer":"Sim. O pedido é enviado com Nota Fiscal."},
    {"question":"Qual o prazo de envio?","answer":"O prazo varia conforme o CEP e a modalidade escolhida. Simule no calculador de frete desta página."},
    {"question":"Vocês enviam para todo o Brasil?","answer":"Sim, enviamos para todo o Brasil."},
    {"question":"Quais formas de pagamento estão disponíveis?","answer":"Pix, cartão de crédito em até 12x e boleto bancário."},
    {"question":"Posso trocar o tamanho?","answer":"Sim. A troca por tamanho pode ser solicitada em até 7 dias corridos após o recebimento, com a peça sem uso e com etiqueta. Basta falar com o nosso atendimento para receber as instruções de envio."}
  ]$json$::jsonb,
  $json$[
    {"size":"P","chest":"46 cm","length":"66 cm","shoulder":"38 cm"},
    {"size":"M","chest":"49 cm","length":"69 cm","shoulder":"40 cm"},
    {"size":"G","chest":"52 cm","length":"72 cm","shoulder":"42 cm"},
    {"size":"GG","chest":"55 cm","length":"75 cm","shoulder":"44 cm"},
    {"size":"G1","chest":"58 cm","length":"77 cm","shoulder":"46 cm"},
    {"size":"G2","chest":"61 cm","length":"79 cm","shoulder":"48 cm"}
  ]$json$::jsonb,
  $json$[
    {"id":"r1","author":"Carlos M.","rating":5,"date":"2026-07-12","title":"Qualidade excelente","content":"A camiseta superou minhas expectativas. Tecido leve, costura reforçada e o escudo em alto relevo dá um acabamento premium.","verified":true},
    {"id":"r2","author":"Fernanda R.","rating":5,"date":"2026-07-08","title":"Entrega rápida e produto perfeito","content":"Chegou antes do prazo, com Nota Fiscal e embalagem protegida. O tamanho G1 serviu direitinho conforme a tabela.","verified":true},
    {"id":"r3","author":"João P.","rating":4,"date":"2026-06-28","title":"Muito boa","content":"Gostei bastante da estampa e do tecido. Só achei que a gola podia ser um pouco mais reforçada, mas no geral recomendo.","verified":true},
    {"id":"r4","author":"Ana L.","rating":5,"date":"2026-06-15","title":"Presente certeiro","content":"Comprei para presentear e a pessoa adorou. Identidade visual forte e cores vibrantes. Vou comprar mais.","verified":false},
    {"id":"r5","author":"Marcos T.","rating":5,"date":"2026-05-30","title":"Top demais","content":"Já é a terceira que compro. Caimento ótimo, não desbota na lavagem e o atendimento é nota 10.","verified":true}
  ]$json$::jsonb,
  1,
  true
)
on conflict (slug) do nothing;

revoke insert, update, delete on table public.products from anon, public;
grant select on table public.products to anon, authenticated;
grant select, insert, update, delete on table public.products to authenticated;
revoke all on table public.admins from anon, public, authenticated;
