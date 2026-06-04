import { useCallback, useEffect, useState } from "react";
import { fetchRoomBySlug } from "@/lib/room-actions";
import type { Room } from "@/lib/types";

type RoomState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; room: Room }
  | { status: "error"; message: string };

export function useRoom(slug: string | undefined) {
  const [state, setState] = useState<RoomState>({ status: "loading" });

  const reload = useCallback(async () => {
    if (!slug) {
      setState({ status: "missing" });
      return;
    }

    setState({ status: "loading" });
    try {
      const room = await fetchRoomBySlug(slug);
      if (!room) {
        setState({ status: "missing" });
        return;
      }
      setState({ status: "ready", room });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Error al cargar la sala",
      });
    }
  }, [slug]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { state, reload, setRoom: (room: Room) => setState({ status: "ready", room }) };
}
