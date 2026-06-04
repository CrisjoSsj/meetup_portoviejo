import { useMemo } from "react";
import { Trophy, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusLabels, statusNumberClass, statusRowClass } from "@/lib/participant-status";
import type { Participant, ParticipantStatus } from "@/lib/types";

interface RegisteredListProps {
  participants: Participant[];
  loading?: boolean;
  className?: string;
}

const statusBadgeVariant: Record<
  ParticipantStatus,
  "default" | "finalist" | "winner"
> = {
  registered: "default",
  finalist: "finalist",
  winner: "winner",
};

const listViewportHeight = "calc((2.75rem + 0.375rem) * 10)";

export function RegisteredList({ participants, loading, className }: RegisteredListProps) {
  const ordered = useMemo(
    () => [...participants].sort((a, b) => a.selected_number - b.selected_number),
    [participants],
  );

  const counts = useMemo(() => {
    let finalists = 0;
    let winners = 0;
    for (const p of participants) {
      if (p.status === "finalist") finalists += 1;
      if (p.status === "winner") winners += 1;
    }
    return { finalists, winners };
  }, [participants]);

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#12121a] to-[#0a0a0c] shadow-xl shadow-black/40 xl:sticky xl:top-6",
        className,
      )}
      aria-labelledby="registrados-titulo"
    >
      <div className="shrink-0 border-b border-white/[0.06] px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-500/25">
            <Users className="h-4 w-4 text-sky-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="registrados-titulo" className="text-base font-semibold text-white">
              Registrados
            </h2>
            <p className="text-xs text-zinc-500">Del 1 al 100</p>
          </div>
          {!loading && (
            <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-sm font-semibold tabular-nums text-sky-300 ring-1 ring-sky-500/20">
              {ordered.length}
            </span>
          )}
        </div>

        {!loading && (counts.finalists > 0 || counts.winners > 0) && (
          <div className="mt-3 flex flex-wrap gap-3">
            {counts.finalists > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2 py-1 text-xs text-amber-300 ring-1 ring-amber-500/20">
                <Zap className="h-3 w-3" aria-hidden />
                {counts.finalists} finalistas
              </span>
            )}
            {counts.winners > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
                <Trophy className="h-3 w-3" aria-hidden />
                {counts.winners} ganadores
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
        style={{ maxHeight: ordered.length > 0 ? listViewportHeight : undefined }}
      >
        {loading && (
          <p className="py-8 text-center text-sm text-zinc-500">Cargando…</p>
        )}

        {!loading && ordered.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500">
            Aún no hay registros.
            <br />
            <span className="text-zinc-600">¡Sé el primero!</span>
          </p>
        )}

        {!loading && ordered.length > 0 && (
          <ul className="space-y-1.5" aria-live="polite" aria-label="Lista de registrados por número">
            {ordered.map((p) => (
              <li
                key={p.id}
                className={`flex h-11 shrink-0 items-center gap-2 rounded-xl border px-3 transition-colors ${statusRowClass(p.status)}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ${statusNumberClass(p.status)}`}
                >
                  {p.selected_number}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                  {p.name}
                </span>
                {p.status !== "registered" && (
                  <Badge variant={statusBadgeVariant[p.status]} className="shrink-0 text-[10px]">
                    {statusLabels[p.status]}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
