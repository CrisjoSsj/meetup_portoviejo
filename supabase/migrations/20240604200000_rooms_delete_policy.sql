-- Permitir eliminar salas y participantes (demo admin vía cliente anónimo)
create policy "participants_delete_anon"
  on public.participants for delete to anon using (true);

create policy "rooms_delete_anon"
  on public.rooms for delete to anon using (true);
