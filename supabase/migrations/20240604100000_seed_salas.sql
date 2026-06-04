-- Salas adicionales para la página principal
insert into public.rooms (name, slug, is_active)
values
  ('Demo Cursor + MCP', 'cursor-mcp', true),
  ('Demo Supabase Realtime', 'supabase-live', true),
  ('Taller IA en vivo', 'taller-ia', true)
on conflict (slug) do nothing;
