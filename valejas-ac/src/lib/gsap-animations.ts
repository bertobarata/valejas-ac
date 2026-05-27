/**
 * Reusable GSAP animation helpers for Valejas AC
 * Import these in any component that needs standard reveal animations.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Fade-up reveal for a group of elements, staggered */
export function revealFadeUp(
  targets: string | Element | Element[] | null,
  trigger: Element | null,
  options?: { stagger?: number; delay?: number; start?: string }
) {
  if (!targets || !trigger) return;
  return gsap.fromTo(
    targets,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.75,
      stagger: options?.stagger ?? 0.1,
      delay:   options?.delay   ?? 0,
      ease:    "power3.out",
      scrollTrigger: {
        trigger,
        start: options?.start ?? "top 80%",
      },
    }
  );
}

/** Horizontal slide reveal */
export function revealSlideLeft(
  target: string | Element | null,
  trigger: Element | null,
  options?: { start?: string }
) {
  if (!target || !trigger) return;
  return gsap.fromTo(
    target,
    { x: -80, opacity: 0 },
    {
      x: 0, opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: options?.start ?? "top 80%",
      },
    }
  );
}

/** Scroll-driven parallax (scrub) */
export function parallaxY(
  target: Element | null,
  trigger: Element | null,
  yPercent = -20
) {
  if (!target || !trigger) return;
  return gsap.to(target, {
    yPercent,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end:   "bottom top",
      scrub: true,
    },
  });
}

/** Counter animation triggered on scroll */
export function animateCounter(
  el: HTMLElement,
  endValue: number,
  trigger: Element | null,
  options?: { duration?: number; start?: string }
) {
  if (!el || !trigger) return;
  const obj = { val: 0 };
  return gsap.to(obj, {
    val:      endValue,
    duration: options?.duration ?? 1.8,
    ease:     "power2.out",
    scrollTrigger: {
      trigger,
      start: options?.start ?? "top 80%",
      once: true,
    },
    onUpdate() {
      el.textContent = Math.round(obj.val).toLocaleString("pt-PT");
    },
  });
}

/** Scale-in entrance */
export function revealScale(
  target: Element | null,
  trigger: Element | null,
  options?: { from?: number; start?: string }
) {
  if (!target || !trigger) return;
  return gsap.fromTo(
    target,
    { scale: options?.from ?? 0.92, opacity: 0 },
    {
      scale: 1, opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: options?.start ?? "top 80%",
      },
    }
  );
}
