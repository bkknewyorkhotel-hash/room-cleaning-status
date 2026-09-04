'use client';

import React from 'react';
import { Room } from '@/lib/types';
import { formatBangkokTime } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Clock, UserCheck } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  disabled?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect, disabled = false }) => {
  const isClean = room.status === 'CLEAN';
  const floorNumber = room.room_number.charAt(0);

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
      className={`group relative cursor-pointer select-none rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 transform hover:-translate-y-1 active:scale-[0.97] border overflow-hidden min-h-[175px] sm:min-h-[190px] shadow-lg ${
        isClean
          ? 'bg-gradient-to-b from-[#0c1c18]/90 via-[#0b1615]/80 to-[#08100f]/90 border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-950/40 glow-emerald'
          : 'bg-gradient-to-b from-[#210e14]/90 via-[#190b10]/80 to-[#12080c]/90 border-rose-500/40 hover:border-rose-400 hover:shadow-rose-950/40 glow-rose'
      } ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0 active:scale-100' : ''}`}
    >
      {/* Background ambient gradient glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 ${
          isClean ? 'bg-emerald-500/15 group-hover:bg-emerald-500/25' : 'bg-rose-500/15 group-hover:bg-rose-500/25'
        }`}
      />

      {/* Top Row: Status Pill & Floor Tag */}
      <div className="flex items-center justify-between w-full relative z-10">
        {/* Status Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm ${
            isClean
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}
        >
          {isClean ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>ทำความสะอาดแล้ว</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
              <span>รอทำความสะอาด</span>
            </>
          )}
        </div>

        {/* Floor Indicator Badge */}
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-white/[0.06] text-slate-400 border border-white/[0.05]">
          ชั้น {floorNumber}
        </span>
      </div>

      {/* Center: Large Distinct Room Number */}
      <div className="my-auto py-2 text-center relative z-10 flex flex-col items-center justify-center">
        <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-white drop-shadow-md group-hover:scale-105 transition-transform duration-200">
          {room.room_number}
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mt-0.5">
          ห้องพัก
        </span>
      </div>

      {/* Bottom Footer: Updated Time & Staff */}
      <div className="w-full pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 relative z-10 font-medium">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{formatBangkokTime(room.updated_at)}</span>
        </div>

        {room.updated_by && (
          <div className="flex items-center gap-1 text-slate-400 text-right truncate max-w-[100px] sm:max-w-[120px]">
            <UserCheck className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{room.updated_by}</span>
          </div>
        )}
      </div>

      {/* Bottom accent glow bar */}
      <div
        className={`absolute bottom-0 inset-x-6 h-0.5 rounded-t-full transition-all duration-300 ${
          isClean ? 'bg-emerald-400/80 group-hover:h-1' : 'bg-rose-400/80 group-hover:h-1'
        }`}
      />
    </div>
  );
};
