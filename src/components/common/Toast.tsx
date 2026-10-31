import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataStore } from "../../store/dataStore";

export const ToastContainer: React.FC = () => {
  const toasts = useDataStore((s) => s.toasts);
  const removeToast = useDataStore((s) => s.removeToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      window.setTimeout(() => {
        removeToast(t.id);
      }, 3000)
    );
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[9995] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#1A1A1A] border border-[#333333] border-l-4 border-l-[#E63946] text-[#FFFFFF] shadow-xl"
          >
            {toast.type === "success" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.35 }}
              >
                <CheckCircle className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
              </motion.div>
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm">
              <p className="font-semibold text-[#FFFFFF]">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[#CCCCCC] mt-0.5">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#CCCCCC] hover:text-[#FFFFFF] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
