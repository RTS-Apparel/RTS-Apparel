import React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useDataStore } from "../../store/dataStore";

export const ToastContainer: React.FC = () => {
  const toasts = useDataStore((s) => s.toasts);
  const removeToast = useDataStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#C9A84C] text-[#1A1A1A] shadow-xl transition-all"
        >
          {toast.type === "success" && (
            <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
          )}
          {toast.type === "info" && (
            <Info className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm">
            <p className="font-semibold text-[#1A1A1A]">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-[#4A4A4A] mt-0.5">
                {toast.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
            className="text-[#9A9A9A] hover:text-[#1A1A1A] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
