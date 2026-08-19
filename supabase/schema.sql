create extension if not exists pgcrypto;

do $$ begin
  create type public.product_status as enum ('draft', 'active', 'archived');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.fulfilment_status as enum ('unfulfilled', 'processing', 'partially_shipped', 'shipped', 'delivered', 'returned');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sellers (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  business_name text,
  phone text,
  instagram_handle text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  scripture text,
  product_type text not null,
  status public.product_status not null default 'draft',
  currency char(3) not null default 'NGN',
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  cost_price numeric(12,2) check (cost_price is null or cost_price >= 0),
  sku_prefix text,
  featured boolean not null default false,
  taxable boolean not null default true,
  track_inventory boolean not null default true,
  image_urls text[] not null default '{}',
  tags text[] not null default '{}',
  size_options text[] not null default '{}',
  color_options text[] not null default '{}',
  frame_size_options text[] not null default '{}',
  care_instructions text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  size text,
  color text,
  frame_size text,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  weight_grams integer check (weight_grams is null or weight_grams >= 0),
  image_url text,
  active boolean not null default true,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color, frame_size)
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  label text default 'Home',
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state_region text not null,
  postal_code text,
  country_code char(2) not null default 'NG',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  currency char(3) not null default 'NGN',
  status text not null default 'active' check (status in ('active', 'converted', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  personalization jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Saved items',
  created_at timestamptz not null default now(),
  unique (customer_id, name)
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('DK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  customer_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  customer_phone text not null,
  status public.order_status not null default 'pending',
  fulfilment_status public.fulfilment_status not null default 'unfulfilled',
  currency char(3) not null default 'NGN',
  subtotal numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  shipping_total numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null default 0,
  shipping_address jsonb not null,
  billing_address jsonb,
  discount_codes text[] not null default '{}',
  customer_note text,
  internal_note text,
  metadata jsonb not null default '{}'::jsonb,
  placed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  sku text,
  size text,
  color text,
  frame_size text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  personalization jsonb not null default '{}'::jsonb,
  product_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_reference text,
  status public.payment_status not null default 'pending',
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null default 'NGN',
  payment_method text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  carrier text,
  service text,
  tracking_number text,
  tracking_url text,
  status public.fulfilment_status not null default 'unfulfilled',
  shipped_at timestamptz,
  delivered_at timestamptz,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  verified_purchase boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, customer_id)
);

create table if not exists public.custom_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text not null check (char_length(phone) between 7 and 30),
  product_type text not null,
  quantity integer not null default 1 check (quantity > 0),
  requested_sizes text[] not null default '{}',
  requested_colors text[] not null default '{}',
  message text not null check (char_length(message) between 10 and 5000),
  reference_urls text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'reviewing', 'quoted', 'approved', 'in_production', 'completed', 'cancelled')),
  quoted_amount numeric(12,2),
  currency char(3) not null default 'NGN',
  seller_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 5 and 254),
  source text not null default 'storefront',
  active boolean not null default true,
  subscribed_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  seller_id uuid references public.sellers(id) on delete set null,
  movement_type text not null check (movement_type in ('restock', 'sale', 'return', 'adjustment', 'damage')),
  quantity_delta integer not null check (quantity_delta <> 0),
  reference_type text,
  reference_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_seller_id_idx on public.products(seller_id);
