'use client';

import React from 'react';
import { Room } from '@/lib/types';
import { CheckCircle2, AlertTriangle, X, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0c1220] border border-white/[0.1] rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Background ambient radial glow */}
        <div
          className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isTransitioningToClean ? 'bg-emerald-500/20' : 'bg-rose-500/20'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-colors active:scale-95"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center relative z-10">
          {isTransitioningToClean ? (
            <div className="w-18 h-18 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-xl shadow-emerald-950/50 glow-emerald">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>
          ) : (
            <div className="w-18 h-18 rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-xl shadow-rose-950/50 glow-rose">
              <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
            </div>
          )}

          {/* Title & Room Number */}
          <div className="mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              อัปเดตสถานะห้องพัก
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              ห้อง{' '}
              <span className="font-mono text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 font-black">
                {room.room_number}
              </span>
            </h2>
          </div>

          {/* Thai Prompt Text */}
          <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
            {isTransitioningToClean
              ? `ยืนยันว่าห้อง ${room.room_number} ทำความสะอาดและตรวจเช็คเรียบร้อยแล้ว?`
              : `ต้องการเปลี่ยนห้อง ${room.room_number} กลับเป็น "รอทำความสะอาด" หรือไม่?`}
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/[0.08] transition-all active:scale-95 min-h-[48px]"
            >
              ยกเลิก
            </button>

            <button
              onClick={() => onConfirm(room)}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-2xl text-sm font-bold text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 min-h-[48px] ${
                isTransitioningToClean
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-950/60'
                  : 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-rose-950/60'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
