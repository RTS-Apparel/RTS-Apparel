import React, { useState } from "react";
import { Copy, CheckCircle, ShieldCheck, Database, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";
import { useDataStore } from "../../store/dataStore";

export const ADMIN_SETUP_SQL = `-- 1. Insert or promote your Supabase Auth User to Admin
INSERT INTO public.users (id, full_name, phone, role, is_approved, is_blocked)
VALUES (
  'YOUR-AUTH-USER-UUID-HERE',
  'Admin',
  '03058165623',
  'admin',
  true,
  false
)
ON CONFLICT (id) DO UPDATE SET role = 'admin', is_approved = true;

-- 2. Enable RLS & Policies for public.users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own row
CREATE POLICY "Users can read own data" ON public.users
FOR SELECT USING (auth.uid() = id);

-- Allow admin to read all users
CREATE POLICY "Admin can read all users" ON public.users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);`;

export const SetupGuideBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const addToast = useDataStore((s) => s.addToast);

  if (dismissed) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(ADMIN_SETUP_SQL).catch(() => {});
    setCopied(true);
    addToast("Supabase SQL copied to clipboard!", "success");
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-[8px] bg-[#1A1A1A] border-2 border-[#E63946] p-5 space-y-4 text-[#FFFFFF] shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#E63946] flex items-center justify-center text-[#FFFFFF] shrink-0">
            <Database size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF]">
              Supabase Admin User &amp; RLS Policy Setup Guide
            </h3>
            <p className="text-xs text-[#CCCCCC]">
              Run this SQL in Supabase Dashboard → SQL Editor. Replace{" "}
              <code className="text-[#E63946] font-mono">
                YOUR-AUTH-USER-UUID-HERE
              </code>{" "}
              with your actual user UUID from Supabase Dashboard → Authentication → Users.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="h-9 px-3.5 rounded-[6px] bg-[#E63946] hover:bg-[#C1121F] text-[#FFFFFF] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            <span>{copied ? "Copied!" : "Copy SQL"}</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="h-9 px-3 rounded-[6px] bg-[#2A2A2A] hover:bg-[#333333] text-[#CCCCCC] text-xs font-medium transition-colors"
          >
            Hide
          </button>
        </div>
      </div>

      <pre className="p-4 rounded-[6px] bg-[#0D0D0D] border border-[#333333] text-xs font-mono text-[#CCCCCC] overflow-x-auto leading-relaxed">
        {ADMIN_SETUP_SQL}
      </pre>
    </div>
  );
};

export const SetupGuide: React.FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 bg-[#F5F5F5] rounded-[8px]"
    >
      <AdminSidebar />
      <div className="flex-1 space-y-6">
        <PageHeading
          title="Supabase Setup Guide"
          subtitle="Configure Admin Role & Row Level Security in Supabase"
          icon={<ShieldCheck size={18} />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Setup Guide" },
          ]}
          actions={
            <Link
              to="/admin"
              className="h-10 px-4 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs flex items-center gap-2 hover:bg-[#C1121F] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
          }
        />
        <SetupGuideBanner />
      </div>
    </motion.div>
  );
};

export default SetupGuide;
