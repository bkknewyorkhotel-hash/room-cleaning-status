import { createClient } from '@supabase/supabase-js';
import { Room } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Initial seed rooms including 101-105, 201-210, 301-310, 401-410 (Total 35 rooms)
export const INITIAL_ROOMS: Room[] = [
  // ชั้น 1 (101-105)
  { id: 'room-101', room_number: '101', status: 'DIRTY', updated_at: new Date(Date.now() - 3600000).toISOString(), active: true, sort_order: 1 },
  { id: 'room-102', room_number: '102', status: 'CLEAN', updated_at: new Date(Date.now() - 1800000).toISOString(), active: true, sort_order: 2 },
  { id: 'room-103', room_number: '103', status: 'DIRTY', updated_at: new Date(Date.now() - 7200000).toISOString(), active: true, sort_order: 3 },
  { id: 'room-104', room_number: '104', status: 'CLEAN', updated_at: new Date(Date.now() - 5400000).toISOString(), active: true, sort_order: 4 },
  { id: 'room-105', room_number: '105', status: 'CLEAN', updated_at: new Date(Date.now() - 900000).toISOString(), active: true, sort_order: 5 },

  // ชั้น 2 (201-210)
  { id: 'room-201', room_number: '201', status: 'CLEAN', updated_at: new Date(Date.now() - 4200000).toISOString(), active: true, sort_order: 6 },
  { id: 'room-202', room_number: '202', status: 'DIRTY', updated_at: new Date(Date.now() - 600000).toISOString(), active: true, sort_order: 7 },
  { id: 'room-203', room_number: '203', status: 'CLEAN', updated_at: new Date(Date.now() - 12000000).toISOString(), active: true, sort_order: 8 },
  { id: 'room-204', room_number: '204', status: 'DIRTY', updated_at: new Date(Date.now() - 300000).toISOString(), active: true, sort_order: 9 },
  { id: 'room-205', room_number: '205', status: 'DIRTY', updated_at: new Date(Date.now() - 1500000).toISOString(), active: true, sort_order: 10 },
  { id: 'room-206', room_number: '206', status: 'CLEAN', updated_at: new Date(Date.now() - 2500000).toISOString(), active: true, sort_order: 11 },
  { id: 'room-207', room_number: '207', status: 'DIRTY', updated_at: new Date(Date.now() - 1100000).toISOString(), active: true, sort_order: 12 },
  { id: 'room-208', room_number: '208', status: 'CLEAN', updated_at: new Date(Date.now() - 3200000).toISOString(), active: true, sort_order: 13 },
  { id: 'room-209', room_number: '209', status: 'DIRTY', updated_at: new Date(Date.now() - 400000).toISOString(), active: true, sort_order: 14 },
  { id: 'room-210', room_number: '210', status: 'CLEAN', updated_at: new Date(Date.now() - 1800000).toISOString(), active: true, sort_order: 15 },

  // ชั้น 3 (301-310)
  { id: 'room-301', room_number: '301', status: 'CLEAN', updated_at: new Date(Date.now() - 8000000).toISOString(), active: true, sort_order: 16 },
  { id: 'room-302', room_number: '302', status: 'CLEAN', updated_at: new Date(Date.now() - 6400000).toISOString(), active: true, sort_order: 17 },
  { id: 'room-303', room_number: '303', status: 'DIRTY', updated_at: new Date(Date.now() - 4500000).toISOString(), active: true, sort_order: 18 },
  { id: 'room-304', room_number: '304', status: 'CLEAN', updated_at: new Date(Date.now() - 2100000).toISOString(), active: true, sort_order: 19 },
  { id: 'room-305', room_number: '305', status: 'CLEAN', updated_at: new Date(Date.now() - 1100000).toISOString(), active: true, sort_order: 20 },
  { id: 'room-306', room_number: '306', status: 'DIRTY', updated_at: new Date(Date.now() - 3500000).toISOString(), active: true, sort_order: 21 },
  { id: 'room-307', room_number: '307', status: 'CLEAN', updated_at: new Date(Date.now() - 2900000).toISOString(), active: true, sort_order: 22 },
  { id: 'room-308', room_number: '308', status: 'DIRTY', updated_at: new Date(Date.now() - 1900000).toISOString(), active: true, sort_order: 23 },
  { id: 'room-309', room_number: '309', status: 'CLEAN', updated_at: new Date(Date.now() - 4800000).toISOString(), active: true, sort_order: 24 },
  { id: 'room-310', room_number: '310', status: 'CLEAN', updated_at: new Date(Date.now() - 700000).toISOString(), active: true, sort_order: 25 },

  // ชั้น 4 (401-410)
  { id: 'room-401', room_number: '401', status: 'DIRTY', updated_at: new Date(Date.now() - 5000000).toISOString(), active: true, sort_order: 26 },
  { id: 'room-402', room_number: '402', status: 'CLEAN', updated_at: new Date(Date.now() - 3100000).toISOString(), active: true, sort_order: 27 },
  { id: 'room-403', room_number: '403', status: 'DIRTY', updated_at: new Date(Date.now() - 4200000).toISOString(), active: true, sort_order: 28 },
  { id: 'room-404', room_number: '404', status: 'CLEAN', updated_at: new Date(Date.now() - 1500000).toISOString(), active: true, sort_order: 29 },
  { id: 'room-405', room_number: '405', status: 'CLEAN', updated_at: new Date(Date.now() - 850000).toISOString(), active: true, sort_order: 30 },
  { id: 'room-406', room_number: '406', status: 'DIRTY', updated_at: new Date(Date.now() - 2200000).toISOString(), active: true, sort_order: 31 },
  { id: 'room-407', room_number: '407', status: 'CLEAN', updated_at: new Date(Date.now() - 1700000).toISOString(), active: true, sort_order: 32 },
  { id: 'room-408', room_number: '408', status: 'CLEAN', updated_at: new Date(Date.now() - 600000).toISOString(), active: true, sort_order: 33 },
  { id: 'room-409', room_number: '409', status: 'DIRTY', updated_at: new Date(Date.now() - 3900000).toISOString(), active: true, sort_order: 34 },
  { id: 'room-410', room_number: '410', status: 'CLEAN', updated_at: new Date(Date.now() - 1300000).toISOString(), active: true, sort_order: 35 },
];

const LOCAL_STORAGE_KEY = 'room_cleaning_status_rooms_v2';
const BROADCAST_CHANNEL_NAME = 'room_cleaning_status_channel';

export function getLocalRooms(): Room[] {
  if (typeof window === 'undefined') return INITIAL_ROOMS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ROOMS;
  } catch {
    return INITIAL_ROOMS;
  }
}

export function saveLocalRooms(rooms: Room[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms));
  } catch (error) {
    console.error('Error saving local rooms:', error);
  }
}

export function createBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  try {
    return new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch {
    return null;
  }
}
