export type Direction = 1 | -1

export const MOTION = {
  STEP_OFFSET: 28
}

export const stepVariants = {
  enter: (dir: Direction) => ({
    opacity: 0,
    x: dir > 0 ? MOTION.STEP_OFFSET : -MOTION.STEP_OFFSET,
    filter: "blur(2px)",
  }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (dir: Direction) => ({
    opacity: 0,
    x: dir > 0 ? -MOTION.STEP_OFFSET : MOTION.STEP_OFFSET,
    filter: "blur(2px)",
  }),
}

export const stepTransition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.8,
} as const