import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: "0%",
        background: "linear-gradient(90deg, #E63946, #FFD700)",
      }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none"
    />
  );
};
