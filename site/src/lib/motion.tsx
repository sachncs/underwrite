import { motion, useReducedMotion, type Variants } from "framer-motion";

const baseEase = [0.22, 1, 0.36, 1] as const;

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  y = 16,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "header" | "span" | "li";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration, delay, ease: baseEase }}
    >
      {children}
    </MotionTag>
  );
}

export const staggerParent: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: baseEase } },
};