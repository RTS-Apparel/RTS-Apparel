import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, ChevronDown, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { aiChat } from "../../lib/ai";

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function getFormattedTime(): string {
  try {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Just now";
  }
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [mobileViewport, setMobileViewport] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const updateViewport = () => {
      if (window.innerWidth < 768) setMobileViewport({ top: viewport.offsetTop, height: viewport.height });
      else setMobileViewport(null);
    };
    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const scrollMessagesToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const [messages, setMessages] = useState<ChatTurn[]>([  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => scrollMessagesToBottom("auto"));
  }, [messages, isLoading, isOpen, mobileViewport, scrollMessagesToBottom]);

  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Assalam o Alaikum Bhai! 👋 \nMain ARTS APPAREL ka assistant hun. \nKuch bhi poochho — orders, delivery, sizes — \nsab ke jawab mere paas hain! 😄",
      timestamp: getFormattedTime(),
    },
  ]);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => scrollMessagesToBottom("auto"));
  }, [messages, isLoading, isOpen, mobileViewport, scrollMessagesToBottom]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpenedOnce(true);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userTurn: ChatTurn = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: getFormattedTime(),
    };

    const historySlice = messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userTurn]);
    setInput("");
    setIsLoading(true);

    const res = await aiChat(trimmed, historySlice, "roman_ur");

    const assistantTurn: ChatTurn = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: res.reply,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, assistantTurn]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className={isOpen ? "fixed bottom-5 right-5 z-50" : "fixed right-3 top-[42%] -translate-y-1/2 z-50 md:top-auto md:bottom-5 md:right-5 md:translate-y-0"}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.85, y: 24, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0, transformOrigin: "bottom right" }}
            exit={{ opacity: 0, scale: 0.85, y: 24, transformOrigin: "bottom right" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            role="dialog"
            aria-label="ARTS APPAREL Support Assistant"
            style={mobileViewport ? { top: `${mobileViewport.top}px`, height: `${mobileViewport.height}px`, bottom: "auto" } : undefined}
          >
            {/* Header: bg #1A1A1A, title "A(white)RTS(red) APPAREL(white)", status green dot */}
            <div className="px-4 py-3.5 bg-[#1A1A1A] border-b border-[#333333] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E63946] text-[#FFFFFF] flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-base font-bold tracking-wider uppercase"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                    >
                      <span className="text-[#FFFFFF]">A</span>
                      <span className="text-[#E63946]">RTS</span>
                      <span className="text-[#FFFFFF]"> APPAREL</span>
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[10px] font-medium text-[#22C55E]">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] -ml-3.5" />
                      <span>Online</span>
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#CCCCCC] mt-0.5">
                    Support Assistant 🤖
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Support Assistant"
                className="p-2 rounded-lg text-[#CCCCCC] hover:text-[#FFFFFF] hover:bg-[#2A2A2A] transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3.5 bg-[#FFFFFF] [scrollbar-gutter:stable]">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{
                    opacity: 0,
                    y: 12,
                    x: m.role === "user" ? 18 : -18,
                  }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-[#E63946] text-[#FFFFFF] font-medium rounded-br-xs shadow-sm"
                        : "bg-[#F5F5F5] text-[#1A1A1A] border border-[#E0E0E0] border-l-[3px] border-l-[#E63946] rounded-bl-xs"
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[10px] text-[#666666] mt-1 px-1">
                    {m.timestamp}
                  </span>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-start space-y-1"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-[#E0E0E0] border-l-[3px] border-l-[#E63946]">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="w-2 h-2 rounded-full bg-[#E63946]"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.55,
                            repeat: Infinity,
                            delay: dot * 0.15,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#666666] ml-1">
                      ARTS Assistant likh raha hai...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Roman Urdu Prompts */}
            <div className="px-3 py-2 border-t border-[#E0E0E0] bg-[#F5F5F5] flex gap-1.5 overflow-x-auto text-[11px] shrink-0">
              {[
                "Delivery kitne din mein?",
                "Order track kaise karun?",
                "Return policy kya hai?",
                "Size chart dikhao",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="px-2.5 py-1 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-[#1A1A1A] hover:border-[#E63946] hover:text-[#E63946] whitespace-nowrap transition-colors font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className="chat-input-form p-3 border-t border-[#E0E0E0] bg-[#FFFFFF] flex items-center gap-2 shrink-0"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => window.setTimeout(() => scrollMessagesToBottom("smooth"), 250)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Kuch bhi poochho Bhai... 😊"
                aria-label="Kuch bhi poochho Bhai"
                className="flex-1 min-w-0 min-h-11 max-h-24 resize-none px-3.5 py-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm leading-5 text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946] overflow-y-auto"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Send message"
                className="w-11 h-11 rounded-[6px] bg-[#E63946] hover:bg-[#C1121F] text-[#FFFFFF] flex items-center justify-center shrink-0 transition-colors"
              >
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <button
            key="chat-trigger"
            type="button"
            onClick={handleOpen}
            aria-label="Open ARTS APPAREL Support Assistant"
            className="chat-trigger-btn relative w-[60px] h-[60px] rounded-full bg-[#E63946] flex items-center justify-center text-[#FFFFFF] cursor-pointer"
          >
            {!hasOpenedOnce && (
              <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A1A1A] opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#1A1A1A] border-2 border-[#FFFFFF]" />
              </span>
            )}

            <MessageCircle size={24} />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
};
