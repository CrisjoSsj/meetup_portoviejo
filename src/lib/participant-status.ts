import type { ParticipantStatus } from "@/lib/types";

export const statusLabels: Record<ParticipantStatus, string> = {
  registered: "Registrado",
  finalist: "Finalista",
  winner: "Ganador",
};

export function statusRowClass(status: ParticipantStatus): string {
  switch (status) {
    case "winner":
      return "border-emerald-500/40 bg-emerald-500/15";
    case "finalist":
      return "border-amber-500/40 bg-amber-500/15";
    default:
      return "border-white/5 bg-white/[0.02]";
  }
}

export function statusNumberClass(status: ParticipantStatus): string {
  switch (status) {
    case "winner":
      return "bg-emerald-500 text-white shadow-md shadow-emerald-500/30";
    case "finalist":
      return "bg-amber-500 text-white shadow-md shadow-amber-500/30";
    default:
      return "bg-white/10 text-sky-200";
  }
}

export function statusGridClass(status: ParticipantStatus): string {
  switch (status) {
    case "winner":
      return "cursor-not-allowed bg-emerald-600 text-white ring-1 ring-emerald-400/50";
    case "finalist":
      return "cursor-not-allowed bg-amber-600 text-white ring-1 ring-amber-400/50";
    default:
      return "cursor-not-allowed bg-white/5 text-slate-600 line-through";
  }
}
