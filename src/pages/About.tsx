import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants } from "../lib/animations";
import { PageHeading } from "../components/layout/PageHeading";

export const AboutPage: React.FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-5xl mx-auto px-4 md:px-8 py-14 space-y-12"
    >
      <PageHeading
        title="About ARTS APPAREL"
        subtitle="Where Pakistani Men Dress Sharp · ہماری پہچان"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />
      <div className="rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] border-l-4 border-l-[#E63946] p-8 md:p-12 space-y-6 shadow-sm">
        <p className="text-xs text-[#E63946] font-semibold tracking-widest uppercase">
          Our Heritage · ہماری پہچان
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif-display font-bold text-[#1A1A1A]">
          ARTS APPAREL — Where Pakistani Men Dress Sharp.
        </h1>
        <p className="text-base text-[#666666] leading-relaxed">
          Located at Club Road Near New Cafe Sajawal Sadiqabad, Sadiqabad
          Pakistan, ARTS APPAREL bridges classic Pakistani eastern craftsmanship
          with modern bespoke tailoring. Every Karandi Kurta, Boski silk tunic,
          two-ply Egyptian cotton shirt, and full-grain suede jacket is cut and
          finished in small batches.
        </p>
        <p className="text-lg font-urdu text-[#1A1A1A] leading-loose" dir="rtl">
          آرٹس اپیرل (ARTS APPAREL) کا مقصد پاکستانی مردوں کو جدید اور شاہی لگژری انداز میں اعلیٰ ترین معیار کے ملبوسات فراہم کرنا ہے۔
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-colors space-y-2 shadow-xs">
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            01. Bespoke Textiles
          </h2>
          <p className="text-sm text-[#666666] leading-relaxed">
            We source hand-loomed winter Karandi, spun Boski silk, and two-ply
            120s Giza cotton.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-colors space-y-2 shadow-xs">
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            02. Partner Ecosystem
          </h2>
          <p className="text-sm text-[#666666] leading-relaxed">
            Our nationwide Agent Partner network empowers stylists and creators
            across Pakistan to earn transparent commissions on every referred
            order.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] hover:border-[#E63946] transition-colors space-y-2 shadow-xs">
          <h2 className="text-lg font-serif-display font-semibold text-[#1A1A1A]">
            03. Client Assurance
          </h2>
          <p className="text-sm text-[#666666] leading-relaxed">
            Every order includes a 7-day complimentary size exchange and
            doorstep delivery across all major Pakistani cities.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/category/kurta-shalwar"
          className="btn-primary-futuristic inline-flex h-11 px-6 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-sm items-center justify-center hover:bg-[#C1121F]"
        >
          Explore the Collection
        </Link>
      </div>
    </motion.div>
  );
};

export default AboutPage;
