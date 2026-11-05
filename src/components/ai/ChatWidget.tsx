import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const ChatWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      type="button"
      onClick={() => navigate("/assistant")}
      aria-label="Open ARTS APPAREL Support Assistant"
      title="Chat with ARTS APPAREL"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="chat-trigger-btn fixed z-[80] bottom-5 left-16 md:bottom-5 md:left-auto md:right-24 w-14 h-14 md:w-14 md:h-14 rounded-full bg-[#E63946] hover:bg-[#C1121F] text-white shadow-[0_8px_28px_rgba(230,57,70,0.38)] border-2 border-white flex items-center justify-center transition-colors"
    >
      <MessageCircle size={25} strokeWidth={2.2} />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#22C55E] border-2 border-white" />
    </motion.button>
  );
};

export default ChatWidget;
