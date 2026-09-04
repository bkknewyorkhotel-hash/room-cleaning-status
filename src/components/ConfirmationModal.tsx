'use client';

import React from 'react';
import { Room } from '@/lib/types';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (room: Room) => void;
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  room,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !room) return null;

  const isTransitioningToClean = room.status === 'DIRTY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle top color bar */}
        <div
          className={`absolute top-0 inset-x-0 h-1 rounded-t-3xl ${
            isTransitioningToClean
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
              : 'bg-gradient-to-r from-rose-400 to-red-400'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center relative z-10">
          {isTransitioningToClean ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
              <AlertTriangle className="w-9 h-9 stroke-[2.2]" />
            </div>
          )}

          {/* Title & Room Number */}
          <div className="mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              อัปเดตสถานะห้องพัก
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              ห้อง{' '}
              <span
                className={`font-mono text-3xl sm:text-4xl font-black ${
                  isTransitioningToClean ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {room.room_number}
              </span>
            </h2>
          </div>

          {/* Prompt Text */}
          <p className="text-slate-500 text-sm sm:text-base mb-6 leading-relaxed">
            {isTransitioningToClean
              ? `ยืนยันว่าห้อง ${room.room_number} ทำความสะอาดและตรวจเช็คเรียบร้อยแล้ว?`
              : `ต้องการเปลี่ยนห้อง ${room.room_number} กลับเป็น "รอทำความสะอาด" หรือไม่?`}
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all active:scale-95 min-h-[48px]"
            >
              ยกเลิก
            </button>

            <button
              onClick={() => onConfirm(room)}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-2xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 min-h-[48px] ${
                isTransitioningToClean
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-200'
                  : 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-rose-200'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : isTransitioningToClean ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ยืนยันทำความสะอาด</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>เปลี่ยนเป็นรอทำ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
