'use client';

import React, { useState, useMemo } from 'react';
import { useRooms } from '@/lib/useRooms';
import { Room, FilterStatus, ToastMessage } from '@/lib/types';
import { compareRoomNumbers } from '@/lib/utils';
import { Header } from '@/components/Header';
import { RoomCard } from '@/components/RoomCard';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { PinModal } from '@/components/PinModal';
import { ToastContainer } from '@/components/Toast';
import { SearchX, Building2, CheckCircle2, AlertTriangle, Search, X, ArrowUpDown } from 'lucide-react';

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

  // Active Rooms
  const activeRooms = useMemo(() => {
    return rooms.filter((r) => r.active !== false);
  }, [rooms]);

  // Stats
  const totalCount = activeRooms.length;
  const cleanCount = activeRooms.filter((r) => r.status === 'CLEAN').length;
  const dirtyCount = activeRooms.filter((r) => r.status === 'DIRTY').length;

  const lastUpdated = useMemo(() => {
    if (activeRooms.length === 0) return null;
    const sortedDates = [...activeRooms]
      .map((r) => r.updated_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return sortedDates[0] || null;
  }, [activeRooms]);

  // Displayed Rooms - simple flat list, no floor grouping
  const displayedRooms = useMemo(() => {
    let result = activeRooms;

    if (filter === 'DIRTY') {
      result = result.filter((r) => r.status === 'DIRTY');
    } else if (filter === 'CLEAN') {
      result = result.filter((r) => r.status === 'CLEAN');
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((r) => r.room_number.toLowerCase().includes(query));
    }

    return [...result].sort((a, b) => {
      if (dirtyFirst) {
        if (a.status === 'DIRTY' && b.status !== 'DIRTY') return -1;
        if (a.status !== 'DIRTY' && b.status === 'DIRTY') return 1;
      }
      return compareRoomNumbers(a.room_number, b.room_number);
    });
  }, [activeRooms, filter, searchQuery, dirtyFirst]);

  const handleRoomClick = (room: Room) => {
    if (role === 'VIEWER') {
      setIsPinModalOpen(true);
      return;
    }
    setSelectedRoom(room);
    setIsConfirmOpen(true);
  };

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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
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

      {/* Toolbar */}
      <div className="w-full bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { key: 'ALL', label: 'ทั้งหมด', count: totalCount, color: 'indigo' },
              { key: 'DIRTY', label: 'รอทำความสะอาด', count: dirtyCount, color: 'rose' },
              { key: 'CLEAN', label: 'สะอาดแล้ว', count: cleanCount, color: 'emerald' },
            ].map(({ key, label, count, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterStatus)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[40px] active:scale-95 ${
                  filter === key
                    ? color === 'indigo'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : color === 'rose'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {key === 'DIRTY' && (
                  <span className={`w-2 h-2 rounded-full ${filter === key ? 'bg-white' : 'bg-rose-500'} animate-pulse`} />
                )}
                {key === 'CLEAN' && (
                  <span className={`w-2 h-2 rounded-full ${filter === key ? 'bg-white' : 'bg-emerald-500'}`} />
                )}
                <span>{label}</span>
                <span className={`px-1.5 py-0.5 rounded-lg text-[11px] font-mono font-bold ${
                  filter === key
                    ? 'bg-white/25 text-white'
                    : color === 'rose'
                    ? 'bg-rose-100 text-rose-600'
                    : color === 'emerald'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาห้อง..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all min-h-[40px] font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setDirtyFirst(!dirtyFirst)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[40px] active:scale-95 ${
                dirtyFirst
                  ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="สลับการเรียงลำดับ"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">รอทำก่อน</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="h-44 bg-white border border-slate-200 rounded-2xl animate-pulse flex flex-col justify-between p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="w-16 h-5 bg-slate-100 rounded-full" />
                  <div className="w-8 h-4 bg-slate-100 rounded-md" />
                </div>
                <div className="w-20 h-10 bg-slate-100 rounded-xl mx-auto" />
                <div className="w-full h-4 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : displayedRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-1">ไม่พบห้องพักที่ตรงกับเงื่อนไข</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-5">
              ลองเปลี่ยนคำค้นหา หรือกดเพื่อรีเซ็ตตัวกรองทั้งหมด
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('ALL');
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              แสดงห้องทั้งหมด ({totalCount} ห้อง)
            </button>
          </div>
        ) : (
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

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-700">Room Cleaning Status System</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              {totalCount} ห้อง
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
            <span>Bangkok 24h Timezone</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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

      {/* PIN Modal */}
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

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
