import {
  AnimationConfig,
  AnimationType,
  EaseType,
  StaggerConfig,
} from "../ai-agents/types";

const defaultDuration = 0.3;
const defaultEase: EaseType = "ease-out";

export const createAnimation = (
  config: Partial<AnimationConfig>,
): AnimationConfig => ({
  type: "fade",
  duration: defaultDuration,
  ease: defaultEase,
  ...config,
});

export const fadeAnimation = (duration = defaultDuration): AnimationConfig => ({
  type: "fade",
  duration,
  ease: defaultEase,
});

export const slideAnimation = (
  direction: "up" | "down" | "left" | "right",
  duration = defaultDuration,
): AnimationConfig => ({
  type: "slide",
  direction,
  duration,
  ease: defaultEase,
});

export const scaleAnimation = (
  duration = defaultDuration,
): AnimationConfig => ({
  type: "scale",
  duration,
  ease: defaultEase,
});

export const springAnimation = (
  config: Partial<AnimationConfig["springConfig"]> = {},
): AnimationConfig => ({
  type: "spring",
  duration: defaultDuration,
  springConfig: {
    stiffness: 100,
    damping: 10,
    mass: 1,
    ...config,
  },
});

export const createStaggerAnimation = (
  animation: AnimationConfig,
  staggerConfig: Partial<StaggerConfig>,
): StaggerConfig => ({
  ...animation,
  staggerChildren: 0.05,
  delayChildren: 0,
  ...staggerConfig,
});

// Preset animations
export const presets = {
  fadeIn: fadeAnimation(),
  fadeOut: { ...fadeAnimation(), delay: 0.2 },
  slideUp: slideAnimation("up"),
  slideDown: slideAnimation("down"),
  slideLeft: slideAnimation("left"),
  slideRight: slideAnimation("right"),
  popIn: scaleAnimation(),
  bounceIn: springAnimation({ stiffness: 200, damping: 15 }),
  listStagger: createStaggerAnimation(fadeAnimation(), {
    staggerChildren: 0.1,
  }),
};

// Animation variants for Framer Motion
export const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  listItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
};
