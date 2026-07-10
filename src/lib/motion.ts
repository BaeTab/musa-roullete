export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

export const pageTransition = { duration: 0.24, ease: [0.2, 0, 0, 1] as [number, number, number, number] };