create index if not exists products_status_featured_idx on public.products(status, featured);
create index if not exists product_variants_product_id_idx on public.product_variants(product_id);
create index if not exists addresses_customer_id_idx on public.addresses(customer_id);
create index if not exists carts_customer_id_idx on public.carts(customer_id);
create index if not exists cart_items_cart_id_idx on public.cart_items(cart_id);
create index if not exists cart_items_variant_id_idx on public.cart_items(variant_id);
create index if not exists wishlists_customer_id_idx on public.wishlists(customer_id);
create index if not exists wishlist_items_product_id_idx on public.wishlist_items(product_id);
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists orders_status_created_at_idx on public.orders(status, created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_product_id_idx on public.order_items(product_id);
create index if not exists order_items_variant_id_idx on public.order_items(variant_id);
create index if not exists payments_order_id_idx on public.payments(order_id);
create unique index if not exists payments_provider_reference_unique_idx on public.payments(provider, provider_reference) where provider_reference is not null;
create index if not exists shipments_order_id_idx on public.shipments(order_id);
create index if not exists reviews_product_id_idx on public.reviews(product_id);
create index if not exists reviews_customer_id_idx on public.reviews(customer_id);
create index if not exists custom_requests_customer_id_idx on public.custom_requests(customer_id);
create index if not exists inventory_movements_variant_id_idx on public.inventory_movements(variant_id);
create index if not exists inventory_movements_seller_id_idx on public.inventory_movements(seller_id);

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end
$$;

alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.addresses enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.shipments enable row level security;
alter table public.reviews enable row level security;
alter table public.custom_requests enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.inventory_movements enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "sellers_select_public" on public.sellers;
create policy "sellers_select_public" on public.sellers for select to anon, authenticated using (active);
drop policy if exists "sellers_manage_own" on public.sellers;
create policy "sellers_manage_own" on public.sellers for all to authenticated using ((select auth.uid()) = id or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin') with check ((select auth.uid()) = id or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "categories_select_active" on public.categories;
create policy "categories_select_active" on public.categories for select to anon, authenticated using (active);
drop policy if exists "categories_manage_staff" on public.categories;
create policy "categories_manage_staff" on public.categories for all to authenticated using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('admin','seller')) with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('admin','seller'));

drop policy if exists "products_select_active" on public.products;
create policy "products_select_active" on public.products for select to anon, authenticated using (status = 'active');
drop policy if exists "products_manage_staff" on public.products;
create policy "products_manage_staff" on public.products for all to authenticated using ((select auth.uid()) = seller_id or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin') with check ((select auth.uid()) = seller_id or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "variants_select_active" on public.product_variants;
create policy "variants_select_active" on public.product_variants for select to anon, authenticated using (active and exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
drop policy if exists "variants_manage_staff" on public.product_variants;
create policy "variants_manage_staff" on public.product_variants
for all to authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and ((select auth.uid()) = p.seller_id or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin')
  )
)
with check (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and ((select auth.uid()) = p.seller_id or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin')
  )
);

drop policy if exists "addresses_owner_all" on public.addresses;
create policy "addresses_owner_all" on public.addresses for all to authenticated using ((select auth.uid()) = customer_id) with check ((select auth.uid()) = customer_id);
drop policy if exists "carts_owner_all" on public.carts;
create policy "carts_owner_all" on public.carts for all to authenticated using ((select auth.uid()) = customer_id) with check ((select auth.uid()) = customer_id);
drop policy if exists "cart_items_owner_all" on public.cart_items;
create policy "cart_items_owner_all" on public.cart_items for all to authenticated using (exists (select 1 from public.carts c where c.id = cart_id and c.customer_id = (select auth.uid()))) with check (exists (select 1 from public.carts c where c.id = cart_id and c.customer_id = (select auth.uid())));
drop policy if exists "wishlists_owner_all" on public.wishlists;
create policy "wishlists_owner_all" on public.wishlists for all to authenticated using ((select auth.uid()) = customer_id) with check ((select auth.uid()) = customer_id);
drop policy if exists "wishlist_items_owner_all" on public.wishlist_items;
create policy "wishlist_items_owner_all" on public.wishlist_items for all to authenticated using (exists (select 1 from public.wishlists w where w.id = wishlist_id and w.customer_id = (select auth.uid()))) with check (exists (select 1 from public.wishlists w where w.id = wishlist_id and w.customer_id = (select auth.uid())));

drop policy if exists "orders_customer_select" on public.orders;
create policy "orders_customer_select" on public.orders for select to authenticated using ((select auth.uid()) = customer_id or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('admin','seller'));
drop policy if exists "order_items_customer_select" on public.order_items;
create policy "order_items_customer_select" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = (select auth.uid()) or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('admin','seller'))));
drop policy if exists "payments_customer_select" on public.payments;
create policy "payments_customer_select" on public.payments for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = (select auth.uid()) or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('admin','seller'))));
drop policy if exists "shipments_customer_select" on public.shipments;
create policy "shipments_customer_select" on public.shipments for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = (select auth.uid()) or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('admin','seller'))));

