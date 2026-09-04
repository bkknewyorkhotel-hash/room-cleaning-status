'use client';

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { Eye, UserCheck, ShieldCheck, X, KeyRound, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
        {/* Top color stripe */}
        <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl bg-gradient-to-r from-indigo-500 to-violet-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3 shadow-sm">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-1">สลับบทบาทการใช้งาน</h2>
          <p className="text-xs text-slate-500 mb-5">
            โหมดปัจจุบัน: <span className="font-semibold text-slate-800 font-mono">{currentRole}</span>
          </p>

          {/* Role Switcher Cards */}
          <div className="w-full space-y-2.5 mb-5">
            {/* Staff */}
            <button
              onClick={() => handleQuickRole('STAFF')}
              className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between active:scale-[0.98] ${
                currentRole === 'STAFF'
                  ? 'bg-emerald-50 border-emerald-300 shadow-sm ring-1 ring-emerald-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-bold ${currentRole === 'STAFF' ? 'text-emerald-800' : 'text-slate-800'}`}>
                    พนักงานทำความสะอาด
                  </div>
                  <div className="text-[11px] text-slate-500">STAFF • กดเปลี่ยนสถานะห้องได้</div>
                </div>
              </div>
              {currentRole === 'STAFF' && <Check className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* Admin */}
            <button
              onClick={() => handleQuickRole('ADMIN')}
              className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between active:scale-[0.98] ${
                currentRole === 'ADMIN'
                  ? 'bg-purple-50 border-purple-300 shadow-sm ring-1 ring-purple-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-bold ${currentRole === 'ADMIN' ? 'text-purple-800' : 'text-slate-800'}`}>
                    ผู้ดูแลระบบ
                  </div>
                  <div className="text-[11px] text-slate-500">ADMIN • จัดการเพิ่ม/แก้ไขห้องได้</div>
                </div>
              </div>
              {currentRole === 'ADMIN' && <Check className="w-4 h-4 text-purple-600" />}
            </button>

            {/* Viewer */}
            <button
              onClick={() => handleQuickRole('VIEWER')}
              className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between active:scale-[0.98] ${
                currentRole === 'VIEWER'
                  ? 'bg-blue-50 border-blue-300 shadow-sm ring-1 ring-blue-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-bold ${currentRole === 'VIEWER' ? 'text-blue-800' : 'text-slate-800'}`}>
                    ผู้ดูสถานะอย่างเดียว
                  </div>
                  <div className="text-[11px] text-slate-500">VIEWER • ดูอย่างเดียว ไม่แก้ไข</div>
                </div>
              </div>
              {currentRole === 'VIEWER' && <Check className="w-4 h-4 text-blue-600" />}
            </button>
          </div>

          {/* PIN Form */}
          <div className="w-full pt-4 border-t border-slate-100">
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <div className="text-left text-xs font-semibold text-slate-500">
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
                  className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 px-3 py-2.5 text-center font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-lg tracking-widest"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
                >
                  ตกลง
                </button>
              </div>
              {errorMsg && <p className="text-xs text-rose-600 text-left">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
