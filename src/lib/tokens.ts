export const motion = {
  level0: {
    duration: 0,
    ease: [0, 0, 1, 1] as const,
  },
  level1: {
    duration: 0.2,
    durationSlow: 0.3,
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
  level2: {
    duration: 0.6,
    durationSlow: 0.9,
    ease: [0.16, 1, 0.3, 1] as const,
  },
  level3: {
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1] as const,
  },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  springGentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: motion.level1.duration,
      ease: motion.level1.ease,
    },
  },
} as const;

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motion.level2.duration,
      ease: motion.level2.ease,
    },
  },
} as const;

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

export const slideInRight = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      duration: motion.level1.durationSlow,
      ease: motion.level1.ease,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: motion.level1.duration,
      ease: motion.level1.ease,
    },
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
} as const;

export const grid = {
  desktop: { columns: 12, margin: 80, gutter: 24 },
  tablet: { columns: 8, margin: 64, gutter: 20 },
  mobile: { columns: 4, margin: 24, gutter: 16 },
  maxWidth: 1440,
} as const;

export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  header: 30,
  overlay: 40,
  drawer: 50,
  modal: 60,
  toast: 70,
} as const;
