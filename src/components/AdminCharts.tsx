import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Participant } from "@/lib/types";

interface AdminChartsProps {
  participants: Participant[];
}

function buildNumberDistribution(participants: Participant[]) {
  const buckets = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10 + 1}-${(i + 1) * 10}`,
    count: 0,
  }));

  for (const p of participants) {
    const idx = Math.min(Math.floor((p.selected_number - 1) / 10), 9);
    buckets[idx].count += 1;
  }

  return buckets;
}

function buildTimeline(participants: Participant[]) {
  const byMinute = new Map<string, number>();

  for (const p of participants) {
    const d = new Date(p.created_at);
    d.setSeconds(0, 0);
    const key = d.toISOString();
    byMinute.set(key, (byMinute.get(key) ?? 0) + 1);
  }

  return [...byMinute.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([iso, count]) => ({
      time: new Intl.DateTimeFormat("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso)),
      count,
    }));
}

const tooltipStyle = {
  backgroundColor: "#0d1117",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#e2e8f0",
};

export function AdminCharts({ participants }: AdminChartsProps) {
  const distribution = buildNumberDistribution(participants);
  const timeline = buildTimeline(participants);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Distribución de números</CardTitle>
          <CardDescription>Participantes por decenas (1–100)</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="range" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Personas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registros en el tiempo</CardTitle>
          <CardDescription>Nuevos participantes por minuto</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {timeline.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-slate-500">
              Aún no hay registros
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={{ fill: "#818cf8", r: 4 }}
                  name="Registros"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
