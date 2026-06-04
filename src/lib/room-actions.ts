import { getSupabase } from "@/lib/supabase";
import type { Participant, Room } from "@/lib/types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugifyBase(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24) || "sala";
}

export async function fetchRooms(): Promise<Room[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Room[];
}

export async function fetchRoomBySlug(slug: string): Promise<Room | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as Room | null;
}

export async function fetchParticipants(roomId: string): Promise<Participant[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Participant[];
}

export async function fetchTakenNumbers(roomId: string): Promise<Set<number>> {
  const supabase = getSupabase();
  if (!supabase) return new Set();

  const { data, error } = await supabase
    .from("participants")
    .select("selected_number")
    .eq("room_id", roomId);

  if (error) throw error;
  return new Set((data ?? []).map((r) => r.selected_number as number));
}

export async function registerParticipant(input: {
  roomId: string;
  name: string;
  email: string;
  selectedNumber: number;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, message: "Supabase no configurado." };
  }

  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  const { data: existingEmail } = await supabase
    .from("participants")
    .select("id")
    .eq("room_id", input.roomId)
    .eq("email", email)
    .maybeSingle();

  if (existingEmail) {
    return {
      ok: false,
      message: "Este correo ya está registrado en esta sala.",
    };
  }

  const { data: existingNumber } = await supabase
    .from("participants")
    .select("id")
    .eq("room_id", input.roomId)
    .eq("selected_number", input.selectedNumber)
    .maybeSingle();

  if (existingNumber) {
    return {
      ok: false,
      message: `El número ${input.selectedNumber} ya fue elegido.`,
    };
  }

  const { error } = await supabase.from("participants").insert({
    room_id: input.roomId,
    name,
    email,
    selected_number: input.selectedNumber,
    status: "registered",
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        message: "Correo o número ya registrado en esta sala.",
      };
    }
    return { ok: false, message: error.message };
  }

  return { ok: true };
}

/** Tamaños del embudo demo en vivo (100 → 50 → 25 → 10 → 3). */
export const DEMO_FUNNEL = {
  round1: 50,
  round2: 25,
  round3: 10,
  winners: 3,
} as const;

function shuffleIds<T extends { id: string }>(items: T[]): string[] {
  return [...items].sort(() => Math.random() - 0.5).map((item) => item.id);
}

/** De los finalistas, conserva al azar hasta N; el resto vuelve a registrado. */
async function narrowFinalists(roomId: string, keepCount: number): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase no configurado");

  const { data: pool, error: fetchError } = await supabase
    .from("participants")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "finalist");

  if (fetchError) throw fetchError;
  if (!pool?.length) return 0;

  const shuffled = shuffleIds(pool);
  const kept = Math.min(keepCount, shuffled.length);
  const demoteIds = shuffled.slice(kept);

  if (demoteIds.length > 0) {
    const { error: demoteError } = await supabase
      .from("participants")
      .update({ status: "registered" })
      .in("id", demoteIds);

    if (demoteError) throw demoteError;
  }

  return kept;
}

/** Ronda 1: elige al azar hasta N registrados y los pasa a finalista. */
export async function selectRound1(roomId: string): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase no configurado");

  const { data: pool, error: fetchError } = await supabase
    .from("participants")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "registered");

  if (fetchError) throw fetchError;
  if (!pool?.length) return 0;

  const selectedIds = shuffleIds(pool).slice(0, Math.min(DEMO_FUNNEL.round1, pool.length));

  const { data, error } = await supabase
    .from("participants")
    .update({ status: "finalist" })
    .in("id", selectedIds)
    .select("id");

  if (error) throw error;
  return data?.length ?? 0;
}

/** Ronda 2: de los finalistas, conserva al azar hasta N; el resto vuelve a registrado. */
export async function selectRound2(roomId: string): Promise<number> {
  return narrowFinalists(roomId, DEMO_FUNNEL.round2);
}

/** Ronda 3: estrecha otra vez el grupo de finalistas. */
export async function selectRound3(roomId: string): Promise<number> {
  return narrowFinalists(roomId, DEMO_FUNNEL.round3);
}

export async function selectWinners(roomId: string): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase no configurado");

  const { data: finalists, error: fetchError } = await supabase
    .from("participants")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "finalist");

  if (fetchError) throw fetchError;
  if (!finalists?.length) return 0;

  const winnerIds = shuffleIds(finalists).slice(
    0,
    Math.min(DEMO_FUNNEL.winners, finalists.length),
  );

  const { data, error } = await supabase
    .from("participants")
    .update({ status: "winner" })
    .in("id", winnerIds)
    .select("id");

  if (error) throw error;
  return data?.length ?? 0;
}

export async function createRoom(input: {
  name: string;
  slug?: string;
  isActive?: boolean;
}): Promise<Room> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase no configurado");

  const name = input.name.trim();
  const slug = (input.slug?.trim() || slugifyBase(name)).toLowerCase();

  if (!SLUG_PATTERN.test(slug)) {
    throw new Error("El slug solo puede tener letras minúsculas, números y guiones.");
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name,
      slug,
      is_active: input.isActive ?? true,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe una sala con ese slug.");
    }
    throw error;
  }

  return data as Room;
}

export async function updateRoom(
  id: string,
  input: { name?: string; slug?: string; isActive?: boolean },
): Promise<Room> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase no configurado");

  const patch: Record<string, string | boolean> = {};

  if (input.name !== undefined) {
    patch.name = input.name.trim();
  }
  if (input.slug !== undefined) {
    const slug = input.slug.trim().toLowerCase();
    if (!SLUG_PATTERN.test(slug)) {
      throw new Error("El slug solo puede tener letras minúsculas, números y guiones.");
    }
    patch.slug = slug;
  }
  if (input.isActive !== undefined) {
    patch.is_active = input.isActive;
  }

  const { data, error } = await supabase
    .from("rooms")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe una sala con ese slug.");
    }
    throw error;
  }

  return data as Room;
}

export async function deleteRoom(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase no configurado");

  const { error: participantsError } = await supabase
    .from("participants")
    .delete()
    .eq("room_id", id);

  if (participantsError) throw participantsError;

  const { error: roomError } = await supabase.from("rooms").delete().eq("id", id);

  if (roomError) throw roomError;
}

export async function resetRoom(currentRoom: Room): Promise<Room> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase no configurado");

  const { error: deactivateError } = await supabase
    .from("rooms")
    .update({ is_active: false })
    .eq("id", currentRoom.id);

  if (deactivateError) throw deactivateError;

  const suffix = Date.now().toString(36);
  const base = slugifyBase(currentRoom.name);
  const newSlug = `${base}-${suffix}`;

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name: currentRoom.name,
      slug: newSlug,
      is_active: true,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Room;
}
