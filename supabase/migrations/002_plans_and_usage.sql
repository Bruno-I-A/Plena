alter table public.profiles
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'plena_monthly', 'plena_annual')),
  add column if not exists billing_cycle text
    check (billing_cycle in ('monthly', 'annual')),
  add column if not exists plan_started_at timestamp with time zone,
  add column if not exists plan_expires_at timestamp with time zone;

create index if not exists messages_user_role_created_idx
  on public.messages(user_id, role, created_at desc);
