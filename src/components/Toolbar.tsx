'use client';

import React from 'react';
import { FilterStatus } from '@/lib/types';
import { Search, X, ArrowUpDown, Layers, Sparkles, Filter } from 'lucide-react';

interface ToolbarProps {
  filter: FilterStatus;
  setFilter: (f: FilterStatus) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dirtyFirst: boolean;
  setDirtyFirst: (df: boolean) => void;
  dirtyCount: number;
  cleanCount: number;
  totalCount: number;
  selectedFloor?: string;
  setSelectedFloor?: (floor: string) => void;
  floorStats?: Record<string, { total: number; dirty: number }>;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  dirtyFirst,
  setDirtyFirst,
  dirtyCount,
  cleanCount,
  totalCount,
  selectedFloor = 'ALL',
  setSelectedFloor,
  floorStats,
}) => {
  const floors = ['ALL', '1', '2', '3', '4'];

  return (
    <div className="w-full bg-[#090e18]/90 backdrop-blur-md border-b border-white/[0.06] py-3.5 px-4 sm:px-6 lg:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Row 1: Filter Status Buttons & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[42px] active:scale-95 ${
                filter === 'ALL'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/[0.06]'
              }`}
            >
              <span>ทั้งหมด</span>
              <span className="px-1.5 py-0.5 rounded-lg text-[11px] bg-black/30 font-mono font-bold">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setFilter('DIRTY')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[42px] active:scale-95 ${
                filter === 'DIRTY'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/25 ring-1 ring-white/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/[0.06]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              <span>รอทำความสะอาด</span>
              <span className="px-1.5 py-0.5 rounded-lg text-[11px] bg-black/30 font-mono font-bold text-rose-200">
                {dirtyCount}
              </span>
            </button>

            <button
              onClick={() => setFilter('CLEAN')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[42px] active:scale-95 ${
                filter === 'CLEAN'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-white/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/[0.06]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>ทำความสะอาดแล้ว</span>
              <span className="px-1.5 py-0.5 rounded-lg text-[11px] bg-black/30 font-mono font-bold text-emerald-200">
                {cleanCount}
              </span>
            </button>
          </div>

          {/* Right: Search Box & Sort Toggle */}
          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาห้อง เช่น 204, 301..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-950/80 text-white placeholder-slate-500 rounded-xl border border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all min-h-[42px] shadow-inner font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  aria-label="ล้างการค้นหา"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dirty First Sort Toggle */}
            <button
              onClick={() => setDirtyFirst(!dirtyFirst)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[42px] active:scale-95 ${
                dirtyFirst
                  ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-950/40'
                  : 'bg-slate-900/80 border-white/[0.06] text-slate-300 hover:bg-slate-800'
              }`}
              title="สลับการเรียงลำดับ"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ห้องรอทำก่อน</span>
              <span className="sm:hidden">รอทำก่อน</span>
            </button>
          </div>
        </div>

        {/* Row 2: Floor Filter Tabs (ชั้น 1, ชั้น 2, ชั้น 3, ชั้น 4) */}
        {setSelectedFloor && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-white/[0.05] scrollbar-none">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mr-1 shrink-0">
              <Layers className="w-3.5 h-3.5" />
              <span>ชั้น:</span>
            </div>

            {floors.map((fl) => {
              const isActive = selectedFloor === fl;
              const stats = floorStats && floorStats[fl];

              return (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-white/[0.05]'
                  }`}
                >
                  <span>{fl === 'ALL' ? 'ทุกชั้น' : `ชั้น ${fl}`}</span>
                  {stats && stats.dirty > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      รอ {stats.dirty}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
