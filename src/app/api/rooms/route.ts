import { NextResponse } from 'next/server';
import { Room } from '@/lib/types';

import { INITIAL_ROOMS } from '@/lib/supabase';

declare global {
  // eslint-disable-next-line no-var
  var _sharedRooms: Room[] | undefined;
}

if (!globalThis._sharedRooms || globalThis._sharedRooms.length < INITIAL_ROOMS.length) {
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
