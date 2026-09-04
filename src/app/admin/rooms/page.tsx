'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRooms } from '@/lib/useRooms';
import { Room } from '@/lib/types';
import { formatBangkokTime, compareRoomNumbers } from '@/lib/utils';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  X,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Search,
} from 'lucide-react';
import { ToastContainer } from '@/components/Toast';

export default function AdminRoomsPage() {
  const {
    rooms,
    loading,
    addRoom,
    editRoom,
    toggleRoomActive,
    resetToSeedRooms,
    refetch,
  } = useRooms();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;

    const success = await addRoom(newRoomNumber.trim());
    if (success) {
      addToast('success', `เพิ่มห้อง ${newRoomNumber.trim()} เรียบร้อยแล้ว`);
      setNewRoomNumber('');
      setIsAddModalOpen(false);
    } else {
      addToast('error', 'ไม่สามารถเพิ่มห้องพักได้ กรุณาตรวจสอบหมายเลขห้อง');
    }
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

  // Filter and sort rooms
  const sortedRooms = useMemo(() => {
    let result = [...rooms];

    if (selectedFloor !== 'ALL') {
      result = result.filter((r) => r.room_number.startsWith(selectedFloor));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((r) => r.room_number.toLowerCase().includes(q));
    }

    return result.sort((a, b) => compareRoomNumbers(a.room_number, b.room_number));
  }, [rooms, selectedFloor, searchQuery]);

  const activeCount = rooms.filter((r) => r.active !== false).length;
  const disabledCount = rooms.filter((r) => r.active === false).length;

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Admin Header */}
      <header className="bg-[#0b101b]/95 backdrop-blur-xl border-b border-white/[0.08] py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold border border-white/[0.08] active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับสู่หน้าหลัก</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-white">
                  จัดการห้องพัก (Admin)
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  เพิ่ม แก้ไขหมายเลขห้อง และเปิด-ปิดการใช้งาน
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-indigo-950/50 flex items-center gap-1.5 active:scale-95 min-h-[42px]"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มห้องพัก</span>
            </button>

            <button
              onClick={handleResetSeed}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/[0.08] text-xs font-semibold rounded-xl transition-all active:scale-95 min-h-[42px] shadow-sm"
              title="รีเซ็ตกลับเป็นห้องตัวอย่างเริ่มต้น 35 ห้อง"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metric Cards Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4 shadow-lg">
            <div className="text-xs text-slate-400 font-medium mb-1">ห้องทั้งหมด</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {rooms.length} <span className="text-xs font-normal text-slate-400">ห้อง</span>
            </div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
            <div className="text-xs text-emerald-400 font-medium mb-1">เปิดใช้งาน</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">
              {activeCount} <span className="text-xs font-normal text-emerald-400/80">ห้อง</span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4 shadow-lg">
            <div className="text-xs text-slate-400 font-medium mb-1">ปิดใช้งาน</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-400">
              {disabledCount} <span className="text-xs font-normal text-slate-500">ห้อง</span>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-[#0b111e]/90 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Table Toolbar Header */}
          <div className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-slate-900/50">
            {/* Floor Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mr-1 shrink-0">
                <Layers className="w-3.5 h-3.5" />
                <span>ชั้น:</span>
              </div>
              {['ALL', '1', '2', '3', '4'].map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                    selectedFloor === fl
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/[0.05]'
                  }`}
                >
                  {fl === 'ALL' ? 'ทุกชั้น' : `ชั้น ${fl}`}
                </button>
              ))}
            </div>

            {/* Search & Refresh */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาห้อง..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 text-white placeholder-slate-500 text-xs rounded-xl border border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                />
              </div>

              <button
                onClick={refetch}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] transition-colors"
                title="โหลดข้อมูลใหม่"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-white/[0.06]">
                <tr>
                  <th className="py-4 px-5">หมายเลขห้อง</th>
                  <th className="py-4 px-5">สถานะทำความสะอาด</th>
                  <th className="py-4 px-5">อัปเดตล่าสุด</th>
                  <th className="py-4 px-5">การเปิดใช้งาน</th>
                  <th className="py-4 px-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sortedRooms.map((room) => (
                  <tr
                    key={room.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      room.active === false ? 'opacity-40 bg-black/20' : ''
                    }`}
                  >
                    {/* Room Number */}
                    <td className="py-4 px-5 font-mono font-black text-base sm:text-lg text-white">
                      {editingRoom?.id === room.id ? (
                        <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editRoomNumber}
                            onChange={(e) => setEditRoomNumber(e.target.value)}
                            className="w-24 px-2.5 py-1.5 bg-slate-950 border border-indigo-500 rounded-xl text-white font-mono text-base focus:outline-none ring-2 ring-indigo-500/30"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRoom(null)}
                            className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-white">{room.room_number}</span>
                          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-white/[0.05] text-slate-400">
                            ชั้น {room.room_number.charAt(0)}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {room.status === 'CLEAN' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ทำความสะอาดแล้ว</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>รอทำความสะอาด</span>
                        </span>
                      )}
                    </td>

                    {/* Updated At */}
                    <td className="py-4 px-5 text-slate-400 font-mono text-xs">
                      <div>{formatBangkokTime(room.updated_at)}</div>
                      {room.updated_by && (
                        <div className="text-[11px] font-sans text-slate-500 mt-0.5">{room.updated_by}</div>
                      )}
                    </td>

                    {/* Active State */}
                    <td className="py-4 px-5">
                      {room.active !== false ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>เปิดใช้งาน</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-semibold text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
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
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] transition-all active:scale-95"
                          title="แก้ไขหมายเลขห้อง"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(room)}
                          className={`p-2 rounded-xl transition-all border border-white/[0.08] active:scale-95 ${
                            room.active !== false
                              ? 'bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300'
                              : 'bg-slate-900 hover:bg-emerald-950/60 text-slate-500 hover:text-emerald-300'
                          }`}
                          title={room.active !== false ? 'ปิดใช้งานห้อง' : 'เปิดใช้งานห้อง'}
                        >
                          {room.active !== false ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0c1220] border border-white/[0.1] rounded-3xl shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-white mb-1">เพิ่มห้องพักใหม่</h3>
            <p className="text-xs text-slate-400 mb-4">
              กำหนดหมายเลขห้องพัก เช่น 206, 401, 501
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  หมายเลขห้อง
                </label>
                <input
                  type="text"
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="เช่น 401"
                  className="w-full px-4 py-3 bg-slate-950 text-white rounded-2xl border border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-lg tracking-wide"
                  autoFocus
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/[0.08]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-950/60 active:scale-95"
                >
                  เพิ่มห้องพัก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
