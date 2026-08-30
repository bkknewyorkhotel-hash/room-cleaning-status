'use client';

import React from 'react';
import Link from 'next/link';
import { UserRole } from '@/lib/types';
import { formatBangkokTime } from '@/lib/utils';
import { ShieldCheck, UserCheck, Eye, Settings, RefreshCw } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  cleanCount: number;
  dirtyCount: number;
  lastUpdated: string | null;
  connectionStatus: 'online' | 'connecting' | 'offline';
  role: UserRole;
  onOpenPinModal: () => void;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  cleanCount,
  dirtyCount,
  lastUpdated,
  connectionStatus,
  role,
  onOpenPinModal,
  onRefresh,
}) => {
  return (
    <header className="w-full bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                สถานะทำความสะอาดห้อง
              </h1>

              {/* Connection Status Indicator */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  connectionStatus === 'online'
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : connectionStatus === 'connecting'
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="สถานะการเชื่อมต่อ Realtime"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'online'
                      ? 'bg-emerald-400 animate-pulse'
                      : connectionStatus === 'connecting'
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-slate-500'
                  }`}
                />
                <span>
                  {connectionStatus === 'online'
                    ? 'ออนไลน์'
                    : connectionStatus === 'connecting'
                    ? 'กำลังเชื่อมต่อ'
                    : 'ออฟไลน์'}
                </span>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  aria-label="รีเฟรช"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onOpenPinModal}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {role === 'ADMIN' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>แอดมิน</span>
                  </>
                ) : role === 'STAFF' ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>พนักงาน</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>ผู้ดู</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Right Actions & Role Selector */}
          <div className="hidden md:flex items-center gap-3">
            {role === 'ADMIN' && (
              <Link
                href="/admin/rooms"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Settings className="w-4 h-4" />
                <span>จัดการห้อง (Admin)</span>
              </Link>
            )}

            <button
              onClick={onOpenPinModal}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-2 transition-colors min-h-[38px]"
            >
              {role === 'ADMIN' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>โหมด: ผู้ดูแลระบบ (Admin)</span>
                </>
              ) : role === 'STAFF' ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>โหมด: พนักงาน (Staff)</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>โหมด: ผู้ดู (Read-Only)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Counter Cards Grid / Bar */}
        <div className="mt-3.5 grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* Total Rooms */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 sm:p-3 text-center shadow-sm">
            <div className="text-[11px] sm:text-xs font-medium text-slate-400 mb-0.5">
              ทั้งหมด
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              {totalCount}{' '}
              <span className="text-xs font-normal text-slate-400">ห้อง</span>
            </div>
          </div>

          {/* Clean Rooms */}
          <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-2.5 sm:p-3 text-center shadow-sm">
            <div className="text-[11px] sm:text-xs font-medium text-emerald-400 mb-0.5">
              ทำความสะอาดแล้ว
            </div>
            <div className="text-lg sm:text-2xl font-bold text-emerald-300 tracking-tight">
              {cleanCount}
            </div>
          </div>

          {/* Dirty Rooms */}
          <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-2.5 sm:p-3 text-center shadow-sm">
            <div className="text-[11px] sm:text-xs font-medium text-rose-400 mb-0.5">
              รอทำความสะอาด
            </div>
            <div className="text-lg sm:text-2xl font-bold text-rose-300 tracking-tight">
              {dirtyCount}
            </div>
          </div>

          {/* Last Updated Time */}
          <div className="hidden sm:block bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 sm:p-3 text-center shadow-sm">
            <div className="text-[11px] sm:text-xs font-medium text-slate-400 mb-0.5">
              อัปเดตล่าสุด
            </div>
            <div className="text-sm sm:text-lg font-bold text-slate-200 tracking-tight mt-0.5">
              {lastUpdated ? formatBangkokTime(lastUpdated) : '--:--'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
