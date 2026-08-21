-- Reforço de segurança no cofre já existente.
-- Pode rodar mais de uma vez.

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

drop function if exists public.is_admin();

revoke insert, update, delete on table public.products from anon, public;
grant select on table public.products to anon, authenticated;
grant select, insert, update, delete on table public.products to authenticated;

revoke all on table public.admins from anon, public, authenticated;
