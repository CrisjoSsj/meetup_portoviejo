import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  resetRoom,
  selectFinalists,
  selectWinners,
} from "@/lib/room-actions";
import { adminUrl } from "@/lib/utils";
import type { Room } from "@/lib/types";

interface DemoControlsProps {
  room: Room;
  onRoomChange: (room: Room) => void;
  onActionComplete: () => void;
}

export function DemoControls({ room, onRoomChange, onActionComplete }: DemoControlsProps) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);

  async function run(action: string, fn: () => Promise<number | Room>) {
    setBusy(action);
    try {
      const result = await fn();
      onActionComplete();

      if (typeof result === "number") {
        toast.success(`${result} fila(s) actualizada(s).`);
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
          Acciones para MCP + Cursor en vivo. Reiniciar crea una sala nueva sin borrar datos.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button
          disabled={busy !== null}
          onClick={() =>
            void run("finalists", () => selectFinalists(room.id))
          }
        >
          {busy === "finalists" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="h-4 w-4" aria-hidden />
          )}
          Seleccionar finalistas (≥70)
        </Button>

        <Button
          variant="secondary"
          disabled={busy !== null}
          onClick={() => void run("winners", () => selectWinners(room.id))}
        >
          {busy === "winners" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Trophy className="h-4 w-4" aria-hidden />
          )}
          Seleccionar 3 ganadores
        </Button>

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
