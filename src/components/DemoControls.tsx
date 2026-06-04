import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, RefreshCw, Sparkles, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEMO_FUNNEL,
  resetRoom,
  selectRound1,
  selectRound2,
  selectRound3,
  selectWinners,
} from "@/lib/room-actions";
import { adminUrl } from "@/lib/utils";
import type { Room, RoomStats } from "@/lib/types";

interface DemoControlsProps {
  room: Room;
  stats: RoomStats;
  onRoomChange: (room: Room) => void;
  onActionComplete: () => void;
}

export function DemoControls({ room, stats, onRoomChange, onActionComplete }: DemoControlsProps) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);

  const round1Done = stats.finalists > 0 || stats.winners > 0;

  async function run(action: string, fn: () => Promise<number | Room>) {
    setBusy(action);
    try {
      const result = await fn();
      onActionComplete();

      if (typeof result === "number") {
        if (result === 0) {
          toast.message("No había participantes elegibles en esta ronda.");
        } else {
          toast.success(`${result} participante(s) en esta ronda.`);
        }
      } else {
        toast.success(`Nueva sala: ${result.slug}`);
        onRoomChange(result);
        navigate(adminUrl(result.slug), { replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error en la acción");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card className="border-sky-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sky-400" aria-hidden />
          Panel de control — demo
        </CardTitle>
        <CardDescription>
          Embudo al azar: registrados → {DEMO_FUNNEL.round1} → {DEMO_FUNNEL.round2} →{" "}
          {DEMO_FUNNEL.round3} → {DEMO_FUNNEL.winners} ganador. Ideal para explicar Cursor MCP en
          vivo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/8 bg-black/25 px-3 py-3 text-xs text-zinc-400 sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1 font-medium text-zinc-200">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {stats.registered} registrados
          </span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden />
          <span className="rounded-lg bg-amber-500/10 px-2 py-1 font-medium text-amber-200">
            {stats.finalists} finalistas
          </span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden />
          <span className="rounded-lg bg-emerald-500/10 px-2 py-1 font-medium text-emerald-200">
            {stats.winners} ganador{stats.winners === 1 ? "" : "es"}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Ronda 1
            </p>
            <p className="text-sm text-zinc-300">
              Elige <span className="font-semibold text-white">{DEMO_FUNNEL.round1}</span> al azar
              entre registrados
            </p>
            <Button
              className="w-full"
              disabled={busy !== null || stats.registered === 0 || round1Done}
              onClick={() => void run("round1", () => selectRound1(room.id))}
            >
              {busy === "round1" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden />
              )}
              {DEMO_FUNNEL.round1} al azar
            </Button>
          </div>

          <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Ronda 2
            </p>
            <p className="text-sm text-zinc-300">
              Conserva <span className="font-semibold text-white">{DEMO_FUNNEL.round2}</span>{" "}
              finalistas al azar
            </p>
            <Button
              className="w-full"
              variant="secondary"
              disabled={
                busy !== null ||
                stats.finalists === 0 ||
                stats.finalists <= DEMO_FUNNEL.round2 ||
                stats.winners > 0
              }
              onClick={() => void run("round2", () => selectRound2(room.id))}
            >
              {busy === "round2" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Users className="h-4 w-4" aria-hidden />
              )}
              {DEMO_FUNNEL.round2} al azar
            </Button>
          </div>

          <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Ronda 3
            </p>
            <p className="text-sm text-zinc-300">
              Conserva <span className="font-semibold text-white">{DEMO_FUNNEL.round3}</span>{" "}
              finalistas al azar
            </p>
            <Button
              className="w-full"
              variant="secondary"
              disabled={
                busy !== null ||
                stats.finalists === 0 ||
                stats.finalists <= DEMO_FUNNEL.round3 ||
                stats.winners > 0
              }
              onClick={() => void run("round3", () => selectRound3(room.id))}
            >
              {busy === "round3" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Users className="h-4 w-4" aria-hidden />
              )}
              {DEMO_FUNNEL.round3} al azar
            </Button>
          </div>

          <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Ronda 4
            </p>
            <p className="text-sm text-zinc-300">
              <span className="font-semibold text-white">{DEMO_FUNNEL.winners}</span> ganador al azar
              entre finalistas
            </p>
            <Button
              className="w-full"
              variant="secondary"
              disabled={busy !== null || stats.finalists === 0 || stats.winners > 0}
              onClick={() => void run("winners", () => selectWinners(room.id))}
            >
              {busy === "winners" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Trophy className="h-4 w-4" aria-hidden />
              )}
              1 ganador
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          disabled={busy !== null}
          onClick={() => void run("reset", () => resetRoom(room))}
        >
          {busy === "reset" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden />
          )}
          Reiniciar sala
        </Button>
      </CardContent>
    </Card>
  );
}
