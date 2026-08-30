export type RoomStatus = 'DIRTY' | 'CLEAN';

export type UserRole = 'VIEWER' | 'STAFF' | 'ADMIN';

export interface Room {
  id: string;
  room_number: string;
  status: RoomStatus;
  updated_at: string;
  updated_by?: string | null;
  active: boolean;
  sort_order: number;
}

export type FilterStatus = 'ALL' | 'DIRTY' | 'CLEAN';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
