import { Trophy, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RoomStats } from "@/lib/types";

interface AdminStatsProps {
  stats: RoomStats;
}

const items = [
  { key: "registered" as const, label: "Registrados", icon: Users, color: "text-sky-400" },
  { key: "finalists" as const, label: "Finalistas", icon: Zap, color: "text-amber-400" },
  { key: "winners" as const, label: "Ganadores", icon: Trophy, color: "text-emerald-400" },
];

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-xl bg-white/5 p-3 ${color}`}>
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums text-white">{stats[key]}</p>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
