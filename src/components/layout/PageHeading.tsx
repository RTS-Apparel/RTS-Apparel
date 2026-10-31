import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  href?: string;
}

export interface PageHeadingProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  subtitle,
  icon,
  breadcrumbs,
  actions,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        backgroundColor: "#1A1A1A",
        borderLeft: "4px solid #E63946",
      }}
      className={`relative w-full rounded-lg border border-[#333333] p-5 sm:p-6 mb-6 overflow-hidden shadow-md ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-[#E63946] flex items-center justify-center text-[#FFFFFF] shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1
                className="text-2xl sm:text-[28px] font-bold text-[#FFFFFF] leading-tight inline-block relative pb-1.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
                <span className="absolute left-0 bottom-0 w-16 h-[3px] rounded-full bg-[#E63946]" />
              </h1>
              {subtitle && (
                <p className="text-sm text-[#AAAAAA] mt-1 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center flex-wrap gap-1.5 text-xs bg-[#2A2A2A] px-3 py-1.5 rounded-[6px] border border-[#333333]"
            >
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                const targetUrl = crumb.to || crumb.href;
                return (
                  <React.Fragment key={`${crumb.label}-${idx}`}>
                    {idx > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#AAAAAA]" />
                    )}
                    {targetUrl && !isLast ? (
                      <Link
                        to={targetUrl}
                        className="text-[#CCCCCC] hover:text-[#FFFFFF] transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        className={
                          isLast
                            ? "text-[#E63946] font-semibold"
                            : "text-[#CCCCCC]"
                        }
                      >
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {actions && <div className="flex items-center gap-2.5">{actions}</div>}
        </div>
      </div>

      {/* Bottom thin animated red line */}
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }}
        className="absolute bottom-0 left-0 h-[2px] bg-[#E63946]"
      />
    </motion.div>
  );
};

export default PageHeading;
