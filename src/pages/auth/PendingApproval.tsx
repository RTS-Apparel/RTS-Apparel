import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowLeft, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { pageVariants } from "../../lib/animations";

export const PendingApprovalPage: React.FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-lg mx-auto px-4 py-16"
    >
      <div className="rounded-xl bg-[#FFFFFF] border-2 border-[#E63946] p-8 text-center space-y-5 shadow-md">
        <div className="w-14 h-14 rounded-full bg-[#1A1A1A] text-[#E63946] flex items-center justify-center mx-auto">
          <Clock size={28} />
        </div>
        <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
          Account Pending Admin Approval
        </h1>
        <p className="text-sm text-[#666666] leading-relaxed">
          Aapki agent application abhi review mein hai. Admin approve karne ke
          baad aapko WhatsApp par confirm karega aur aapka referral code active
          ho jayega.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-[6px] bg-[#1A1A1A] text-[#FFFFFF] font-semibold text-xs inline-flex items-center gap-2 hover:bg-[#333333] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
          <a
            href="https://wa.me/923058165623"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs inline-flex items-center gap-2 hover:bg-[#C1121F] transition-colors"
          >
            <MessageCircle size={16} />
            <span>Contact WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default PendingApprovalPage;
