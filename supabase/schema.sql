-- SpaceStays Cockpit V2
-- Run this in Supabase SQL Editor after creating the project.

create table if not exists public.leads (
  id text primary key,
  company text not null,
  country text default '',
  region text default '',
  industry text default '',
  email text default '',
  phone text default '',
  contact text default '',
  source text default '',
  signal text default '',
  status text default 'Neu',
  follow_up date,
  language text default 'DE',
  team_size integer default 0,
  target_region text default '',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.apartments (
  id text primary key,
  name text not null,
  city text default '',
  region text default '',
  beds integer default 0,
  bedrooms integer default 0,
  parking text default '',
  status text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.mail_templates (
  language text primary key,
  subject text not null,
  body text not null,
  updated_at timestamptz default now()
);

create table if not exists public.mail_queue (
  id uuid primary key default gen_random_uuid(),
  lead_id text references public.leads(id) on delete set null,
  recipient text not null,
  subject text not null,
  body text not null,
  status text default 'draft',
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text,
  action text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists apartments_updated_at on public.apartments;
create trigger apartments_updated_at
before update on public.apartments
for each row execute function public.set_updated_at();

drop trigger if exists mail_templates_updated_at on public.mail_templates;
create trigger mail_templates_updated_at
before update on public.mail_templates
for each row execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.apartments enable row level security;
alter table public.mail_templates enable row level security;
alter table public.mail_queue enable row level security;
alter table public.activity_log enable row level security;

-- Restrict access to signed-in SpaceStays users.
-- Add more allowed emails below if your team grows.
create or replace function public.is_spacestays_user()
returns boolean as $$
begin
  return lower(coalesce(auth.jwt() ->> 'email', '')) in (
    'info@spacestays.de'
  );
end;
$$ language plpgsql stable;

drop policy if exists "spacestays read leads" on public.leads;
create policy "spacestays read leads"
on public.leads for select
to authenticated
using (public.is_spacestays_user());

drop policy if exists "spacestays write leads" on public.leads;
create policy "spacestays write leads"
on public.leads for all
to authenticated
using (public.is_spacestays_user())
with check (public.is_spacestays_user());

drop policy if exists "spacestays read apartments" on public.apartments;
create policy "spacestays read apartments"
on public.apartments for select
to authenticated
using (public.is_spacestays_user());

drop policy if exists "spacestays write apartments" on public.apartments;
create policy "spacestays write apartments"
on public.apartments for all
to authenticated
using (public.is_spacestays_user())
with check (public.is_spacestays_user());

drop policy if exists "spacestays read templates" on public.mail_templates;
create policy "spacestays read templates"
on public.mail_templates for select
to authenticated
using (public.is_spacestays_user());

drop policy if exists "spacestays write templates" on public.mail_templates;
create policy "spacestays write templates"
on public.mail_templates for all
to authenticated
using (public.is_spacestays_user())
with check (public.is_spacestays_user());

drop policy if exists "spacestays read mail queue" on public.mail_queue;
create policy "spacestays read mail queue"
on public.mail_queue for select
to authenticated
using (public.is_spacestays_user());

drop policy if exists "spacestays write mail queue" on public.mail_queue;
create policy "spacestays write mail queue"
on public.mail_queue for all
to authenticated
using (public.is_spacestays_user())
with check (public.is_spacestays_user());

drop policy if exists "spacestays read activity" on public.activity_log;
create policy "spacestays read activity"
on public.activity_log for select
to authenticated
using (public.is_spacestays_user());

drop policy if exists "spacestays write activity" on public.activity_log;
create policy "spacestays write activity"
on public.activity_log for insert
to authenticated
with check (public.is_spacestays_user());
