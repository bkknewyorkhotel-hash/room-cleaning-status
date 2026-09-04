'use client';

import React, { useState, useMemo } from 'react';
import { useRooms } from '@/lib/useRooms';
import { Room, FilterStatus, ToastMessage } from '@/lib/types';
import { compareRoomNumbers } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { RoomCard } from '@/components/RoomCard';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { PinModal } from '@/components/PinModal';
import { ToastContainer } from '@/components/Toast';
import { Sparkles, Building2, SearchX, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RoomStatusDashboard() {
  const {
    rooms,
    loading,
    connectionStatus,
    isSupabaseConfigured,
    role,
    setRole,
    updateRoomStatus,
    refetch,
  } = useRooms();

  // Filters & State
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dirtyFirst, setDirtyFirst] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');

  // Modals
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'error' | 'success' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filtered & Active Rooms
  const activeRooms = useMemo(() => {
    return rooms.filter((r) => r.active !== false);
  }, [rooms]);

  // Overall Statistics
  const totalCount = activeRooms.length;
  const cleanCount = activeRooms.filter((r) => r.status === 'CLEAN').length;
  const dirtyCount = activeRooms.filter((r) => r.status === 'DIRTY').length;

  // Floor Stats for Floors 1, 2, 3, 4
  const floorStats = useMemo(() => {
    const stats: Record<string, { total: number; dirty: number; clean: number }> = {
      ALL: { total: totalCount, dirty: dirtyCount, clean: cleanCount },
      '1': { total: 0, dirty: 0, clean: 0 },
      '2': { total: 0, dirty: 0, clean: 0 },
      '3': { total: 0, dirty: 0, clean: 0 },
      '4': { total: 0, dirty: 0, clean: 0 },
    };

    activeRooms.forEach((r) => {
      const fl = r.room_number.charAt(0);
      if (stats[fl]) {
        stats[fl].total += 1;
        if (r.status === 'DIRTY') stats[fl].dirty += 1;
        if (r.status === 'CLEAN') stats[fl].clean += 1;
      }
    });

    return stats;
  }, [activeRooms, totalCount, dirtyCount, cleanCount]);

  const lastUpdated = useMemo(() => {
    if (activeRooms.length === 0) return null;
    const sortedDates = [...activeRooms]
      .map((r) => r.updated_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return sortedDates[0] || null;
  }, [activeRooms]);

  // Processed Rooms Grid
  const displayedRooms = useMemo(() => {
    let result = activeRooms;

    // Filter by floor if selected
    if (selectedFloor !== 'ALL') {
      result = result.filter((r) => r.room_number.startsWith(selectedFloor));
    }

    // Filter by cleaning status
    if (filter === 'DIRTY') {
      result = result.filter((r) => r.status === 'DIRTY');
    } else if (filter === 'CLEAN') {
      result = result.filter((r) => r.status === 'CLEAN');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((r) => r.room_number.toLowerCase().includes(query));
    }

    // Sorting logic
    return [...result].sort((a, b) => {
      if (dirtyFirst) {
        if (a.status === 'DIRTY' && b.status !== 'DIRTY') return -1;
        if (a.status !== 'DIRTY' && b.status === 'DIRTY') return 1;
      }
      return compareRoomNumbers(a.room_number, b.room_number);
    });
  }, [activeRooms, selectedFloor, filter, searchQuery, dirtyFirst]);

  // Group rooms by Floor when viewing All floors without search
  const floorGroups = useMemo(() => {
    if (selectedFloor !== 'ALL' || searchQuery.trim()) {
      return null;
    }

    const groups: Record<string, Room[]> = {};
    displayedRooms.forEach((r) => {
      const fl = r.room_number.charAt(0);
      if (!groups[fl]) groups[fl] = [];
      groups[fl].push(r);
    });

    return groups;
  }, [displayedRooms, selectedFloor, searchQuery]);

  // Card Selection Handler
  const handleRoomClick = (room: Room) => {
    if (role === 'VIEWER') {
      setIsPinModalOpen(true);
      return;
    }
    setSelectedRoom(room);
    setIsConfirmOpen(true);
  };

  // Confirm Status Update
  const handleConfirmStatusChange = async (room: Room) => {
    setActionLoading(true);
    const targetStatus = room.status === 'DIRTY' ? 'CLEAN' : 'DIRTY';

    const success = await updateRoomStatus(room.id, targetStatus);
    setActionLoading(false);
    setIsConfirmOpen(false);
    setSelectedRoom(null);

    if (!success) {
      addToast('error', 'ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง');
    } else {
      addToast(
        'success',
        `ห้อง ${room.room_number} ${
          targetStatus === 'CLEAN' ? 'ทำความสะอาดแล้ว ✓' : 'เปลี่ยนเป็นรอทำความสะอาด'
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header
        totalCount={totalCount}
        cleanCount={cleanCount}
        dirtyCount={dirtyCount}
        lastUpdated={lastUpdated}
        connectionStatus={connectionStatus}
        isSupabaseConfigured={isSupabaseConfigured}
        role={role}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onRefresh={refetch}
      />

      {/* Toolbar Filters, Floor Selector & Search */}
      <Toolbar
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dirtyFirst={dirtyFirst}
        setDirtyFirst={setDirtyFirst}
        dirtyCount={dirtyCount}
        cleanCount={cleanCount}
        totalCount={totalCount}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        floorStats={floorStats}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          /* Modern Loading Skeletons */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="h-44 bg-slate-900/50 border border-white/[0.05] rounded-3xl animate-pulse flex flex-col justify-between p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="w-16 h-5 bg-slate-800 rounded-full" />
                  <div className="w-8 h-4 bg-slate-800 rounded-md" />
                </div>
                <div className="w-20 h-10 bg-slate-800/80 rounded-xl mx-auto" />
                <div className="w-full h-4 bg-slate-800/50 rounded" />
              </div>
            ))}
          </div>
        ) : displayedRooms.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-18 h-18 rounded-3xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-center text-slate-500 mb-4 shadow-xl">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-1">
              ไม่พบห้องพักที่ตรงกับเงื่อนไข
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mb-5">
              ลองเปลี่ยนคำค้นหา หรือกดเพื่อรีเซ็ตตัวกรองชั้นและสถานะทั้งหมด
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('ALL');
                setSelectedFloor('ALL');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-950/50 active:scale-95"
            >
              แสดงห้องทั้งหมด (35 ห้อง)
            </button>
          </div>
        ) : floorGroups && Object.keys(floorGroups).length > 1 ? (
          /* Floor Grouped Layout */
          <div className="space-y-8">
            {Object.keys(floorGroups).sort().map((fl) => {
              const roomsInFloor = floorGroups[fl];
              const dirtyInFloor = roomsInFloor.filter((r) => r.status === 'DIRTY').length;
              const cleanInFloor = roomsInFloor.filter((r) => r.status === 'CLEAN').length;

              return (
                <section key={fl} className="space-y-3.5">
                  {/* Floor Header Badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold text-xs">
                        {fl}
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <span>ชั้น {fl}</span>
                        <span className="text-xs font-normal text-slate-400 font-mono">
                          ({roomsInFloor.length} ห้อง)
                        </span>
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium">
                      {dirtyInFloor > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                          <span>รอ {dirtyInFloor}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>เสร็จครบ</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rooms in Floor Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {roomsInFloor.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onSelect={handleRoomClick}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Single Flat Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {displayedRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onSelect={handleRoomClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="w-full bg-[#080d16]/80 backdrop-blur-md border-t border-white/[0.05] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">Room Cleaning Status System</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400">
              35 ห้อง
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
            <span>Bangkok 24h Timezone</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Realtime Synchronized
            </span>
          </div>
        </div>
      </footer>

      {/* Confirmation Modal */}
      <ConfirmationModal
        room={selectedRoom}
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedRoom(null);
        }}
        onConfirm={handleConfirmStatusChange}
        loading={actionLoading}
      />

      {/* Role / PIN Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        currentRole={role}
        onSelectRole={(newRole) => {
          setRole(newRole);
          addToast(
            'info',
            `สลับโหมดเป็น: ${
              newRole === 'ADMIN'
                ? 'ผู้ดูแลระบบ (Admin)'
                : newRole === 'STAFF'
                ? 'พนักงาน (Staff)'
                : 'ผู้ดู (Viewer)'
            }`
          );
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