drop policy if exists "reviews_select_published" on public.reviews;
create policy "reviews_select_published" on public.reviews for select to anon, authenticated using (published or customer_id = (select auth.uid()) or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('admin','seller'));
drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews for insert to authenticated with check ((select auth.uid()) = customer_id);
drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews for update to authenticated using ((select auth.uid()) = customer_id) with check ((select auth.uid()) = customer_id and not published);

drop policy if exists "custom_requests_submit" on public.custom_requests;
create policy "custom_requests_submit" on public.custom_requests for insert to anon, authenticated with check (customer_id is null or customer_id = (select auth.uid()));
drop policy if exists "custom_requests_view_own_or_staff" on public.custom_requests;
create policy "custom_requests_view_own_or_staff" on public.custom_requests for select to authenticated using (customer_id = (select auth.uid()) or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('admin','seller'));
drop policy if exists "newsletter_subscribe" on public.newsletter_subscribers;
create policy "newsletter_subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (active);
drop policy if exists "inventory_staff" on public.inventory_movements;
create policy "inventory_staff" on public.inventory_movements for all to authenticated using (seller_id = (select auth.uid()) or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin') with check (seller_id = (select auth.uid()) or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin');

grant select on public.categories, public.products, public.product_variants, public.sellers, public.reviews to anon, authenticated;
grant insert on public.custom_requests, public.newsletter_subscribers to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.sellers, public.categories, public.products, public.product_variants, public.addresses, public.carts, public.cart_items, public.wishlists, public.wishlist_items, public.orders, public.order_items, public.payments, public.shipments, public.reviews, public.custom_requests, public.newsletter_subscribers, public.inventory_movements to authenticated;
grant all on public.profiles, public.sellers, public.categories, public.products, public.product_variants, public.addresses, public.carts, public.cart_items, public.wishlists, public.wishlist_items, public.orders, public.order_items, public.payments, public.shipments, public.reviews, public.custom_requests, public.newsletter_subscribers, public.inventory_movements to service_role;

