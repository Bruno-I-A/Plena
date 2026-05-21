create table if not exists public.weekly_menus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Cardapio da semana',
  week_start date,
  meals jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Lista de compras',
  items jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  quantity text,
  created_at timestamp with time zone default now()
);

alter table public.weekly_menus enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.pantry_items enable row level security;

create index if not exists weekly_menus_user_updated_idx on public.weekly_menus(user_id, updated_at desc);
create index if not exists shopping_lists_user_updated_idx on public.shopping_lists(user_id, updated_at desc);
create index if not exists pantry_items_user_created_idx on public.pantry_items(user_id, created_at desc);

create policy "weekly_menus_select_own"
  on public.weekly_menus for select
  using (auth.uid() = user_id);

create policy "weekly_menus_insert_own"
  on public.weekly_menus for insert
  with check (auth.uid() = user_id);

create policy "weekly_menus_update_own"
  on public.weekly_menus for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "weekly_menus_delete_own"
  on public.weekly_menus for delete
  using (auth.uid() = user_id);

create policy "shopping_lists_select_own"
  on public.shopping_lists for select
  using (auth.uid() = user_id);

create policy "shopping_lists_insert_own"
  on public.shopping_lists for insert
  with check (auth.uid() = user_id);

create policy "shopping_lists_update_own"
  on public.shopping_lists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "shopping_lists_delete_own"
  on public.shopping_lists for delete
  using (auth.uid() = user_id);

create policy "pantry_items_select_own"
  on public.pantry_items for select
  using (auth.uid() = user_id);

create policy "pantry_items_insert_own"
  on public.pantry_items for insert
  with check (auth.uid() = user_id);

create policy "pantry_items_update_own"
  on public.pantry_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "pantry_items_delete_own"
  on public.pantry_items for delete
  using (auth.uid() = user_id);
