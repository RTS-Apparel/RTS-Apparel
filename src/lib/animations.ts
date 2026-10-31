import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" },
  }),
  hover: {
    y: -12,
    boxShadow: "0 20px 60px rgba(230,57,70,0.3)",
    transition: { duration: 0.25 },
  },
};

export const buttonHover = {
  scale: 1.05,
  boxShadow: "0 0 25px rgba(230,57,70,0.6)",
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

export const buttonTap = {
  scale: 0.95,
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

export const iconButtonHover = {
  scale: 1.2,
  rotate: 5,
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

export const iconButtonTap = {
  scale: 0.85,
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const statCardVariants: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" },
  }),
  hover: {
    y: -6,
    boxShadow: "0 14px 36px rgba(230,57,70,0.28)",
    borderColor: "#E63946",
    transition: { duration: 0.22 },
  },
};

export const tableRowVariants: Variants = {
  initial: { opacity: 0, x: -12 },
  animate: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
  }),
};

export const categoryFlipVariants: Variants = {
  initial: { opacity: 0, rotateY: 90, scale: 0.94 },
  animate: (i: number = 0) => ({
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.85, y: 10, transition: { duration: 0.2 } },
};

export const drawerVariants: Variants = {
  initial: { x: 400 },
  animate: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: 400,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

interface CountUpNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  formatter?: (val: number) => string;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  prefix = "",
  suffix = "",
  duration = 1500,
  formatter,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = 0;
    const endVal = Number(value) || 0;

    if (endVal === 0) {
      setDisplayValue(0);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = formatter
    ? formatter(displayValue)
    : displayValue.toLocaleString("en-PK");

  return React.createElement(
    "span",
    { className: `tabular-nums ${className}` },
    `${prefix}${formatted}${suffix}`
  );
};

const GLOBAL_PARTICLES = [
  { id: 1, left: "12%", top: "18%", size: 4, color: "#E63946", duration: 14, delay: 0 },
  { id: 2, left: "84%", top: "24%", size: 4, color: "#FFD700", duration: 17, delay: 2 },
  { id: 3, left: "26%", top: "62%", size: 4, color: "#E63946", duration: 19, delay: 1.5 },
  { id: 4, left: "72%", top: "70%", size: 4, color: "#FFD700", duration: 15, delay: 3 },
  { id: 5, left: "48%", top: "40%", size: 4, color: "#E63946", duration: 16, delay: 0.8 },
  { id: 6, left: "90%", top: "82%", size: 4, color: "#FFD700", duration: 18, delay: 2.4 },
  { id: 7, left: "18%", top: "80%", size: 4, color: "#E63946", duration: 15, delay: 1.2 },
  { id: 8, left: "62%", top: "15%", size: 4, color: "#FFD700", duration: 16, delay: 0.5 },
];

export const FloatingParticles: React.FC = () => {
  return React.createElement(
    "div",
    {
      "aria-hidden": "true",
      className: "pointer-events-none fixed inset-0 z-0 overflow-hidden",
    },
    GLOBAL_PARTICLES.map((p) =>
      React.createElement(motion.span, {
        key: p.id,
        className: "absolute rounded-full opacity-30",
        style: {
          left: p.left,
          top: p.top,
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          boxShadow: `0 0 10px ${p.color}`,
        },
        animate: {
          y: [0, -35, 10, 0],
          x: [0, 18, -14, 0],
          opacity: [0.2, 0.35, 0.25, 0.2],
        },
        transition: {
          duration: p.duration,
          delay: p.delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
      })
    )
  );
};
