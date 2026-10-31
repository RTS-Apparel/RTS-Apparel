import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const CustomCursor: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });

  const ringX = useSpring(-100, { stiffness: 250, damping: 24, mass: 0.5 });
  const ringY = useSpring(-100, { stiffness: 250, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'a, button, [role="button"], input, select, textarea, label'
          )
        );
        setHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ringX, ringY, visible]);

  if (!visible) return null;

  const ringSize = clicked ? 22 : hovered ? 50 : 30;

  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
    >
      {/* Small Red Dot (8px) */}
      <div
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`,
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#E63946] shadow-[0_0_8px_#E63946]"
      />

      {/* Lagging Red Ring (30px -> 50px on hover, shrinks + ripple on click) */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          backgroundColor: hovered
            ? "rgba(230, 57, 70, 0.2)"
            : clicked
            ? "rgba(230, 57, 70, 0.35)"
            : "transparent",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="fixed top-0 left-0 rounded-full border border-[#E63946]"
      />
    </div>
  );
};
