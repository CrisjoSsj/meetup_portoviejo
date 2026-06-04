-- Meetup demo: salas (rooms) y participantes por sala
-- Ejecutar en Supabase SQL Editor o vía MCP execute_sql

create type public.participant_status as enum ('registered', 'finalist', 'winner');

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete restrict,
  name text not null check (char_length(trim(name)) >= 2),
  email text not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  selected_number int not null check (selected_number between 1 and 100),
  status public.participant_status not null default 'registered',
  created_at timestamptz not null default now(),
  unique (room_id, email),
  unique (room_id, selected_number)
);

create index if not exists participants_room_id_idx on public.participants (room_id);
create index if not exists participants_room_created_idx on public.participants (room_id, created_at desc);
create index if not exists rooms_slug_idx on public.rooms (slug);
create index if not exists rooms_active_idx on public.rooms (is_active) where is_active = true;

alter table public.rooms enable row level security;
alter table public.participants enable row level security;

-- Demo meetup: acceso anónimo (NO usar en producción sin endurecer)
create policy "rooms_select_anon"
  on public.rooms for select to anon using (true);

create policy "rooms_insert_anon"
  on public.rooms for insert to anon with check (true);

create policy "rooms_update_anon"
  on public.rooms for update to anon using (true) with check (true);

create policy "participants_select_anon"
  on public.participants for select to anon using (true);

create policy "participants_insert_anon"
  on public.participants for insert to anon with check (true);

create policy "participants_update_anon"
  on public.participants for update to anon using (true) with check (true);

-- Realtime para dashboard en vivo
alter publication supabase_realtime add table public.participants;

-- Sala inicial para QR y pruebas
insert into public.rooms (name, slug, is_active)
values ('Meetup Portoviejo', 'demo', true)
on conflict (slug) do nothing;
