import { useParams } from "react-router-dom";
import { Circle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ClubCommunityLink } from "@/components/ClubCommunityLink";
import { JoinForm } from "@/components/JoinForm";
import { RegisteredList } from "@/components/RegisteredList";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useParticipants } from "@/hooks/useParticipants";
import { useRoom } from "@/hooks/useRoom";

export function JoinPage() {
  const { roomSlug } = useParams<{ roomSlug: string }>();
  const { state } = useRoom(roomSlug);
  const roomId = state.status === "ready" ? state.room.id : undefined;
  const { participants, loading: participantsLoading, reload } = useParticipants(roomId);

  return (
    <AppShell badge={roomSlug ? `/${roomSlug}` : undefined}>
      {state.status === "loading" && (
        <div className="mx-auto max-w-6xl animate-pulse rounded-3xl border border-white/8 bg-white/[0.02] py-16 text-center text-sm text-zinc-500">
          Cargando sala…
        </div>
      )}

      {state.status === "missing" && (
        <Card className="mx-auto max-w-lg">
          <CardContent className="py-12 text-center">
            <p className="text-lg text-white">Sala no encontrada</p>
            <p className="mt-2 text-zinc-400">
              Verifica el enlace o pide al organizador el slug correcto.
            </p>
          </CardContent>
        </Card>
      )}

      {state.status === "error" && (
        <Card className="mx-auto max-w-lg border-rose-500/30">
          <CardContent className="py-8 text-center text-rose-300">{state.message}</CardContent>
        </Card>
      )}

      {state.status === "ready" && (
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Registro al sorteo
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {state.room.name}
                </h1>
              </div>
              <ClubCommunityLink variant="cta" className="text-xs sm:text-sm" />
            </div>
            {state.room.is_active ? (
              <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">
                <span className="relative mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <Circle className="relative h-2 w-2 fill-emerald-400 text-emerald-400" aria-hidden />
                </span>
                Sala activa
              </Badge>
            ) : (
              <Badge variant="secondary">Sala cerrada</Badge>
            )}
          </header>

          {!state.room.is_active && (
            <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              Esta sala ya finalizó. Pide al organizador el enlace de la sala activa.
            </p>
          )}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] xl:items-start">
            <JoinForm
              room={state.room}
              participants={participants}
              onRegistered={() => void reload()}
            />
            <RegisteredList participants={participants} loading={participantsLoading} />
          </div>
        </div>
      )}
    </AppShell>
  );
}
