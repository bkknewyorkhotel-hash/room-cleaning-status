'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Room, RoomStatus, UserRole } from './types';
import {
  supabase,
  isSupabaseConfigured,
  getLocalRooms,
  saveLocalRooms,
  createBroadcastChannel,
  INITIAL_ROOMS,
} from './supabase';
import { compareRoomNumbers } from './utils';

const ROLE_STORAGE_KEY = 'room_cleaning_status_role';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'connecting' | 'offline'>('connecting');
  const [role, setRoleState] = useState<UserRole>('STAFF');
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Initialize Role
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
      if (savedRole && ['VIEWER', 'STAFF', 'ADMIN'].includes(savedRole)) {
        setRoleState(savedRole);
      }
    }
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    }
  }, []);

  // Fetch Rooms from Supabase OR Server API
  const fetchRooms = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        setConnectionStatus('connecting');
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('room_number', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setRooms(data);
        } else {
          const { data: seededData, error: seedErr } = await supabase
            .from('rooms')
            .insert(INITIAL_ROOMS)
            .select();
          if (!seedErr && seededData) {
            setRooms(seededData);
          } else {
            setRooms(INITIAL_ROOMS);
          }
        }
        setConnectionStatus('online');
      } catch (err) {
        console.error('Supabase fetch error, using API fallback:', err);
        fetchFromApi();
      } finally {
        setLoading(false);
      }
    } else {
      fetchFromApi();
    }
  }, []);

  // Helper to fetch from /api/rooms server endpoint
  const fetchFromApi = async () => {
    try {
      const res = await fetch('/api/rooms', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.rooms && Array.isArray(json.rooms)) {
          setRooms(json.rooms);
          saveLocalRooms(json.rooms);
          setConnectionStatus('online');
          setLoading(false);
          return;
        }
      }
    } catch {
      // Offline fallback
    }
    const local = getLocalRooms();
    setRooms(local);
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    setLoading(false);
  };

  // Realtime Subscriptions & Cross-Device Sync Polling Setup
  useEffect(() => {
    fetchRooms();

    // BroadcastChannel setup for local multi-tab sync
    const channel = createBroadcastChannel();
    broadcastChannelRef.current = channel;

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'ROOMS_UPDATED') {
          fetchFromApi();
        }
      };
    }

    // Supabase Realtime Setup if configured
    let supabaseChannel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;

    if (isSupabaseConfigured && supabase) {
      supabaseChannel = supabase
        .channel('public:rooms')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'rooms' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newRoom = payload.new as Room;
              setRooms((prev) => {
                const exists = prev.some((r) => r.id === newRoom.id);
                if (exists) return prev;
                return [...prev, newRoom].sort((a, b) => compareRoomNumbers(a.room_number, b.room_number));
              });
            } else if (payload.eventType === 'UPDATE') {
              const updated = payload.new as Room;
              setRooms((prev) =>
                prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id;
              setRooms((prev) => prev.filter((r) => r.id !== deletedId));
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('online');
          } else if (status === 'TIMED_OUT' || status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setConnectionStatus('connecting');
          }
        });
    }

    // Cross-device sync interval polling (1.5 seconds) when Supabase is not active
    let pollInterval: NodeJS.Timeout | null = null;
    if (!isSupabaseConfigured) {
      pollInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchFromApi();
        }
      }, 1500);
    }

    // Network status monitoring
    const handleOnline = () => {
      setConnectionStatus('online');
      fetchRooms();
    };
    const handleOffline = () => {
      setConnectionStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (channel) channel.close();
      if (pollInterval) clearInterval(pollInterval);
      if (supabaseChannel && supabase) supabase.removeChannel(supabaseChannel);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchRooms]);

  // Status Update with Optimistic UI & Server Sync
  const updateRoomStatus = useCallback(
    async (roomId: string, newStatus: RoomStatus, staffName?: string): Promise<boolean> => {
      const nowIso = new Date().toISOString();
      let previousRoom: Room | undefined;

      // Optimistic state update
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id === roomId) {
            previousRoom = { ...room };
            return {
              ...room,
              status: newStatus,
              updated_at: nowIso,
              updated_by: staffName || (role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงาน'),
            };
          }
          return room;
        })
      );

      // Server API sync for cross-device support
      try {
        await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'UPDATE_STATUS',
            roomId,
            status: newStatus,
            staffName: staffName || (role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงาน'),
          }),
        });
        broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
      } catch (err) {
        console.error('Failed API update:', err);
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase
            .from('rooms')
            .update({
              status: newStatus,
              updated_at: nowIso,
              updated_by: staffName || (role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงาน'),
            })
            .eq('id', roomId);

          if (error) throw error;
          return true;
        } catch (err) {
          console.error('Failed to update status in Supabase:', err);
          if (previousRoom) {
            const rollbackRoom = previousRoom;
            setRooms((prev) =>
              prev.map((r) => (r.id === roomId ? rollbackRoom : r))
            );
          }
          return false;
        }
      }

      return true;
    },
    [role]
  );

  // Add Room (Admin)
  const addRoom = useCallback(async (roomNumber: string): Promise<boolean> => {
    const trimmed = roomNumber.trim();
    if (!trimmed) return false;

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_ROOM',
          roomNumber: trimmed,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setRooms(json.rooms);
        saveLocalRooms(json.rooms);
        broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
      }
    } catch (err) {
      console.error('Failed to add room via API:', err);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('rooms')
          .insert({
            room_number: trimmed,
            status: 'DIRTY',
            updated_at: new Date().toISOString(),
            active: true,
            sort_order: Date.now(),
          });
      } catch (err) {
        console.error('Failed to add room in Supabase:', err);
      }
    }
    return true;
  }, []);

  // Edit Room Number or Sort Order (Admin)
  const editRoom = useCallback(async (id: string, updates: Partial<Room>): Promise<boolean> => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'EDIT_ROOM',
          roomId: id,
          updates,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setRooms(json.rooms);
        saveLocalRooms(json.rooms);
        broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
      }
    } catch {
      // Fallback
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rooms').update(updates).eq('id', id);
      } catch {
        // Fallback
      }
    }
    return true;
  }, []);

  // Toggle Room Active State (Admin)
  const toggleRoomActive = useCallback(async (id: string, active: boolean): Promise<boolean> => {
    return editRoom(id, { active });
  }, [editRoom]);

  // Bulk Seed/Reset Helper for Admin
  const resetToSeedRooms = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET' }),
      });
      if (res.ok) {
        const json = await res.json();
        setRooms(json.rooms);
        saveLocalRooms(json.rooms);
        broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
      }
    } catch {
      // Fallback
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('rooms').insert(INITIAL_ROOMS);
      } catch {
        // Fallback
      }
    }
    return true;
  }, []);

  return {
    rooms,
    loading,
    connectionStatus,
    role,
    setRole,
    updateRoomStatus,
    addRoom,
    editRoom,
    toggleRoomActive,
    resetToSeedRooms,
    refetch: fetchRooms,
  };
}
