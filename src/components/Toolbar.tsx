'use client';

import React from 'react';
import { FilterStatus } from '@/lib/types';
import { Search, X, ArrowUpDown } from 'lucide-react';

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
}) => {
  return (
    <div className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 py-3 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>ทั้งหมด</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 font-mono">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('DIRTY')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
              filter === 'DIRTY'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>รอทำความสะอาด</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 font-mono">
              {dirtyCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('CLEAN')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
              filter === 'CLEAN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>ทำความสะอาดแล้ว</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 font-mono">
              {cleanCount}
            </span>
          </button>
        </div>

        {/* Right: Search Input & Sorting Toggle */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาหมายเลขห้อง..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-950 text-white placeholder-slate-500 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                aria-label="ล้างการค้นหา"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dirty First Sort Toggle */}
          <button
            onClick={() => setDirtyFirst(!dirtyFirst)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
              dirtyFirst
                ? 'bg-amber-950/70 border-amber-500/60 text-amber-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="สลับลำดับการแสดงผล"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">แสดงห้องรอทำความสะอาดก่อน</span>
            <span className="sm:hidden">รอทำความสะอาดก่อน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
