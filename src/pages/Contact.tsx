import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useDataStore } from "../store/dataStore";

export const ContactPage: React.FC = () => {
  const siteSettings = useDataStore((s) => s.siteSettings);
  const addToast = useDataStore((s) => s.addToast);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    addToast("Message sent to RTS Flagship Concierge");
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-10">
      <div>
        <p className="text-xs text-[#C9A84C] font-semibold tracking-widest uppercase">
          Client Concierge
        </p>
        <h1 className="text-3xl font-serif-display font-bold text-[#1A1A1A] mt-1">
          Contact RTS Apparel · رابطہ کریں
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-6 shadow-xs">
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            Lahore Flagship Atelier
          </h2>
          <div className="space-y-4 text-sm text-[#4A4A4A]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <span>{siteSettings.physical_address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#C9A84C] shrink-0" />
              <span className="font-mono font-semibold text-[#1A1A1A]">
                {siteSettings.whatsapp_number}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#C9A84C] shrink-0" />
              <span className="font-mono font-semibold text-[#1A1A1A]">
                {siteSettings.contact_email}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:col-span-7 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 shadow-xs"
        >
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            Send a Direct Inquiry
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="contact-name" className="text-xs font-medium text-[#4A4A4A]">
                Your Name *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="contact-phone" className="text-xs font-medium text-[#4A4A4A]">
                WhatsApp / Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm font-mono text-[#1A1A1A]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="contact-msg" className="text-xs font-medium text-[#4A4A4A]">
              Message / Bespoke Measurement Inquiry *
            </label>
            <textarea
              id="contact-msg"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-sm text-[#1A1A1A]"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm flex items-center gap-2 hover:bg-[#E2C07A]"
          >
            <Send className="w-4 h-4" />
            <span>Submit Inquiry</span>
          </button>
        </form>
      </div>
    </div>
  );
};
