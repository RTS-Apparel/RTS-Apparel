import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users2,
  CheckCircle,
  UserPlus,
  ArrowLeft,
  Phone,
  MapPin,
  MessageCircle,
  Lock,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useDataStore } from "../store/dataStore";
import { pageVariants } from "../lib/animations";

export const AgentApplyPage: React.FC = () => {
  const registerUser = useDataStore((s) => s.registerUser);
  const addToast = useDataStore((s) => s.addToast);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [whatsapp, setWhatsapp] = useState("");
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanName = fullName.trim();
      const cleanPhone = phone.trim();
      const cleanCity = city.trim();
      const cleanWhatsapp = whatsapp.trim() || cleanPhone;
      const cleanReason = reason.trim();
      const generatedEmail = `${cleanPhone.replace(/[^0-9]/g, "")}@agent.artsapparel.pk`;

      if (isSupabaseConfigured) {
        const { data: authData } = await supabase.auth.signUp({
          email: generatedEmail,
          password,
        });

        await supabase.from("users").insert({
          id: authData?.user?.id || `agent-${Date.now()}`,
          full_name: cleanName,
          phone: cleanPhone,
          city: cleanCity,
          whatsapp_number: cleanWhatsapp,
          join_reason: cleanReason || null,
          role: "agent",
          is_approved: false,
          is_blocked: false,
        });
      }

      registerUser({
        email: generatedEmail,
        full_name: cleanName,
        phone: cleanPhone,
        role: "agent",
        referral_code: null,
        is_approved: false,
        is_blocked: false,
        join_reason: `${cleanCity} | WhatsApp: ${cleanWhatsapp}${
          cleanReason ? ` | ${cleanReason}` : ""
        }`,
      });

      addToast("Agent application submitted for review!", "success");
      setSubmitted(true);
    } catch (err) {
      setError("Application submit karne mein masla aaya. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-lg mx-auto px-4 py-16"
      >
        <div className="rounded-xl bg-[#FFFFFF] border-2 border-[#E63946] p-8 text-center space-y-5 shadow-md">
          <CheckCircle size={48} color="#22C55E" className="mx-auto" />
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Application Received
          </h1>
          <p className="text-sm text-[#1A1A1A] leading-relaxed font-medium">
            Aapki application submit ho gayi! Admin review karne ke baad aapko
            WhatsApp par confirm karega.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/"
              className="px-6 py-2.5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#C1121F] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-lg mx-auto px-4 py-12"
    >
      <div className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] p-6 sm:p-8 space-y-6 shadow-md">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-[#E63946] flex items-center justify-center mx-auto">
            <Users2 size={24} />
          </div>
          <p className="text-xs text-[#E63946] font-semibold tracking-widest uppercase">
            ARTS APPAREL · Partner Network
          </p>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            Join ARTS Team
          </h1>
          <p className="text-xs text-[#666666]">
            Apply to become an official ARTS APPAREL referral partner.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-[6px] bg-[#F8D7DA] border border-[#E63946] text-xs text-[#E63946] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="aa-name"
              className="text-xs font-medium text-[#1A1A1A] flex items-center gap-1.5"
            >
              <User size={14} className="text-[#E63946]" />
              <span>Full Name *</span>
            </label>
            <input
              id="aa-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ali Raza Khan"
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="aa-phone"
                className="text-xs font-medium text-[#1A1A1A] flex items-center gap-1.5"
              >
                <Phone size={14} className="text-[#E63946]" />
                <span>Phone *</span>
              </label>
              <input
                id="aa-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0305-8165623"
                className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="aa-city"
                className="text-xs font-medium text-[#1A1A1A] flex items-center gap-1.5"
              >
                <MapPin size={14} className="text-[#E63946]" />
                <span>City *</span>
              </label>
              <input
                id="aa-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Sadiqabad / Lahore"
                className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="aa-whatsapp"
              className="text-xs font-medium text-[#1A1A1A] flex items-center gap-1.5"
            >
              <MessageCircle size={14} className="text-[#E63946]" />
              <span>WhatsApp Number *</span>
            </label>
            <input
              id="aa-whatsapp"
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="0305-8165623"
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm font-mono text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="aa-reason"
              className="text-xs font-medium text-[#1A1A1A]"
            >
              Why do you want to join? (Optional)
            </label>
            <textarea
              id="aa-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us about your network or social media reach..."
              className="w-full p-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="aa-password"
              className="text-xs font-medium text-[#1A1A1A] flex items-center gap-1.5"
            >
              <Lock size={14} className="text-[#E63946]" />
              <span>Password *</span>
            </label>
            <input
              id="aa-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full h-11 px-3.5 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#C1121F] transition-colors btn-primary-futuristic"
          >
            <UserPlus size={16} />
            <span>
              {loading ? "Submitting Application..." : "Submit Application"}
            </span>
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AgentApplyPage;
