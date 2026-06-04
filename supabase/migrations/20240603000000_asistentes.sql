-- Ejecutar en Supabase (SQL Editor o MCP execute_sql) antes del deploy

create table if not exists public.asistentes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(trim(nombre)) >= 2),
  email text not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  created_at timestamptz not null default now()
);

create index if not exists asistentes_created_at_idx on public.asistentes (created_at desc);

alter table public.asistentes enable row level security;

-- Demo: registro público sin auth (solo para meetup / prototipo)
create policy "asistentes_insert_anon"
  on public.asistentes
  for insert
  to anon
  with check (true);

create policy "asistentes_select_anon"
  on public.asistentes
  for select
  to anon
  using (true);
