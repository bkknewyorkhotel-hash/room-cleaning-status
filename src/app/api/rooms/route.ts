import { NextResponse } from 'next/server';
import { Room } from '@/lib/types';

// Global shared room state in server memory across API requests
const INITIAL_ROOMS: Room[] = [
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

declare global {
  // eslint-disable-next-line no-var
  var _sharedRooms: Room[] | undefined;
}

if (!globalThis._sharedRooms) {
  globalThis._sharedRooms = INITIAL_ROOMS;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    rooms: globalThis._sharedRooms || INITIAL_ROOMS,
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, roomId, status, staffName, roomNumber, updates } = body;

    let rooms = globalThis._sharedRooms || INITIAL_ROOMS;

    if (action === 'UPDATE_STATUS') {
      const nowIso = new Date().toISOString();
      rooms = rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status,
              updated_at: nowIso,
              updated_by: staffName || 'พนักงาน',
            }
          : r
      );
    } else if (action === 'ADD_ROOM') {
      const newRoom: Room = {
        id: `room-${roomNumber}-${Date.now()}`,
        room_number: roomNumber,
        status: 'DIRTY',
        updated_at: new Date().toISOString(),
        active: true,
        sort_order: Date.now(),
      };
      rooms = [...rooms, newRoom];
    } else if (action === 'EDIT_ROOM') {
      rooms = rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r));
    } else if (action === 'RESET') {
      rooms = INITIAL_ROOMS;
    }

    globalThis._sharedRooms = rooms;

    return NextResponse.json({
      success: true,
      rooms,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
