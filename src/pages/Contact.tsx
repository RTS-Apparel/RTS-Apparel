import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../store/dataStore";
import { pageVariants, buttonHover, buttonTap } from "../lib/animations";
import { PageHeading } from "../components/layout/PageHeading";

export const ContactPage: React.FC = () => {
  const siteSettings = useDataStore((s) => s.siteSettings);
  const addToast = useDataStore((s) => s.addToast);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const shopAddress =
    siteSettings.physical_address?.trim() ||
    "Club Road Near New Cafe Sajawal Sadiqabad, Sadiqabad Pakistan";
  const shopPhone = siteSettings.whatsapp_number?.trim() || "03058165623";
  const facebookUrl = siteSettings.facebook_url?.trim() || "";
  const tiktokUrl = siteSettings.tiktok_url?.trim() || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    addToast("Message sent to ARTS APPAREL Concierge");
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-10"
    >
      <PageHeading
        title="Contact ARTS APPAREL"
        subtitle="Client Concierge · رابطہ کریں"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] hover:border-[#E63946] transition-colors p-6 space-y-6 shadow-xs">
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            ARTS APPAREL Flagship Store
          </h2>
          <div className="space-y-4 text-sm text-[#666666]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
              <span className="text-[#1A1A1A]">{shopAddress}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#E63946] shrink-0" />
              <a
                href={`tel:${shopPhone.replace(/\s+/g, "")}`}
                className="font-mono font-semibold text-[#1A1A1A] hover:text-[#E63946] transition-colors"
              >
                {shopPhone}
              </a>
            </div>
            {siteSettings.contact_email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#E63946] shrink-0" />
                <span className="font-mono font-semibold text-[#1A1A1A]">
                  {siteSettings.contact_email}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/923058165623"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-futuristic w-full h-11 px-4 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C1121F] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#FFFFFF]" />
              <span>Chat on WhatsApp (03058165623)</span>
            </a>
          </div>

          {(facebookUrl || tiktokUrl) && (
            <div className="pt-4 border-t border-[#E0E0E0] space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#E63946] font-semibold">
                Follow ARTS APPAREL
              </p>
              <div className="flex flex-wrap gap-3">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#E63946] text-xs text-[#1A1A1A] hover:text-[#E63946] font-semibold transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-[6px] bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#E63946] text-xs text-[#1A1A1A] hover:text-[#E63946] font-semibold transition-colors"
                  >
                    TikTok
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:col-span-7 rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 space-y-4 shadow-xs"
        >
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            Send a Direct Inquiry
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="contact-name"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                Your Name *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] focus:outline-none text-sm text-[#1A1A1A] placeholder:text-[#999999]"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="contact-phone"
                className="text-xs font-medium text-[#1A1A1A]"
              >
                WhatsApp / Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03058165623"
                className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] focus:outline-none text-sm font-mono text-[#1A1A1A] placeholder:text-[#999999]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="contact-msg"
              className="text-xs font-medium text-[#1A1A1A]"
            >
              Message / Bespoke Measurement Inquiry *
            </label>
            <textarea
              id="contact-msg"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can ARTS APPAREL assist you?"
              className="w-full p-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] focus:border-2 focus:border-[#E63946] focus:outline-none text-sm text-[#1A1A1A] placeholder:text-[#999999]"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="btn-primary-futuristic h-11 px-6 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm flex items-center gap-2 hover:bg-[#C1121F]"
          >
            <Send className="w-4 h-4 text-[#FFFFFF]" />
            <span>Submit Inquiry</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
