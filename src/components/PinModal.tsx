'use client';

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { Lock, Eye, UserCheck, ShieldCheck, X, KeyRound, Check } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickRole = (targetRole: UserRole) => {
    onSelectRole(targetRole);
    onClose();
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      onSelectRole('STAFF');
      onClose();
    } else if (pin === '8888') {
      onSelectRole('ADMIN');
      onClose();
    } else {
      setErrorMsg('รหัส PIN ไม่ถูกต้อง (ทดลองใช้ 1234 สำหรับ Staff หรือ 8888 สำหรับ Admin)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0c1220] border border-white/[0.1] rounded-3xl shadow-2xl p-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-lg shadow-indigo-950/50 glow-indigo">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-extrabold text-white mb-1">สลับบทบาทการใช้งาน</h2>
          <p className="text-xs text-slate-400 mb-5">
            โหมดปัจจุบัน: <span className="font-semibold text-white font-mono">{currentRole}</span>
          </p>

          {/* Role Switcher Cards */}
          <div className="w-full space-y-2.5 mb-5">
            {/* Staff */}
            <button
              onClick={() => handleQuickRole('STAFF')}
              className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between active:scale-[0.98] ${
                currentRole === 'STAFF'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-100 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <span>พนักงานทำความสะอาด</span>
                  </div>
                  <div className="text-[11px] text-slate-400">STAFF • กดเปลี่ยนสถานะห้องได้</div>
                </div>
              </div>
              {currentRole === 'STAFF' && <Check className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Admin */}
            <button
              onClick={() => handleQuickRole('ADMIN')}
              className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between active:scale-[0.98] ${
                currentRole === 'ADMIN'
                  ? 'bg-purple-950/60 border-purple-500/50 text-purple-100 shadow-md shadow-purple-950/40 ring-1 ring-purple-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <span>ผู้ดูแลระบบ</span>
                  </div>
                  <div className="text-[11px] text-slate-400">ADMIN • จัดการเพิ่ม/แก้ไขห้องได้</div>
                </div>
              </div>
              {currentRole === 'ADMIN' && <Check className="w-4 h-4 text-purple-400" />}
            </button>

            {/* Viewer */}
            <button
              onClick={() => handleQuickRole('VIEWER')}
              className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between active:scale-[0.98] ${
                currentRole === 'VIEWER'
                  ? 'bg-blue-950/60 border-blue-500/50 text-blue-100 shadow-md shadow-blue-950/40 ring-1 ring-blue-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <span>ผู้ดูสถานะอย่างเดียว</span>
                  </div>
                  <div className="text-[11px] text-slate-400">VIEWER • ดูอย่างเดียว ไม่แก้ไข</div>
                </div>
              </div>
              {currentRole === 'VIEWER' && <Check className="w-4 h-4 text-blue-400" />}
            </button>
          </div>

          {/* Quick PIN Keypad Form */}
          <div className="w-full pt-4 border-t border-white/[0.08]">
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <div className="text-left text-xs font-semibold text-slate-400">
                หรือป้อน PIN พนักงาน (1234) / แอดมิน (8888):
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="PIN"
                  className="flex-1 bg-slate-950/90 text-white placeholder-slate-600 px-3 py-2.5 text-center font-mono rounded-xl border border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg tracking-widest"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-950/50 active:scale-95"
                >
                  ตกลง
                </button>
              </div>
              {errorMsg && <p className="text-xs text-rose-400 text-left">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