insert into public.categories (name, slug, description, image_url, position, active) values
  ('Faith Tees', 'faith-tees', 'Everyday apparel carrying words of faith.', '/campaign/faith-tees-rack.png', 1, true),
  ('Women', 'women', 'Faith-filled pieces designed for her.', '/campaign/women-pray-boldly.png', 2, true),
  ('Men', 'men', 'Quietly confident faith apparel for him.', '/campaign/men-the-way.png', 3, true),
  ('Couples Collection', 'couples-collection', 'Coordinated pieces for faith and love together.', '/campaign/couple-connection.png', 4, true),
  ('Gifts & Home', 'gifts-home', 'Meaningful reminders for giving and living.', '/campaign/faith-at-home.png', 5, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  position = excluded.position,
  active = excluded.active,
  updated_at = now();

insert into public.products (
  category_id, name, slug, short_description, description, scripture, product_type,
  status, currency, price, sku_prefix, featured, image_urls, tags, size_options, color_options,
  frame_size_options, care_instructions, metadata
) values
  ((select id from public.categories where slug='faith-tees'), 'Walk by Faith Shirt', 'walk-by-faith-shirt', 'A premium faith shirt for everyday wear.', 'Heavyweight cotton with a relaxed unisex fit.', '2 Corinthians 5:7', 'shirt', 'active', 'NGN', 20000, 'DK-WBF', true, array['/campaign/faith-tees-rack.png'], array['faith','unisex','shirt'], array['XS','S','M','L','XL','2XL','3XL'], array['White','Black','Red','Blue','Yellow'], '{}', array['Wash cold','Do not iron directly on print'], '{"message":"WALK BY FAITH"}'),
  ((select id from public.categories where slug='women'), 'Pray Boldly Tee', 'pray-boldly-tee', 'Soft strength and bold prayer.', 'Premium oversized tee with a contemporary editorial print.', '1 Thessalonians 5:17', 't-shirt', 'active', 'NGN', 25000, 'DK-PBT', true, array['/campaign/women-pray-boldly.png'], array['faith','women','tee'], array['XS','S','M','L','XL','2XL'], array['White','Black','Red','Blue','Yellow'], '{}', array['Wash cold','Line dry'], '{"message":"PRAY BOLDLY"}'),
  ((select id from public.categories where slug='men'), 'The Way Hoodie', 'the-way-hoodie', 'A heavyweight statement layer.', 'Premium maroon sweatshirt-style hoodie with a clean faith message.', 'John 14:6', 'hoodie', 'active', 'NGN', 25000, 'DK-TWH', true, array['/campaign/men-the-way.png'], array['faith','men','hoodie'], array['S','M','L','XL','2XL','3XL'], array['Maroon','Black','Ash'], '{}', array['Wash cold','Dry flat'], '{"message":"THE WAY"}'),
  ((select id from public.categories where slug='couples-collection'), 'Cord of Three Tee', 'cord-of-three-tee', 'Faith at the centre of love.', 'Coordinating premium couple tee in a relaxed fit.', 'Ecclesiastes 4:12', 't-shirt', 'active', 'NGN', 25000, 'DK-COT', true, array['/campaign/couple-connection.png'], array['faith','couples','tee'], array['XS','S','M','L','XL','2XL','3XL'], array['Cream','Cocoa'], '{}', array['Wash cold','Line dry'], '{"message":"CORD OF THREE"}'),
  ((select id from public.categories where slug='couples-collection'), 'Better Together Tee', 'better-together-tee', 'Designed for faith and love together.', 'Coordinating premium couple tee in a relaxed fit.', 'Ecclesiastes 4:12', 't-shirt', 'active', 'NGN', 25000, 'DK-BTT', true, array['/campaign/couple-connection.png'], array['faith','couples','tee'], array['XS','S','M','L','XL','2XL','3XL'], array['Cocoa','Cream'], '{}', array['Wash cold','Line dry'], '{"message":"BETTER TOGETHER"}'),
  ((select id from public.categories where slug='gifts-home'), 'Grace for Today Mug', 'grace-for-today-mug', 'A daily reminder with every cup.', 'Durable ceramic mug for coffee, tea and quiet time.', 'Lamentations 3:23', 'mug', 'active', 'NGN', 10000, 'DK-GTM', false, array['/campaign/faith-accessories.png'], array['faith','mug','gift'], array['12 oz'], array['Cream','White'], '{}', array['Dishwasher safe'], '{"message":"GRACE FOR TODAY"}'),
  ((select id from public.categories where slug='gifts-home'), 'Let God Lead Tote', 'let-god-lead-tote', 'Carry the reminder everywhere.', 'Strong everyday cotton tote with comfortable handles.', 'Proverbs 3:6', 'tote-bag', 'active', 'NGN', 12000, 'DK-LGL', true, array['/campaign/faith-accessories.png'], array['faith','bag','gift'], array['One Size'], array['Black','Natural'], '{}', array['Spot clean'], '{"message":"LET GOD LEAD","default_size":true}'),
  ((select id from public.categories where slug='gifts-home'), 'Faith Everyday Cap', 'faith-everyday-cap', 'A simple embroidered declaration.', 'Adjustable cotton cap with clean faith embroidery.', 'Hebrews 11:1', 'cap', 'active', 'NGN', 9000, 'DK-FEC', false, array['/campaign/faith-accessories.png'], array['faith','cap','gift'], array['Adjustable'], array['Army Green','Black'], '{}', array['Spot clean'], '{"message":"FAITH"}'),
  ((select id from public.categories where slug='gifts-home'), 'Coffee & Grace Set', 'coffee-grace-set', 'A thoughtful coffee-time gift set.', 'Coordinated mug and devotional gift set, ready to give.', 'Psalm 90:14', 'gift-set', 'active', 'NGN', 30000, 'DK-CGS', true, array['/campaign/faith-accessories.png'], array['faith','coffee','gift-set'], array['Gift Set'], array['Ivory & Sage'], '{}', array['See individual items'], '{"message":"COFFEE & GRACE"}'),
  ((select id from public.categories where slug='gifts-home'), 'Peace, Be Still Cushion', 'peace-be-still-cushion', 'A gentle reminder for restful spaces.', 'Soft decorative cushion cover for faith-filled interiors.', 'Mark 4:39', 'cushion', 'active', 'NGN', 20000, 'DK-PBS', false, array['/campaign/faith-at-home.png'], array['faith','home','cushion'], array['18 × 18 in'], array['Cream','Sage'], '{}', array['Cold gentle wash'], '{"message":"PEACE, BE STILL"}'),
  ((select id from public.categories where slug='gifts-home'), 'Write the Vision Journal', 'write-the-vision-journal', 'A place for prayer, plans and reflection.', 'A5 spiral journal with lined pages and durable cover.', 'Habakkuk 2:2', 'journal', 'active', 'NGN', 12000, 'DK-WTV', false, array['/campaign/faith-at-home.png'], array['faith','journal','gift'], array['A5'], array['Maroon','Cream'], '{}', '{}', '{"message":"WRITE THE VISION"}'),
  ((select id from public.categories where slug='gifts-home'), 'Grace Lives Here Frame', 'grace-lives-here-frame', 'Faith-centred wall art for modern homes.', 'Premium art print available in standard frame and paper sizes.', null, 'frame', 'active', 'NGN', 30000, 'DK-GLH', false, array['/campaign/faith-at-home.png'], array['faith','home','frame'], '{}', array['Ivory','Black'], array['8×10 in','11×14 in','12×16 in','16×20 in','18×24 in','24×36 in','A4','A3','A2'], array['Wipe frame with a dry cloth'], '{"message":"GRACE LIVES HERE"}')
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  scripture = excluded.scripture,
  product_type = excluded.product_type,
  status = excluded.status,
  currency = excluded.currency,
  price = excluded.price,
  sku_prefix = excluded.sku_prefix,
  featured = excluded.featured,
  image_urls = excluded.image_urls,
  tags = excluded.tags,
  size_options = excluded.size_options,
  color_options = excluded.color_options,
  frame_size_options = excluded.frame_size_options,
  care_instructions = excluded.care_instructions,
  metadata = excluded.metadata,
  updated_at = now();

insert into public.product_variants (product_id, sku, size, color, frame_size, price, stock_quantity, active)
select
  p.id,
  p.sku_prefix || '-' || upper(regexp_replace(coalesce(s.size, s.frame_size, 'OS'), '[^A-Za-z0-9]+', '', 'g')) || '-' || upper(substr(regexp_replace(coalesce(c.color, 'DEFAULT'), '[^A-Za-z0-9]+', '', 'g'), 1, 8)),
  s.size,
  c.color,
  s.frame_size,
  p.price,
  25,
  true
from public.products p
cross join lateral (
  select size_value as size, null::text as frame_size
  from unnest(
    case
      when cardinality(p.size_options) > 0 then p.size_options
      when cardinality(p.frame_size_options) = 0 then array[null::text]
      else array[]::text[]
    end
  ) size_value
  union all
  select null::text, frame_value from unnest(p.frame_size_options) frame_value
) s
cross join lateral (
  select color_value as color from unnest(case when cardinality(p.color_options) > 0 then p.color_options else array[null::text] end) color_value
) c
where p.status = 'active'
on conflict (sku) do update set
  price = excluded.price,
  stock_quantity = greatest(public.product_variants.stock_quantity, 0),
  active = true,
  updated_at = now();
