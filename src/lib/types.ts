export type ParticipantStatus = "registered" | "finalist" | "winner";

export interface Room {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  is_active: boolean;
}

export interface Participant {
  id: string;
  room_id: string;
  name: string;
  email: string;
  selected_number: number;
  status: ParticipantStatus;
  created_at: string;
}

export interface RoomStats {
  registered: number;
  finalists: number;
  winners: number;
  total: number;
}
