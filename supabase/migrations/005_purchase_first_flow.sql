create table if not exists public.pending_subscriptions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  plan text not null check (plan in ('monthly', 'annual')),
  status text not null default 'created',
  provider text not null default 'mercado_pago',
  provider_preference_id text,
  provider_payment_id text,
  approved_at timestamp with time zone,
  plan_expires_at timestamp with time zone,
  activated_user_id uuid references auth.users(id) on delete set null,
  raw_event jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists pending_subscriptions_email_status_idx
  on public.pending_subscriptions(lower(email), status, created_at desc);

create unique index if not exists pending_subscriptions_provider_payment_unique_idx
  on public.pending_subscriptions(provider, provider_payment_id)
  where provider_payment_id is not null;

alter table public.pending_subscriptions enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  pending record;
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', lower(new.email))
  on conflict (id) do update
    set
      name = coalesce(public.profiles.name, excluded.name),
      email = lower(excluded.email);

  select *
  into pending
  from public.pending_subscriptions
  where lower(email) = lower(new.email)
    and status = 'approved'
    and activated_user_id is null
  order by created_at desc
  limit 1;

  if pending.id is not null then
    update public.profiles
    set
      plan = case
        when pending.plan = 'annual' then 'plena_annual'
        else 'plena_monthly'
      end,
      billing_cycle = case
        when pending.plan = 'annual' then 'annual'
        else 'monthly'
      end,
      plan_started_at = coalesce(pending.approved_at, now()),
      plan_expires_at = pending.plan_expires_at
    where id = new.id;

    update public.pending_subscriptions
    set
      status = 'activated',
      activated_user_id = new.id,
      updated_at = now()
    where id = pending.id;
  end if;

  return new;
end;
$$;
