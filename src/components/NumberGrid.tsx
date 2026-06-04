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
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 sm:text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-amber-600" aria-hidden />
          Finalista
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-emerald-600" aria-hidden />
          Ganador
        </span>
      </div>
      <div
        className="grid grid-cols-5 gap-2 rounded-xl border border-white/8 bg-black/30 p-2.5 touch-manipulation sm:grid-cols-8 sm:gap-1.5 sm:p-3 md:grid-cols-10 lg:max-h-none"
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
                "flex aspect-square min-h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-all active:scale-95 sm:min-h-0 sm:aspect-auto sm:h-9 sm:text-xs",
                isTaken && status && statusGridClass(status),
                isTaken && !status && "cursor-not-allowed bg-white/5 text-slate-600 line-through",
                !isTaken && !isSelected && "bg-white/5 text-slate-300 hover:bg-sky-500/20 hover:text-white",
                isSelected && "bg-sky-500 text-white shadow-lg shadow-sky-500/30 ring-2 ring-sky-400/50",
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
