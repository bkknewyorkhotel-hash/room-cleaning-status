'use client';

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { Lock, Eye, UserCheck, ShieldCheck, X } from 'lucide-react';

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
      setErrorMsg('รหัส PIN ไม่ถูกต้อง (ทดลองใช้ 1234 หรือ 8888)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-white mb-1">เลือกบทบาทการใช้งาน</h2>
          <p className="text-xs text-slate-400 mb-5">
            ปัจจุบัน: <span className="font-semibold text-white">{currentRole}</span>
          </p>

          {/* Role Switcher Buttons */}
          <div className="w-full space-y-2 mb-6">
            <button
              onClick={() => handleQuickRole('STAFF')}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all border ${
                currentRole === 'STAFF'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>พนักงานทำความสะอาด (STAFF)</span>
              </div>
              <span className="text-[10px] bg-slate-950/60 px-2 py-0.5 rounded text-slate-400">เปลี่ยนสถานะได้</span>
            </button>

            <button
              onClick={() => handleQuickRole('ADMIN')}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all border ${
                currentRole === 'ADMIN'
                  ? 'bg-purple-950/80 border-purple-500/60 text-purple-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>ผู้ดูแลระบบ (ADMIN)</span>
              </div>
              <span className="text-[10px] bg-slate-950/60 px-2 py-0.5 rounded text-slate-400">จัดการห้องพักได้</span>
            </button>

            <button
              onClick={() => handleQuickRole('VIEWER')}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all border ${
                currentRole === 'VIEWER'
                  ? 'bg-blue-950/80 border-blue-500/60 text-blue-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-slate-400" />
                <span>ผู้ดูสถานะอย่างเดียว (VIEWER)</span>
              </div>
              <span className="text-[10px] bg-slate-950/60 px-2 py-0.5 rounded text-slate-400">ดูอย่างเดียว</span>
            </button>
          </div>

          {/* Optional PIN Input */}
          <div className="w-full pt-4 border-t border-slate-800">
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <div className="text-left text-xs font-semibold text-slate-400">
                หรือใส่รหัส PIN พนักงาน / แอดมิน:
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
                  placeholder="PIN (เช่น 1234)"
                  className="flex-1 bg-slate-950 text-white placeholder-slate-600 px-3 py-2 text-center font-mono rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  ยืนยัน
                </button>
              </div>
              {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
