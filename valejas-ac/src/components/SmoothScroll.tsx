"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    /**
     * Movimento reduzido: o CSS já anula animações e transições, mas o
     * GSAP corre em JavaScript e escapa-lhe. Acelerar a linha temporal
     * global faz cada tween chegar ao estado final de imediato — o
     * conteúdo aparece, sem percurso. E o scroll suave do Lenis nem
     * chega a arrancar.
     */
    const reduzido =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduzido) {
      gsap.globalTimeline.timeScale(400);
      return;
    }

    // Initialise Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const aoTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(aoTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(aoTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
