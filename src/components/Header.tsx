'use client';

import React from 'react';
import Link from 'next/link';
import { UserRole } from '@/lib/types';
import { formatBangkokTime } from '@/lib/utils';
import {
  ShieldCheck,
  UserCheck,
  Eye,
  Settings,
  RefreshCw,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  cleanCount: number;
  dirtyCount: number;
  lastUpdated: string | null;
  connectionStatus: 'online' | 'connecting' | 'offline';
  isSupabaseConfigured?: boolean;
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
  isSupabaseConfigured,
  role,
  onOpenPinModal,
  onRefresh,
}) => {
  const percentClean = totalCount > 0 ? Math.round((cleanCount / totalCount) * 100) : 0;

  return (
    <header className="w-full bg-[#0b101b]/95 backdrop-blur-xl text-white border-b border-white/[0.08] shadow-2xl sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3.5 pb-4">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Left: Brand & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Luxury Hotel Icon */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0b101b] rounded-[14px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    <span>สถานะห้องพัก</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 font-mono hidden sm:inline-block">
                      {totalCount} ห้อง
                    </span>
                  </h1>

                  {/* Cloud Realtime Status Pill */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                      connectionStatus === 'online'
                        ? isSupabaseConfigured === false
                          ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                        : connectionStatus === 'connecting'
                        ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                    title={
                      isSupabaseConfigured === false
                        ? 'โหมดออฟไลน์/ทดสอบในเครื่อง (ยังไม่ได้เชื่อมต่อ Supabase Database)'
                        : 'เชื่อมต่อ Realtime Cloud Database พร้อมใช้งาน'
                    }
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        connectionStatus === 'online'
                          ? isSupabaseConfigured === false
                            ? 'bg-amber-400'
                            : 'bg-emerald-400 animate-pulse'
                          : connectionStatus === 'connecting'
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-slate-500'
                      }`}
                    />
                    <span>
                      {connectionStatus === 'online'
                        ? isSupabaseConfigured === false
                          ? 'Local Mode'
                          : 'Realtime Cloud'
                        : connectionStatus === 'connecting'
                        ? 'กำลังเชื่อมต่อ...'
                        : 'ออฟไลน์'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 hidden sm:block">
                  ติดตามและอัปเดตงานทำความสะอาดแบบเรียลไทม์
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/[0.08] transition-all active:scale-95"
                  aria-label="รีเฟรชข้อมูล"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenPinModal}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-200 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
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

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                title="รีเฟรชข้อมูลล่าสุด"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>รีเฟรช</span>
              </button>
            )}

            {role === 'ADMIN' && (
              <Link
                href="/admin/rooms"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-900/30 active:scale-95"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>จัดการห้อง (Admin)</span>
              </Link>
            )}

            <button
              onClick={onOpenPinModal}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-200 flex items-center gap-2 transition-all active:scale-95 shadow-sm min-h-[38px]"
            >
              {role === 'ADMIN' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>โหมด: แอดมิน (Admin)</span>
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

        {/* Modern Statistics & Progress Dashboard */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Total Rooms */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-white/[0.08] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">ห้องทั้งหมด</span>
              <Building2 className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                {totalCount}
              </span>
              <span className="text-xs text-slate-400 font-medium">ห้อง</span>
            </div>
            {/* Subtle glow accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 2: Clean Rooms */}
          <div className="bg-gradient-to-b from-emerald-950/40 to-slate-900/60 border border-emerald-500/30 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-lg glow-emerald relative overflow-hidden">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ทำความสะอาดแล้ว</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {percentClean}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight font-mono">
                {cleanCount}
              </span>
              <span className="text-xs text-emerald-400/80 font-medium">ห้อง</span>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 3: Dirty Rooms */}
          <div className="bg-gradient-to-b from-rose-950/40 to-slate-900/60 border border-rose-500/30 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-lg glow-rose relative overflow-hidden">
            <div className="flex items-center justify-between text-rose-400 mb-1">
              <span className="text-xs font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>รอทำความสะอาด</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                {totalCount > 0 ? 100 - percentClean : 0}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-rose-300 tracking-tight font-mono">
                {dirtyCount}
              </span>
              <span className="text-xs text-rose-400/80 font-medium">ห้อง</span>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 4: Last Updated Time & Progress Bar */}
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-white/[0.08] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>อัปเดตล่าสุด</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {lastUpdated ? formatBangkokTime(lastUpdated) : '--:--'}
              </span>
            </div>

            {/* Progress bar visual */}
            <div className="mt-2">
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${percentClean}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                <span>ความคืบหน้ารวม</span>
                <span className="text-emerald-400 font-semibold">{percentClean}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
