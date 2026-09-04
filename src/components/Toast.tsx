'use client';

import React from 'react';
import { ToastMessage } from '@/lib/types';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border transition-all animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'error'
              ? 'bg-white border-rose-200 text-rose-700 shadow-rose-100'
              : toast.type === 'success'
              ? 'bg-white border-emerald-200 text-emerald-700 shadow-emerald-100'
              : 'bg-white border-blue-200 text-blue-700 shadow-blue-50'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            )}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
            <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2"
            aria-label="ปิดแจ้งเตือน"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
