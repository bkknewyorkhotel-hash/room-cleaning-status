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

  // Helper to fetch from /api/rooms server endpoint (Local fallback)
  const fetchFromApi = useCallback(async () => {
    try {
      const res = await fetch('/api/rooms', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.rooms && Array.isArray(json.rooms) && json.rooms.length > 0) {
          setRooms((prev) => {
            // If local state already has newer or more rooms, merge without wiping
            const merged = json.rooms;
            saveLocalRooms(merged);
            return merged;
          });
          setConnectionStatus('online');
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to local storage
    }
    const local = getLocalRooms();
    setRooms(local);
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    setLoading(false);
  }, []);

  // Fetch Rooms from Supabase OR Server API
  const fetchRooms = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        setConnectionStatus('connecting');
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Check if standard rooms (201-210, 301-310, 401-410) are missing in the DB
          const existingRoomNumbers = new Set(data.map((r: Room) => r.room_number));
          const missingRooms = INITIAL_ROOMS.filter((r) => !existingRoomNumbers.has(r.room_number)).map(
            ({ id, ...rest }) => rest
          );

          let combinedData = data;
          if (missingRooms.length > 0) {
            try {
              const { data: inserted, error: insertErr } = await supabase
                .from('rooms')
                .insert(missingRooms)
                .select();

              if (!insertErr && inserted) {
                combinedData = [...data, ...inserted];
              }
            } catch (syncErr) {
              console.error('Error auto-syncing missing rooms to DB:', syncErr);
            }
          }

          const sorted = [...combinedData].sort((a, b) => compareRoomNumbers(a.room_number, b.room_number));
          setRooms(sorted);
          saveLocalRooms(sorted);
        } else {
          // Table exists but is empty, seed with initial rooms (omit id to let DB generate UUID)
          const dbRooms = INITIAL_ROOMS.map(({ id, ...rest }) => rest);
          const { data: seededData, error: seedErr } = await supabase
            .from('rooms')
            .insert(dbRooms)
            .select();

          if (!seedErr && seededData) {
            const sorted = [...seededData].sort((a, b) => compareRoomNumbers(a.room_number, b.room_number));
            setRooms(sorted);
            saveLocalRooms(sorted);
          } else {
            console.error('Seeding error in Supabase:', seedErr);
            setRooms(INITIAL_ROOMS);
            saveLocalRooms(INITIAL_ROOMS);
          }
        }
        setConnectionStatus('online');
      } catch (err) {
        console.error('Supabase fetch error, checking local cache:', err);
        const cached = getLocalRooms();
        if (cached && cached.length > 0) {
          setRooms(cached);
        } else {
          fetchFromApi();
        }
        setConnectionStatus('connecting');
      } finally {
        setLoading(false);
      }
    } else {
      fetchFromApi();
    }
  }, [fetchFromApi]);

  // Realtime Subscriptions & Cross-Device Sync Setup
  useEffect(() => {
    fetchRooms();

    // BroadcastChannel setup for local multi-tab sync
    const channel = createBroadcastChannel();
    broadcastChannelRef.current = channel;

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'ROOMS_UPDATED') {
          if (isSupabaseConfigured && supabase) {
            fetchRooms();
          } else {
            fetchFromApi();
          }
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
                const filtered = prev.filter((r) => r.id !== newRoom.id && r.room_number !== newRoom.room_number);
                const next = [...filtered, newRoom].sort((a, b) =>
                  compareRoomNumbers(a.room_number, b.room_number)
                );
                saveLocalRooms(next);
                return next;
              });
            } else if (payload.eventType === 'UPDATE') {
              const updated = payload.new as Room;
              setRooms((prev) => {
                const next = prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r));
                saveLocalRooms(next);
                return next;
              });
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as { id: string }).id;
              setRooms((prev) => {
                const next = prev.filter((r) => r.id !== deletedId);
                saveLocalRooms(next);
                return next;
              });
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

    // Polling only when Supabase is NOT configured (Local development fallback)
    let pollInterval: NodeJS.Timeout | null = null;
    if (!isSupabaseConfigured) {
      pollInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchFromApi();
        }
      }, 3000);
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
  }, [fetchRooms, fetchFromApi]);

  // Status Update with Optimistic UI & Server Sync
  const updateRoomStatus = useCallback(
    async (roomId: string, newStatus: RoomStatus, staffName?: string): Promise<boolean> => {
      const nowIso = new Date().toISOString();
      const updater = staffName || (role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พนักงาน');
      let previousRoom: Room | undefined;

      // Optimistic state update
      setRooms((prev) => {
        const next = prev.map((room) => {
          if (room.id === roomId) {
            previousRoom = { ...room };
            return {
              ...room,
              status: newStatus,
              updated_at: nowIso,
              updated_by: updater,
            };
          }
          return room;
        });
        saveLocalRooms(next);
        return next;
      });

      // 1. If Supabase is configured, update database directly
      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase
            .from('rooms')
            .update({
              status: newStatus,
              updated_at: nowIso,
              updated_by: updater,
            })
            .eq('id', roomId);

          if (error) {
            console.error('Supabase update status error:', error);
            // Rollback optimistic update
            if (previousRoom) {
              const rollbackRoom = previousRoom;
              setRooms((prev) => {
                const reverted = prev.map((r) => (r.id === roomId ? rollbackRoom : r));
                saveLocalRooms(reverted);
                return reverted;
              });
            }
            return false;
          }

          broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
          return true;
        } catch (err) {
          console.error('Failed to update status in Supabase:', err);
          if (previousRoom) {
            const rollbackRoom = previousRoom;
            setRooms((prev) => {
              const reverted = prev.map((r) => (r.id === roomId ? rollbackRoom : r));
              saveLocalRooms(reverted);
              return reverted;
            });
          }
          return false;
        }
      }

      // 2. Fallback to /api/rooms when Supabase is not configured
      try {
        await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'UPDATE_STATUS',
            roomId,
            status: newStatus,
            staffName: updater,
          }),
        });
        broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
        return true;
      } catch (err) {
        console.error('Failed API update:', err);
        return false;
      }
    },
    [role]
  );

  // Add Room (Admin)
  const addRoom = useCallback(async (roomNumber: string): Promise<boolean> => {
    const trimmed = roomNumber.trim();
    if (!trimmed) return false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .insert({
            room_number: trimmed,
            status: 'DIRTY',
            updated_at: new Date().toISOString(),
            active: true,
            sort_order: Date.now(),
          })
          .select()
          .single();

        if (error) {
          console.error('Failed to add room in Supabase:', error);
          return false;
        }

        if (data) {
          setRooms((prev) => {
            const next = [...prev.filter((r) => r.id !== data.id), data].sort((a, b) =>
              compareRoomNumbers(a.room_number, b.room_number)
            );
            saveLocalRooms(next);
            return next;
          });
          broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
          return true;
        }
      } catch (err) {
        console.error('Failed to add room in Supabase:', err);
        return false;
      }
    }

    // Local / API Fallback
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
        if (json.rooms) {
          setRooms(json.rooms);
          saveLocalRooms(json.rooms);
          broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to add room via API:', err);
    }
    return false;
  }, []);

  // Edit Room Number or Sort Order (Admin)
  const editRoom = useCallback(async (id: string, updates: Partial<Room>): Promise<boolean> => {
    // Optimistic update
    setRooms((prev) => {
      const next = prev.map((r) =>
        r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
      );
      saveLocalRooms(next);
      return next;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('rooms')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) {
          console.error('Failed to update room in Supabase:', error);
          fetchRooms();
          return false;
        }
        broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
        return true;
      } catch (err) {
        console.error('Supabase edit error:', err);
        fetchRooms();
        return false;
      }
    }

    // Local / API Fallback
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
        if (json.rooms) {
          setRooms(json.rooms);
          saveLocalRooms(json.rooms);
          broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
          return true;
        }
      }
    } catch (err) {
      console.error('API edit error:', err);
    }
    return true;
  }, [fetchRooms]);

  // Toggle Room Active State (Admin)
  const toggleRoomActive = useCallback(
    async (id: string, active: boolean): Promise<boolean> => {
      return editRoom(id, { active });
    },
    [editRoom]
  );

  // Bulk Seed/Reset Helper for Admin
  const resetToSeedRooms = useCallback(async (): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: delErr } = await supabase.from('rooms').delete().neq('room_number', '');
        if (delErr) {
          console.error('Error clearing rooms in Supabase:', delErr);
        }

        const dbRooms = INITIAL_ROOMS.map(({ id, ...rest }) => rest);
        const { data, error: insertErr } = await supabase.from('rooms').insert(dbRooms).select();

        if (!insertErr && data) {
          const sorted = [...data].sort((a, b) => compareRoomNumbers(a.room_number, b.room_number));
          setRooms(sorted);
          saveLocalRooms(sorted);
          broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
          return true;
        } else {
          console.error('Error reseeding Supabase:', insertErr);
        }
      } catch (err) {
        console.error('Failed to reset Supabase rooms:', err);
      }
    }

    // Local / API Fallback
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET' }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.rooms) {
          setRooms(json.rooms);
          saveLocalRooms(json.rooms);
          broadcastChannelRef.current?.postMessage({ type: 'ROOMS_UPDATED' });
          return true;
        }
      }
    } catch {
      // Fallback
    }

    setRooms(INITIAL_ROOMS);
    saveLocalRooms(INITIAL_ROOMS);
    return true;
  }, []);

  return {
    rooms,
    loading,
    connectionStatus,
    isSupabaseConfigured,
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
