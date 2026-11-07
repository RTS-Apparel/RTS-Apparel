import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Bot, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { aiChat } from "../lib/ai";

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const formattedTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([{
    id: "welcome-msg",
    role: "assistant",
    content: "Assalam o Alaikum Bhai! 👋\nMain ARTS APPAREL ka assistant hun.\nOrders, delivery, sizes ya products ke bare mein kuch bhi pooch sakte hain.",
    timestamp: formattedTime(),
  }]);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const content = input.trim();
    if (!content || isLoading) return;
    const userTurn: ChatTurn = { id: `user-${Date.now()}`, role: "user", content, timestamp: formattedTime() };
    const history = [...messages, userTurn].slice(-8).map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, userTurn]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await aiChat(content, history.slice(0, -1), "roman_ur");
      setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: "assistant", content: response.reply || "Maazrat, abhi jawab nahi mil saka. Dobara koshish karein.", timestamp: formattedTime() }]);
    } catch {
      setMessages((prev) => [...prev, { id: `ai-error-${Date.now()}`, role: "assistant", content: "Maazrat Bhai, connection mein masla aa gaya. Thori dair baad dobara koshish karein.", timestamp: formattedTime() }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-end bg-black/25 p-2 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) navigate(-1); }}>
    <main className="flex h-[min(760px,calc(100dvh-24px))] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-white/70 bg-[#F4F4F4] text-[#1A1A1A] shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:h-[min(760px,calc(100dvh-40px))]">
      <header className="shrink-0 bg-[#111111] text-white border-b border-[#333333] shadow-lg">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 h-[68px] flex items-center gap-3">
          <button type="button" onClick={() => navigate("/")} aria-label="Back to website" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/15 transition-colors">
            <ArrowLeft size={23} />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#E63946] flex items-center justify-center"><Bot size={22} /></div>
          <div className="min-w-0">
            <h1 className="font-bold tracking-wide text-sm sm:text-base"><span className="text-white">ARTS</span><span className="text-[#E63946]"> APPAREL</span> Assistant</h1>
            <p className="text-[11px] text-[#B8B8B8] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Online · Support & Shopping Help</p>
          </div>
          <button type="button" onClick={() => navigate("/")} className="ml-auto text-xs sm:text-sm text-[#E8E8E8] hover:text-white border border-white/20 rounded-lg px-3 py-2">Website</button>
        </div>
      </header>

      <section ref={messagesRef} aria-label="Chat messages" className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-5 sm:py-8 space-y-4">
          <div className="text-center text-[10px] uppercase tracking-[0.2em] text-[#888888] pb-2">ARTS APPAREL · Customer Concierge</div>
          {messages.map((message) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[88%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${message.role === "user" ? "bg-[#E63946] text-white rounded-br-md" : "bg-white border border-[#E5E5E5] border-l-[3px] border-l-[#E63946] text-[#222222] rounded-bl-md"}`}>{message.content}</div>
              <span className="text-[10px] text-[#888888] mt-1 px-1">{message.timestamp}</span>
            </motion.div>
          ))}
          {isLoading && <div className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#E5E5E5] px-4 py-3 text-xs text-[#666666]"><span className="flex gap-1"><i className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-bounce" /><i className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-bounce [animation-delay:120ms]" /><i className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-bounce [animation-delay:240ms]" /></span>Assistant jawab tayyar kar raha hai...</div>}
        </div>
      </section>

      <footer className="shrink-0 bg-white border-t border-[#E3E3E3] pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 pt-3 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {["Delivery kitne din mein?", "Order track kaise karun?", "Return policy kya hai?", "Size chart dikhao"].map((prompt) => <button key={prompt} type="button" onClick={() => setInput(prompt)} className="shrink-0 rounded-full border border-[#E2E2E2] bg-[#FAFAFA] px-3 py-2 text-[11px] text-[#333333] hover:border-[#E63946]">{prompt}</button>)}
          </div>
          <form onSubmit={sendMessage} className="flex items-end gap-2">
            <textarea ref={inputRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }} placeholder="Apna sawal yahan likhein..." aria-label="Message" className="flex-1 min-w-0 min-h-12 max-h-32 resize-y rounded-xl border border-[#DADADA] bg-[#FAFAFA] px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#E63946]" />
            <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message" className="w-12 h-12 shrink-0 rounded-xl bg-[#E63946] text-white flex items-center justify-center hover:bg-[#C1121F] disabled:opacity-40 disabled:cursor-not-allowed"><Send size={19} /></button>
          </form>
          <p className="text-center text-[10px] text-[#999999] mt-2">ARTS APPAREL · Yahan hum aapki madad ke liye mojood hain</p>
        </div>
      </footer>
    </main>
    </div>
  );
};

export default ChatPage;
