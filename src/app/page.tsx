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
import { Sparkles, Building2, SearchX } from 'lucide-react';

export default function RoomStatusDashboard() {
  const {
    rooms,
    loading,
    connectionStatus,
    role,
    setRole,
    updateRoomStatus,
    refetch,
  } = useRooms();

  // State
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

  // Filtered & Active Rooms
  const activeRooms = useMemo(() => {
    return rooms.filter((r) => r.active !== false);
  }, [rooms]);

  // Statistics
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

  // Processed & Filtered Rooms Grid
  const displayedRooms = useMemo(() => {
    let result = activeRooms;

    // Filter status
    if (filter === 'DIRTY') {
      result = result.filter((r) => r.status === 'DIRTY');
    } else if (filter === 'CLEAN') {
      result = result.filter((r) => r.status === 'CLEAN');
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((r) => r.room_number.toLowerCase().includes(query));
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (dirtyFirst) {
        if (a.status === 'DIRTY' && b.status !== 'DIRTY') return -1;
        if (a.status !== 'DIRTY' && b.status === 'DIRTY') return 1;
      }
      return compareRoomNumbers(a.room_number, b.room_number);
    });
  }, [activeRooms, filter, searchQuery, dirtyFirst]);

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
        `ห้อง ${room.room_number} เปลี่ยนเป็น ${
          targetStatus === 'CLEAN' ? 'ทำความสะอาดแล้ว' : 'รอทำความสะอาด'
        } เรียบร้อย`
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <Header
        totalCount={totalCount}
        cleanCount={cleanCount}
        dirtyCount={dirtyCount}
        lastUpdated={lastUpdated}
        connectionStatus={connectionStatus}
        role={role}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onRefresh={refetch}
      />

      {/* Toolbar Filters & Search */}
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
      />

      {/* Main Grid Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-36 bg-slate-900/60 border border-slate-800/80 rounded-2xl animate-pulse flex flex-col justify-between p-4"
              >
                <div className="w-20 h-5 bg-slate-800 rounded-full mx-auto" />
                <div className="w-16 h-10 bg-slate-800 rounded-lg mx-auto" />
                <div className="w-24 h-4 bg-slate-800 rounded mx-auto" />
              </div>
            ))}
          </div>
        ) : displayedRooms.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-1">
              ไม่พบห้องพักที่ตรงกับการค้นหา
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองสถานะเป็น &quot;ทั้งหมด&quot;
            </p>
            {(searchQuery || filter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('ALL');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                ล้างการค้นหาและตัวกรอง
              </button>
            )}
          </div>
        ) : (
          /* Room Cards Grid */
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
      <footer className="w-full bg-slate-900/60 border-t border-slate-800/80 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-400">ระบบติดตามสถานะทำความสะอาดห้องพัก</span>
          </div>
          <div className="flex items-center gap-2">
            <span>เขตเวลา: Asia/Bangkok (24 ชม.)</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Realtime Subscriptions Active</span>
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
            `เปลี่ยนบทบาทเป็น: ${
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
