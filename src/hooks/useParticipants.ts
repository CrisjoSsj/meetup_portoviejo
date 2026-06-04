import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { fetchParticipants } from "@/lib/room-actions";
import type { Participant, RoomStats } from "@/lib/types";

function computeStats(participants: Participant[]): RoomStats {
  let registered = 0;
  let finalists = 0;
  let winners = 0;

  for (const p of participants) {
    if (p.status === "registered") registered += 1;
    if (p.status === "finalist") finalists += 1;
    if (p.status === "winner") winners += 1;
  }

  return {
    registered,
    finalists,
    winners,
    total: participants.length,
  };
}

export function useParticipants(roomId: string | undefined) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchParticipants(roomId);
      setParticipants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar participantes");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!roomId) return;

    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel(`participants:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          void reload();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [roomId, reload]);

  const stats = useMemo(() => computeStats(participants), [participants]);

  const takenNumbers = useMemo(
    () => new Set(participants.map((p) => p.selected_number)),
    [participants],
  );

  return {
    participants,
    stats,
    takenNumbers,
    loading,
    error,
    reload,
  };
}
