import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { RoomForm, type RoomFormValues } from "@/components/RoomForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logout } from "@/lib/auth";
import {
  createRoom,
  deleteRoom,
  fetchRooms,
  updateRoom,
} from "@/lib/room-actions";
import type { Room } from "@/lib/types";

type FormMode = { type: "create" } | { type: "edit"; room: Room } | null;

export function AdminRoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cargar salas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  async function handleCreate(values: RoomFormValues) {
    try {
      const room = await createRoom({
        name: values.name,
        slug: values.slug,
        isActive: values.isActive,
      });
      toast.success(`Sala «${room.name}» creada.`);
      setFormMode(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear la sala");
      throw err;
    }
  }

  async function handleUpdate(room: Room, values: RoomFormValues) {
    try {
      const updated = await updateRoom(room.id, {
        name: values.name,
        slug: values.slug,
        isActive: values.isActive,
      });
      toast.success(`Sala «${updated.name}» actualizada.`);
      setFormMode(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar");
      throw err;
    }
  }

  async function handleDelete(room: Room) {
    const ok = window.confirm(
      `¿Eliminar la sala «${room.name}» y todos sus participantes? Esta acción no se puede deshacer.`,
    );
    if (!ok) return;

    try {
      await deleteRoom(room.id);
      toast.success(`Sala «${room.name}» eliminada.`);
      if (formMode?.type === "edit" && formMode.room.id === room.id) {
        setFormMode(null);
      }
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  }

  return (
    <AppShell badge="Admin · Salas">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de salas</h1>
          <p className="mt-2 text-slate-400">
            Crea, edita o elimina salas. Entra a cada una para ver QR, estadísticas y controles.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" aria-hidden />
          Salir
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          onClick={() => setFormMode(formMode?.type === "create" ? null : { type: "create" })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nueva sala
        </Button>
      </div>

      {formMode?.type === "create" && (
        <Card className="mb-8 border-sky-500/20">
          <CardHeader>
            <CardTitle>Crear sala</CardTitle>
            <CardDescription>Se publicará en la página principal si está activa.</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomForm
              submitLabel="Crear sala"
              onSubmit={handleCreate}
              onCancel={() => setFormMode(null)}
            />
          </CardContent>
        </Card>
      )}

      {formMode?.type === "edit" && (
        <Card className="mb-8 border-sky-500/20">
          <CardHeader>
            <CardTitle>Editar sala</CardTitle>
            <CardDescription>{formMode.room.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomForm
              initial={formMode.room}
              submitLabel="Guardar cambios"
              onSubmit={(values) => handleUpdate(formMode.room, values)}
              onCancel={() => setFormMode(null)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Salas</CardTitle>
          <CardDescription>
            {loading ? "Cargando…" : `${rooms.length} sala(s) registrada(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 && !loading ? (
            <p className="py-8 text-center text-slate-500">No hay salas. Crea la primera.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium text-white">{room.name}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">
                      {room.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant={room.is_active ? "default" : "secondary"}>
                        {room.is_active ? "Activa" : "Cerrada"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button asChild size="sm" variant="default">
                          <Link to={`/admin/${room.slug}`}>
                            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
                            Gestionar
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setFormMode({ type: "edit", room })}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => void handleDelete(room)}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
