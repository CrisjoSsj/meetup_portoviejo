import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import type { Participant, ParticipantStatus } from "@/lib/types";

interface ParticipantsTableProps {
  participants: Participant[];
  loading?: boolean;
}

const statusLabels: Record<ParticipantStatus, string> = {
  registered: "Registrado",
  finalist: "Finalista",
  winner: "Ganador",
};

const statusVariant: Record<
  ParticipantStatus,
  "default" | "finalist" | "winner"
> = {
  registered: "default",
  finalist: "finalist",
  winner: "winner",
};

export function ParticipantsTable({ participants, loading }: ParticipantsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Participantes en vivo</CardTitle>
        <CardDescription>
          Actualización automática vía Supabase Realtime
          {loading && " · sincronizando…"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {participants.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Nadie se ha registrado todavía. Comparte el QR.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-white">{p.name}</TableCell>
                  <TableCell className="text-slate-400">{p.email}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sky-300">{p.selected_number}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status]}>
                      {statusLabels[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {formatDateTime(p.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
