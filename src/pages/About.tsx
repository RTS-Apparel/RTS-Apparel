import React from "react";
import { Link } from "react-router-dom";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 space-y-12">
      <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-8 md:p-12 space-y-6 shadow-xs">
        <p className="text-xs text-[#C9A84C] font-semibold tracking-widest uppercase">
          Our Heritage · ہماری پہچان
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif-display font-bold text-[#1A1A1A]">
          Where Pakistani Men Dress Sharp.
        </h1>
        <p className="text-base text-[#4A4A4A] leading-relaxed">
          Founded in Lahore, RTS Apparel bridges classic Pakistani eastern craftsmanship with architectural western tailoring. Every Karandi Kurta, Boski silk tunic, two-ply Egyptian cotton shirt, and full-grain suede jacket is cut and finished in small batches.
        </p>
        <p className="text-lg font-urdu text-[#C9A84C] leading-loose" dir="rtl">
          آر ٹی ایس اپیرل کا مقصد پاکستانی مردوں کو کلاسک لگژری انداز میں اعلیٰ ترین معیار کے ملبوسات فراہم کرنا ہے۔
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-2 shadow-xs">
          <h2 className="text-lg font-serif-display font-semibold text-[#C9A84C]">
            01. Bespoke Textiles
          </h2>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            We source hand-loomed winter Karandi from Kamalia, spun Boski silk, and two-ply 120s Giza cotton.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-2 shadow-xs">
          <h2 className="text-lg font-serif-display font-semibold text-[#C9A84C]">
            02. Partner Ecosystem
          </h2>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            Our nationwide Agent Partner network empowers stylists and creators across Pakistan to earn transparent commissions on every referred order.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] space-y-2 shadow-xs">
          <h2 className="text-lg font-serif-display font-semibold text-[#C9A84C]">
            03. Client Assurance
          </h2>
          <p className="text-sm text-[#4A4A4A] leading-relaxed">
            Every order includes a 7-day complimentary size exchange and doorstep delivery across all major Pakistani cities.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/category/kurta-shalwar"
          className="inline-flex h-11 px-6 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm items-center justify-center hover:bg-[#E2C07A]"
        >
          Explore the Collection
        </Link>
      </div>
    </div>
  );
};
