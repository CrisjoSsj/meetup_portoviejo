import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ClubCommunityLink } from "@/components/ClubCommunityLink";
import { RoomEntryCard } from "@/components/RoomEntryCard";
import { Card, CardContent } from "@/components/ui/card";
import { fetchRooms } from "@/lib/room-actions";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Room } from "@/lib/types";

export function HomePage() {
  const configured = isSupabaseConfigured();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeRooms = rooms.filter((r) => r.is_active);
  const sortedRooms = [...rooms].sort((a, b) => Number(b.is_active) - Number(a.is_active));

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    void fetchRooms()
      .then(setRooms)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "No se pudieron cargar las salas"),
      )
      .finally(() => setLoading(false));
  }, [configured]);

  return (
    <AppShell>
      <section className="mb-12 border-b border-white/[0.06] pb-10">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
          <Radio className="h-3 w-3 text-emerald-400/80" aria-hidden />
          Meetup en vivo · Portoviejo
        </p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Elige tu número y entra al sorteo
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
          Demo en vivo del meetup de Cursor: registro al instante y flujos con{" "}
          <span className="text-zinc-200">MCP</span> desde el editor.
        </p>
        <div className="mt-6">
          <ClubCommunityLink variant="cta" />
        </div>
      </section>

      {!configured && (
        <Card className="mb-8 border-amber-500/30">
          <CardContent className="p-6 text-amber-200">
            Configura <code className="text-zinc-300">VITE_SUPABASE_URL</code> y{" "}
            <code className="text-zinc-300">VITE_SUPABASE_ANON_KEY</code> (ver{" "}
            <code>env.sample</code>).
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="salas-titulo">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="salas-titulo" className="text-xl font-semibold text-white">
              Entra a la sala
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Escanea el código o continúa en este dispositivo
            </p>
          </div>
          {!loading && rooms.length > 0 && (
            <p className="text-sm tabular-nums text-zinc-500">
              {activeRooms.length} activa{activeRooms.length === 1 ? "" : "s"} de {rooms.length}
            </p>
          )}
        </div>

        {loading && (
          <div className="mx-auto max-w-3xl animate-pulse rounded-3xl border border-white/8 bg-white/[0.02] p-12">
            <p className="text-center text-sm text-zinc-500">Cargando salas…</p>
          </div>
        )}

        {error && (
          <Card className="mx-auto max-w-3xl border-rose-500/30">
            <CardContent className="py-6 text-rose-300">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && rooms.length === 0 && configured && (
          <Card className="mx-auto max-w-3xl">
            <CardContent className="py-8 text-center text-zinc-500">
              No hay salas todavía.
            </CardContent>
          </Card>
        )}

        {!loading && !error && rooms.length > 0 && (
          <ul className="mx-auto flex max-w-3xl flex-col gap-5">
            {sortedRooms.map((room) => (
              <li key={room.id}>
                <RoomEntryCard room={room} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
