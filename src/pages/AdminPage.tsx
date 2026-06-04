import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdminCharts } from "@/components/AdminCharts";
import { AdminStats } from "@/components/AdminStats";
import { DemoControls } from "@/components/DemoControls";
import { ParticipantsTable } from "@/components/ParticipantsTable";
import { QRPanel } from "@/components/QRPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { logout } from "@/lib/auth";
import { useParticipants } from "@/hooks/useParticipants";
import { useRoom } from "@/hooks/useRoom";

export function AdminPage() {
  const navigate = useNavigate();
  const { roomSlug } = useParams<{ roomSlug: string }>();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const { state, setRoom } = useRoom(roomSlug);
  const roomId = state.status === "ready" ? state.room.id : undefined;
  const { participants, stats, loading, reload } = useParticipants(roomId);

  return (
    <AppShell badge={roomSlug ? `Admin /${roomSlug}` : undefined}>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver a salas
          </Link>
        </Button>
      </div>

      {state.status === "loading" && (
        <p className="text-center text-slate-400">Cargando sala…</p>
      )}

      {state.status === "missing" && (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            Sala no encontrada.{" "}
            <Link to="/admin" className="text-sky-400 hover:underline">
              Volver al listado
            </Link>
          </CardContent>
        </Card>
      )}

      {state.status === "error" && (
        <Card className="border-rose-500/30">
          <CardContent className="py-8 text-center text-rose-300">{state.message}</CardContent>
        </Card>
      )}

      {state.status === "ready" && (
        <div className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{state.room.name}</h1>
              <p className="mt-1 font-mono text-sm text-slate-500">
                slug: {state.room.slug}
                {!state.room.is_active && (
                  <span className="ml-2 text-amber-400">(inactiva)</span>
                )}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden />
              Salir
            </Button>
          </div>

          <QRPanel roomSlug={state.room.slug} showEnter />

          <AdminStats stats={stats} />
          <DemoControls
            room={state.room}
            onRoomChange={setRoom}
            onActionComplete={() => void reload()}
          />
          <AdminCharts participants={participants} />
          <ParticipantsTable participants={participants} loading={loading} />
        </div>
      )}
    </AppShell>
  );
}
