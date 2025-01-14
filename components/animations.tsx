"use client";
import { motion } from "framer-motion";

interface FadeInWithSlideAnimationPros {
  children: React.ReactNode;
}
export function FadeInWithSlideAnimation({
  children,
}: FadeInWithSlideAnimationPros) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      transition={{ duration: 0.4 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      {children}
    </motion.div>
  );
}
