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

// Initial seed rooms as requested in specification
export const INITIAL_ROOMS: Room[] = [
  { id: 'room-101', room_number: '101', status: 'DIRTY', updated_at: new Date(Date.now() - 3600000).toISOString(), active: true, sort_order: 1 },
  { id: 'room-102', room_number: '102', status: 'CLEAN', updated_at: new Date(Date.now() - 1800000).toISOString(), active: true, sort_order: 2 },
  { id: 'room-103', room_number: '103', status: 'DIRTY', updated_at: new Date(Date.now() - 7200000).toISOString(), active: true, sort_order: 3 },
  { id: 'room-104', room_number: '104', status: 'CLEAN', updated_at: new Date(Date.now() - 5400000).toISOString(), active: true, sort_order: 4 },
  { id: 'room-105', room_number: '105', status: 'CLEAN', updated_at: new Date(Date.now() - 900000).toISOString(), active: true, sort_order: 5 },

  { id: 'room-201', room_number: '201', status: 'CLEAN', updated_at: new Date(Date.now() - 4200000).toISOString(), active: true, sort_order: 6 },
  { id: 'room-202', room_number: '202', status: 'DIRTY', updated_at: new Date(Date.now() - 600000).toISOString(), active: true, sort_order: 7 },
  { id: 'room-203', room_number: '203', status: 'CLEAN', updated_at: new Date(Date.now() - 12000000).toISOString(), active: true, sort_order: 8 },
  { id: 'room-204', room_number: '204', status: 'DIRTY', updated_at: new Date(Date.now() - 300000).toISOString(), active: true, sort_order: 9 },
  { id: 'room-205', room_number: '205', status: 'DIRTY', updated_at: new Date(Date.now() - 1500000).toISOString(), active: true, sort_order: 10 },

  { id: 'room-301', room_number: '301', status: 'CLEAN', updated_at: new Date(Date.now() - 8000000).toISOString(), active: true, sort_order: 11 },
  { id: 'room-302', room_number: '302', status: 'CLEAN', updated_at: new Date(Date.now() - 6400000).toISOString(), active: true, sort_order: 12 },
  { id: 'room-303', room_number: '303', status: 'DIRTY', updated_at: new Date(Date.now() - 4500000).toISOString(), active: true, sort_order: 13 },
  { id: 'room-304', room_number: '304', status: 'CLEAN', updated_at: new Date(Date.now() - 2100000).toISOString(), active: true, sort_order: 14 },
  { id: 'room-305', room_number: '305', status: 'CLEAN', updated_at: new Date(Date.now() - 1100000).toISOString(), active: true, sort_order: 15 },
];

const LOCAL_STORAGE_KEY = 'room_cleaning_status_rooms_v1';
const BROADCAST_CHANNEL_NAME = 'room_cleaning_status_channel';

export function getLocalRooms(): Room[] {
  if (typeof window === 'undefined') return INITIAL_ROOMS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    return JSON.parse(data);
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
