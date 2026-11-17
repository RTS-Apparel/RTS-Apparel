import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const NotFound: React.FC = () => (
  <section className="min-h-[65vh] flex items-center justify-center px-4 py-16">
    <div className="max-w-lg w-full text-center space-y-5">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#E63946]">ARTS APPAREL</p>
      <h1 className="text-7xl sm:text-8xl font-bold font-mono text-[#E63946]">404</h1>
      <h2 className="text-2xl font-semibold text-[#1A1A1A]">Page not found</h2>
      <p className="text-sm text-[#666666]">The page you are looking for may have moved or the address may be incorrect.</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#E63946] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C1121F] transition-colors">
          <Home size={16} /> Back to Home
        </Link>
        <button type="button" onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#D1D5DB] px-5 py-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F3F4F6] transition-colors">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  </section>
);

export default NotFound;
