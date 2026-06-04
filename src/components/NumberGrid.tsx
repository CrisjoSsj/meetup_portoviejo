import { cn } from "@/lib/utils";
import { statusGridClass } from "@/lib/participant-status";
import type { ParticipantStatus } from "@/lib/types";

interface NumberGridProps {
  /** Número ocupado → estado del participante */
  slotStatus: Map<number, ParticipantStatus>;
  selected: number | null;
  onSelect: (n: number) => void;
  disabled?: boolean;
}

export function NumberGrid({ slotStatus, selected, onSelect, disabled }: NumberGridProps) {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded bg-amber-600" aria-hidden />
          Finalista
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded bg-emerald-600" aria-hidden />
          Ganador
        </span>
      </div>
      <div
        className="grid max-h-[320px] grid-cols-10 gap-1.5 overflow-y-auto rounded-xl border border-white/8 bg-black/30 p-3 sm:max-h-none"
        role="listbox"
        aria-label="Selecciona tu número del 1 al 100"
      >
        {numbers.map((n) => {
          const status = slotStatus.get(n);
          const isTaken = status !== undefined;
          const isSelected = selected === n;

          return (
            <button
              key={n}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-label={
                isTaken
                  ? `Número ${n}, ${status === "winner" ? "ganador" : status === "finalist" ? "finalista" : "ocupado"}`
                  : `Número ${n}, disponible`
              }
              disabled={disabled || isTaken}
              onClick={() => onSelect(n)}
              className={cn(
                "flex h-8 items-center justify-center rounded-lg text-xs font-medium transition-all sm:h-9",
                isTaken && status && statusGridClass(status),
                isTaken && !status && "cursor-not-allowed bg-white/5 text-slate-600 line-through",
                !isTaken && !isSelected && "bg-white/5 text-slate-300 hover:bg-sky-500/20 hover:text-white",
                isSelected && "bg-sky-500 text-white shadow-lg shadow-sky-500/30",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
