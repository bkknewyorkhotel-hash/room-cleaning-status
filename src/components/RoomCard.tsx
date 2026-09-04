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
      className={`group relative cursor-pointer select-none rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.97] border overflow-hidden min-h-[170px] sm:min-h-[185px] ${
        isClean
          ? 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100 shadow-sm'
          : 'bg-white border-rose-200 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100 shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0 active:scale-100' : ''}`}
    >
      {/* Subtle top color stripe */}
      <div
        className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl ${
          isClean
            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
            : 'bg-gradient-to-r from-rose-400 to-red-400'
        }`}
      />

      {/* Background tint */}
      <div
        className={`absolute inset-0 opacity-30 pointer-events-none ${
          isClean
            ? 'bg-gradient-to-br from-emerald-50 to-transparent'
            : 'bg-gradient-to-br from-rose-50 to-transparent'
        }`}
      />

      {/* Top Row: Status Pill & Floor Tag */}
      <div className="flex items-center justify-between w-full relative z-10">
        {/* Status Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
            isClean
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-rose-100 text-rose-700 border border-rose-200'
          }`}
        >
          {isClean ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>สะอาดแล้ว</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span>รอทำความสะอาด</span>
            </>
          )}
        </div>

        {/* Floor Indicator Badge */}
        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
          ชั้น {floorNumber}
        </span>
      </div>

      {/* Center: Large Room Number */}
      <div className="my-auto py-2 text-center relative z-10 flex flex-col items-center justify-center">
        <span
          className={`text-4xl sm:text-5xl font-black tracking-tight font-mono group-hover:scale-105 transition-transform duration-200 ${
            isClean ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {room.room_number}
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-0.5">
          ห้องพัก
        </span>
      </div>

      {/* Bottom Footer */}
      <div className="w-full pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 relative z-10 font-medium">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{formatBangkokTime(room.updated_at)}</span>
        </div>

        {room.updated_by && (
          <div className="flex items-center gap-1 text-slate-400 text-right truncate max-w-[100px] sm:max-w-[120px]">
            <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{room.updated_by}</span>
          </div>
        )}
      </div>
    </div>
  );
};
