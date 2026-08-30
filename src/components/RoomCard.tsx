'use client';

import React from 'react';
import { Room } from '@/lib/types';
import { formatBangkokTime } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  disabled?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect, disabled = false }) => {
  const isClean = room.status === 'CLEAN';

  return (
    <div
      onClick={() => !disabled && onSelect(room)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          onSelect(room);
        }
      }}
      className={`relative group cursor-pointer select-none rounded-2xl p-4 sm:p-5 flex flex-col justify-between items-center text-center transition-all duration-150 transform active:scale-95 border-2 min-h-[140px] sm:min-h-[160px] ${
        isClean
          ? 'bg-emerald-950/30 hover:bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-950/20'
          : 'bg-rose-950/40 hover:bg-rose-950/50 border-rose-500/60 hover:border-rose-400 text-rose-100 shadow-lg shadow-rose-950/30'
      } ${disabled ? 'opacity-60 cursor-not-allowed active:scale-100' : ''}`}
    >
      {/* Top Status Pill Indicator */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
          isClean
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        }`}
      >
        {isClean ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>ทำความสะอาดแล้ว</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
            <span>รอทำความสะอาด</span>
          </>
        )}
      </div>

      {/* Prominent Room Number (Most visually prominent element) */}
      <div className="my-auto py-1">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono drop-shadow-md">
          {room.room_number}
        </span>
      </div>

      {/* Icon Graphic */}
      <div className="my-1.5">
        {isClean ? (
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-inner">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shadow-inner">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
        )}
      </div>

      {/* Bottom Footer: Updated Time & Staff */}
      <div className="w-full mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] sm:text-xs text-slate-300/80 font-medium">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{formatBangkokTime(room.updated_at)}</span>
        </div>
        {room.updated_by && (
          <span className="truncate max-w-[80px] sm:max-w-[100px] text-right text-slate-400">
            {room.updated_by}
          </span>
        )}
      </div>

      {/* Status indicator bar accent */}
      <div
        className={`absolute bottom-0 inset-x-4 h-1 rounded-t-full ${
          isClean ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />
    </div>
  );
};
