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
    <header className="w-full bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-200/80 shadow-sm sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3.5 pb-4">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Left: Brand & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hotel Icon */}
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100/80 shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                    <span>สถานะห้องพัก</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-mono hidden sm:inline-block border border-slate-200/60">
                      {totalCount} ห้อง
                    </span>
                  </h1>

                  {/* Cloud Realtime Status Pill */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors shadow-xs ${
                      connectionStatus === 'online'
                        ? isSupabaseConfigured === false
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : connectionStatus === 'connecting'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
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
                            ? 'bg-amber-500'
                            : 'bg-emerald-500 animate-pulse'
                          : connectionStatus === 'connecting'
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-slate-400'
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

                <p className="text-[11px] text-slate-500 hidden sm:block">
                  ระบบติดตามและอัปเดตงานทำความสะอาดห้องพักโรงแรม Real-time
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all active:scale-95 shadow-xs"
                  aria-label="รีเฟรชข้อมูล"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenPinModal}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
              >
                {role === 'ADMIN' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>แอดมิน</span>
                  </>
                ) : role === 'STAFF' ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>พนักงาน</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>ผู้ดู</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                title="รีเฟรชข้อมูลล่าสุด"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>รีเฟรช</span>
              </button>
            )}

            {role === 'ADMIN' && (
              <Link
                href="/admin/rooms"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>จัดการห้อง (Admin)</span>
              </Link>
            )}

            <button
              onClick={onOpenPinModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-2 transition-all active:scale-95 shadow-xs min-h-[38px]"
            >
              {role === 'ADMIN' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>โหมด: แอดมิน (Admin)</span>
                </>
              ) : role === 'STAFF' ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>โหมด: พนักงาน (Staff)</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>โหมด: ผู้ดู (Read-Only)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Clean Light Statistics Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Total Rooms */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs group">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">ห้องทั้งหมด</span>
              <Building2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {totalCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">ห้อง</span>
            </div>
          </div>

          {/* Card 2: Clean Rooms */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-emerald-800 mb-1">
              <span className="text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ทำความสะอาดแล้ว</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {percentClean}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight font-mono">
                {cleanCount}
              </span>
              <span className="text-xs text-emerald-600 font-medium">ห้อง</span>
            </div>
          </div>

          {/* Card 3: Dirty Rooms */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-rose-800 mb-1">
              <span className="text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>รอทำความสะอาด</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono">
                {totalCount > 0 ? 100 - percentClean : 0}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight font-mono">
                {dirtyCount}
              </span>
              <span className="text-xs text-rose-600 font-medium">ห้อง</span>
            </div>
          </div>

          {/* Card 4: Last Updated Time & Progress Bar */}
          <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>อัปเดตล่าสุด</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-800">
                {lastUpdated ? formatBangkokTime(lastUpdated) : '--:--'}
              </span>
            </div>

            {/* Progress bar visual */}
            <div className="mt-2">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${percentClean}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                <span>ความคืบหน้ารวม</span>
                <span className="text-emerald-700 font-bold">{percentClean}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
