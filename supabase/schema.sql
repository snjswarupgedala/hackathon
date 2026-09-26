create table if not exists public.app_users (
  id text primary key,
  email text not null unique,
  user_data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.app_user_data (
  user_id text primary key references public.app_users(id) on delete cascade,
  store_data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_users enable row level security;
alter table public.app_user_data enable row level security;

grant all on table public.app_users to service_role;
grant all on table public.app_user_data to service_role;