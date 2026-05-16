create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('monthly', 'annual')),
  provider text not null default 'mercado_pago',
  provider_preference_id text,
  provider_payment_id text,
  status text not null default 'created',
  raw_event jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create unique index if not exists payments_provider_payment_unique_idx
  on public.payments(provider, provider_payment_id)
  where provider_payment_id is not null;

create index if not exists payments_user_created_idx
  on public.payments(user_id, created_at desc);

alter table public.payments enable row level security;

create policy "payments_select_own"
  on public.payments for select
  using (auth.uid() = user_id);
