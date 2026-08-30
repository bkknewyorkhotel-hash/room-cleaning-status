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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          {isTransitioningToClean ? (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-950/40">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/40">
              <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
            </div>
          )}

          {/* Title & Room Number */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            ห้อง <span className="font-mono text-3xl text-amber-300 font-extrabold">{room.room_number}</span>
          </h2>

          {/* Thai Prompt Text */}
          <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
            {isTransitioningToClean
              ? `ยืนยันว่าห้อง ${room.room_number} ทำความสะอาดเรียบร้อยแล้ว?`
              : `ต้องการเปลี่ยนห้อง ${room.room_number} เป็นรอทำความสะอาดหรือไม่?`}
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95 min-h-[48px]"
            >
              ยกเลิก
            </button>

            <button
              onClick={() => onConfirm(room)}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 min-h-[48px] ${
                isTransitioningToClean
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isTransitioningToClean ? (
                'ยืนยัน'
              ) : (
                'เปลี่ยนเป็นรอทำความสะอาด'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
