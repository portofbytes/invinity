"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

const dur = 0.42;
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: dur, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
