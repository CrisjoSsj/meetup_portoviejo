import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { NumberGrid } from "@/components/NumberGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerParticipant } from "@/lib/room-actions";
import type { Participant, Room } from "@/lib/types";

interface JoinFormProps {
  room: Room;
  participants: Participant[];
  onRegistered: () => void;
}

const panelClass =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#14141c] via-[#0f0f14] to-[#0a0a0c] shadow-2xl shadow-black/50";

export function JoinForm({ room, participants, onRegistered }: JoinFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const takenCount = participants.length;

  const slotStatus = useMemo(() => {
    const map = new Map<number, Participant["status"]>();
    for (const p of participants) {
      map.set(p.selected_number, p.status);
    }
    return map;
  }, [participants]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!room.is_active) {
      toast.error("Esta sala ya no acepta registros.");
      return;
    }

    if (!name.trim() || !email.trim()) {
      toast.error("Completa nombre y correo.");
      return;
    }
    if (selected === null) {
      toast.error("Elige un número del 1 al 100.");
      return;
    }

    setLoading(true);
    const result = await registerParticipant({
      roomId: room.id,
      name,
      email,
      selectedNumber: selected,
    });
    setLoading(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    setSuccess(true);
    onRegistered();
    toast.success("¡Registro exitoso!");
  }

  if (success) {
    return (
      <article className={`${panelClass} border-emerald-500/25`}>
        <div
          className="pointer-events-none absolute -right-12 top-0 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col items-center gap-5 px-6 py-16 text-center sm:px-10">
          <div className="rounded-full bg-emerald-500/15 p-4 ring-1 ring-emerald-500/30">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" aria-hidden />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">¡Estás dentro!</h2>
            <p className="mt-3 max-w-sm text-zinc-400">
              Tu número{" "}
              <span className="font-mono text-lg font-semibold text-emerald-300">{selected}</span>{" "}
              quedó reservado en{" "}
              <span className="font-medium text-white">{room.name}</span>.
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={panelClass}>
      <div
        className="pointer-events-none absolute -left-20 top-1/3 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 -top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2 text-sky-400/90">
              <Sparkles className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Tu turno
              </span>
            </div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Completa tu registro
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
              Elige un número libre del 1 al 100. Cada correo solo puede registrarse una vez en
              esta sala.
            </p>
          </div>
          <p className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/8 bg-black/30 px-3 py-2 text-xs tabular-nums text-zinc-500 sm:flex-col sm:items-end sm:gap-0 sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-zinc-600 sm:block">
              Ocupados
            </span>
            <span>
              <span className="text-lg font-semibold text-zinc-300">{takenCount}</span>
              <span className="text-zinc-600"> / 100</span>
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                required
                minLength={2}
                disabled={loading}
                className="h-11 rounded-xl border-white/10 bg-black/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Correo
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
                disabled={loading}
                className="h-11 rounded-xl border-white/10 bg-black/40"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-black/20 p-3 sm:p-5">
            <Label className="text-zinc-300">Tu número (1–100)</Label>
            {selected !== null && (
              <p className="text-sm text-zinc-400 sm:hidden">
                Seleccionado:{" "}
                <span className="font-mono font-semibold text-sky-300">{selected}</span>
              </p>
            )}
            <NumberGrid
              slotStatus={slotStatus}
              selected={selected}
              onSelect={setSelected}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full rounded-xl bg-white text-base font-semibold text-black shadow-lg shadow-white/5 hover:bg-zinc-100 disabled:opacity-50"
            disabled={loading || !room.is_active}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Registrando…
              </>
            ) : (
              "Confirmar registro"
            )}
          </Button>
        </form>
      </div>
    </article>
  );
}
