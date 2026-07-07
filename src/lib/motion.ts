export const pageVariants = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
};

export const pageTransition = { duration: 0.32, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
