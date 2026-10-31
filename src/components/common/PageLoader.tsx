import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const PageLoader: React.FC = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShow(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="arts-page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
          aria-hidden="true"
          className="fixed inset-0 z-[10000] bg-[#1A1A1A] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center text-2xl sm:text-4xl font-bold uppercase tracking-[0.12em]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            <span className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333333] text-[#FFFFFF] rounded-xs">
              A
            </span>
            <span className="px-2.5 py-1 bg-[#E63946] text-[#FFFFFF] rounded-xs ml-1">
              RTS
            </span>
            <span className="ml-2.5 text-[#FFFFFF]">APPAREL</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="mt-3 text-xs sm:text-sm uppercase tracking-[0.28em] text-[#CCCCCC] font-medium"
          >
            Premium Men&apos;s Fashion
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
