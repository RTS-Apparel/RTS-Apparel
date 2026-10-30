import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { aiChat } from "../../lib/ai";
import { isUrduText } from "../../lib/utils";
import { useDataStore } from "../../store/dataStore";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const language = useDataStore((s) => s.language);

  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      role: "assistant",
      content:
        "Assalam-o-Alaikum! Welcome to RTS Apparel. Ask me in English, اردو, or Roman Urdu about Karandi Kurtas, sizing, delivery charges, or referral codes (RTS-ALI123).",
    },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextHistory: ChatTurn[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextHistory);
    setInput("");
    setIsLoading(true);

    const detectedLang = isUrduText(trimmed) ? "ur" : language;
    const res = await aiChat(trimmed, nextHistory, detectedLang);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: res.reply },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen ? (
        <div
          role="dialog"
          aria-label="RTS Apparel AI Assistant"
          className="w-80 sm:w-96 rounded-2xl bg-[#FFFFFF] border border-[#C9A84C] shadow-2xl overflow-hidden flex flex-col h-[460px]"
        >
          <div className="p-4 bg-[#1A1A1A] border-b border-[#E8E0D0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  RTS AI Stylist
                </h3>
                <p className="text-[11px] text-[#C9A84C]">
                  English · اردو · Roman Urdu
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
              className="p-1.5 rounded-lg text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#FAFAFA]">
            {messages.map((m, idx) => {
              const urdu = isUrduText(m.content);
              return (
                <div
                  key={idx}
                  dir={urdu ? "rtl" : "ltr"}
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-[#C9A84C] text-[#1A1A1A] font-medium"
                      : "mr-auto bg-[#FFFFFF] border border-[#E8E0D0] text-[#1A1A1A] shadow-2xs"
                  } ${urdu ? "font-urdu text-sm" : ""}`}
                >
                  {m.content}
                </div>
              );
            })}
            {isLoading && (
              <div className="text-xs text-[#9B7B2F] font-mono animate-pulse">
                RTS Stylist is tailoring a response...
              </div>
            )}
          </div>

          <div className="px-3 py-2 border-t border-[#E8E0D0] bg-[#F5F4F0] flex gap-1.5 overflow-x-auto text-[11px]">
            {[
              "Delivery charges?",
              "Kurta Shalwar dikhao",
              "کرتہ شلوار دکھائیں",
              "How to become an Agent?",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#E8E0D0] text-[#4A4A4A] hover:border-[#C9A84C] hover:text-[#1A1A1A] whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="p-3 border-t border-[#E8E0D0] bg-[#FFFFFF] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "ur"
                  ? "اپنا سوال لکھیں..."
                  : language === "roman_ur"
                  ? "Apna sawal likhein..."
                  : "Ask in English, اردو, or Roman Urdu..."
              }
              aria-label="Message to RTS AI Stylist"
              className="flex-1 h-10 px-3 rounded-lg bg-[#FAFAFA] border border-[#E8E0D0] text-xs text-[#1A1A1A] placeholder-[#9A9A9A] focus:outline-none focus:border-[#C9A84C]"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="w-10 h-10 rounded-lg bg-[#C9A84C] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E2C07A] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open RTS AI Stylist"
          className="px-4 py-3 rounded-xl bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs shadow-lg flex items-center gap-2 hover:bg-[#E2C07A] transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>RTS AI Stylist</span>
        </button>
      )}
    </div>
  );
};
