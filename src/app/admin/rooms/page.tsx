'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { ToastContainer } from '@/components/Toast';

export default function AdminRoomsPage() {
  const {
    rooms,
    loading,
    role,
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
    if (confirm('คุณต้องการรีเซ็ตข้อมูลห้องพักกลับเป็นค่าเริ่มต้น (15 ห้อง) ใช่หรือไม่?')) {
      const ok = await resetToSeedRooms();
      if (ok) {
        addToast('success', 'รีเซ็ตข้อมูลห้องพักเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
      }
    }
  };

  const sortedRooms = [...rooms].sort((a, b) => compareRoomNumbers(a.room_number, b.room_number));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับสู่หน้าหลัก</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Building className="w-6 h-6 text-indigo-400" />
              <span>จัดการห้องพัก (Admin)</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-950/40 flex items-center gap-1.5 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มห้องพัก</span>
            </button>

            <button
              onClick={handleResetSeed}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-colors min-h-[44px]"
              title="รีเซ็ตกลับเป็นห้องตัวอย่าง 15 ห้อง"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">รายการห้องพักทั้งหมด</h2>
              <p className="text-xs text-slate-400">
                จำนวนทั้งหมด {sortedRooms.length} ห้อง (เปิดใช้งาน{' '}
                {sortedRooms.filter((r) => r.active !== false).length} ห้อง)
              </p>
            </div>
            <button
              onClick={refetch}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="โหลดข้อมูลใหม่"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">หมายเลขห้อง</th>
                  <th className="py-3.5 px-4">สถานะทำความสะอาด</th>
                  <th className="py-3.5 px-4">อัปเดตล่าสุด</th>
                  <th className="py-3.5 px-4">การใช้งาน</th>
                  <th className="py-3.5 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedRooms.map((room) => (
                  <tr
                    key={room.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      room.active === false ? 'opacity-50 bg-slate-950/40' : ''
                    }`}
                  >
                    {/* Room Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-base text-white">
                      {editingRoom?.id === room.id ? (
                        <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editRoomNumber}
                            onChange={(e) => setEditRoomNumber(e.target.value)}
                            className="w-24 px-2 py-1 bg-slate-950 border border-indigo-500 rounded text-white font-mono text-sm"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRoom(null)}
                            className="p-1 bg-slate-800 text-slate-400 rounded hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <span>{room.room_number}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {room.status === 'CLEAN' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ทำความสะอาดแล้ว</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>รอทำความสะอาด</span>
                        </span>
                      )}
                    </td>

                    {/* Updated At */}
                    <td className="py-3.5 px-4 text-slate-400">
                      <div>{formatBangkokTime(room.updated_at)}</div>
                      {room.updated_by && (
                        <div className="text-[10px] text-slate-500">{room.updated_by}</div>
                      )}
                    </td>

                    {/* Active State */}
                    <td className="py-3.5 px-4">
                      {room.active !== false ? (
                        <span className="text-emerald-400 font-semibold text-xs">เปิดใช้งาน</span>
                      ) : (
                        <span className="text-slate-500 font-semibold text-xs">ปิดใช้งาน</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingRoom(room);
                            setEditRoomNumber(room.room_number);
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="แก้ไขหมายเลขห้อง"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(room)}
                          className={`p-2 rounded-lg transition-colors ${
                            room.active !== false
                              ? 'bg-slate-800 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300'
                              : 'bg-slate-800 hover:bg-emerald-950/60 text-slate-500 hover:text-emerald-300'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">เพิ่มห้องพักใหม่</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  หมายเลขห้อง (เช่น 401)
                </label>
                <input
                  type="text"
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="เช่น 401"
                  className="w-full px-3 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-base"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-950/50"
                >
                  เพิ่มห้อง
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
