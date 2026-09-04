'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRooms } from '@/lib/useRooms';
import { Room } from '@/lib/types';
import { formatBangkokTime, compareRoomNumbers } from '@/lib/utils';
import {
  ArrowLeft,
  Edit2,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  X,
  Building2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { ToastContainer } from '@/components/Toast';

export default function AdminRoomsPage() {
  const {
    rooms,
    loading,
    editRoom,
    toggleRoomActive,
    resetToSeedRooms,
    refetch,
  } = useRooms();

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom || !editRoomNumber.trim()) return;

    const success = await editRoom(editingRoom.id, {
      room_number: editRoomNumber.trim(),
    });

    if (success) {
      addToast('success', `แก้ไขหมายเลขห้องเป็น ${editRoomNumber.trim()} เรียบร้อยแล้ว`);
      setEditingRoom(null);
    } else {
      addToast('error', 'ไม่สามารถแก้ไขหมายเลขห้องได้');
    }
  };

  const handleToggleActive = async (room: Room) => {
    const nextState = !room.active;
    const success = await toggleRoomActive(room.id, nextState);
    if (success) {
      addToast(
        'info',
        `ห้อง ${room.room_number} ${nextState ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานเรียบร้อย'}`
      );
    } else {
      addToast('error', 'ไม่สามารถเปลี่ยนสถานะการใช้งานห้องได้');
    }
  };

  const handleResetSeed = async () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลห้องพักกลับเป็นค่าเริ่มต้นมาตรฐาน (35 ห้อง) ใช่หรือไม่?')) {
      const ok = await resetToSeedRooms();
      if (ok) {
        addToast('success', 'รีเซ็ตข้อมูลห้องพักเป็นค่าเริ่มต้น (35 ห้อง) เรียบร้อยแล้ว');
      }
    }
  };

  const sortedRooms = useMemo(() => {
    let result = [...rooms];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((r) => r.room_number.toLowerCase().includes(q));
    }
    return result.sort((a, b) => compareRoomNumbers(a.room_number, b.room_number));
  }, [rooms, searchQuery]);

  const activeCount = rooms.filter((r) => r.active !== false).length;
  const disabledCount = rooms.filter((r) => r.active === false).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-semibold border border-slate-200 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับสู่หน้าหลัก</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  จัดการห้องพัก (Admin)
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  แก้ไขหมายเลขห้อง และเปิด-ปิดการใช้งาน
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all active:scale-95"
              title="โหลดข้อมูลใหม่"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetSeed}
              className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 hover:border-amber-300 text-xs font-semibold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 min-h-[40px]"
              title="รีเซ็ตกลับเป็นห้องตัวอย่างเริ่มต้น 35 ห้อง"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">รีเซ็ต</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">ห้องทั้งหมด</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              {rooms.length} <span className="text-xs font-normal text-slate-500">ห้อง</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-emerald-700 font-medium mb-1">เปิดใช้งาน</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
              {activeCount} <span className="text-xs font-normal text-emerald-600">ห้อง</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">ปิดใช้งาน</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-400">
              {disabledCount} <span className="text-xs font-normal text-slate-400">ห้อง</span>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-700">
              รายการห้องพักทั้งหมด
            </p>
            <div className="relative w-48 sm:w-56">
              <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาห้อง..."
                className="w-full pl-9 pr-3 py-2 bg-white text-slate-800 placeholder-slate-400 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-mono"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">หมายเลขห้อง</th>
                  <th className="py-3.5 px-5">สถานะทำความสะอาด</th>
                  <th className="py-3.5 px-5">อัปเดตล่าสุด</th>
                  <th className="py-3.5 px-5">การใช้งาน</th>
                  <th className="py-3.5 px-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="py-4 px-5">
                          <div className="h-4 bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  sortedRooms.map((room) => (
                    <tr
                      key={room.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        room.active === false ? 'opacity-40' : ''
                      }`}
                    >
                      {/* Room Number */}
                      <td className="py-4 px-5 font-mono font-black text-base sm:text-lg">
                        {editingRoom?.id === room.id ? (
                          <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editRoomNumber}
                              onChange={(e) => setEditRoomNumber(e.target.value)}
                              className="w-24 px-2.5 py-1.5 bg-white border border-indigo-400 rounded-xl text-slate-900 font-mono text-base focus:outline-none ring-2 ring-indigo-200"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingRoom(null)}
                              className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900">{room.room_number}</span>
                            <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              ชั้น {room.room_number.charAt(0)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {room.status === 'CLEAN' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>สะอาดแล้ว</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span>รอทำความสะอาด</span>
                          </span>
                        )}
                      </td>

                      {/* Updated At */}
                      <td className="py-4 px-5 text-slate-500 font-mono text-xs">
                        <div>{formatBangkokTime(room.updated_at)}</div>
                        {room.updated_by && (
                          <div className="text-[11px] font-sans text-slate-400 mt-0.5">{room.updated_by}</div>
                        )}
                      </td>

                      {/* Active State */}
                      <td className="py-4 px-5">
                        {room.active !== false ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>เปิดใช้งาน</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span>ปิดใช้งาน</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingRoom(room);
                              setEditRoomNumber(room.room_number);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-all active:scale-95"
                            title="แก้ไขหมายเลขห้อง"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleActive(room)}
                            className={`p-2 rounded-xl transition-all border active:scale-95 ${
                              room.active !== false
                                ? 'bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200 hover:border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                            }`}
                            title={room.active !== false ? 'ปิดใช้งานห้อง' : 'เปิดใช้งานห้อง'}
                          >
                            {room.active !== false ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-slate-600">Room Cleaning Status — Admin Panel</span>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
