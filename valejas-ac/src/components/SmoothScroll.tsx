"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registarScrollSuave } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  /**
   * Cada página abre no princípio.
   *
   * O browser guarda a posição de scroll e repõe-na na navegação
   * seguinte; o Next também tenta pôr no topo, mas fá-lo antes de a
   * página nova ter altura. Resultado: chegava-se a meio da página,
   * sem se ter rolado nada.
   *
   * `scrollRestoration = "manual"` tira o browser da jogada, e a
   * reposição é feita aqui — no Lenis, que é quem manda no scroll, e
   * também no window, para o caso de o Lenis não estar de pé (movimento
   * reduzido). Fica de fora quando o endereço traz âncora: aí quem
   * manda é o destino da âncora.
   */
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) return;

    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    // Depois de a página nova ter altura, as posições dos ScrollTrigger
    // mudaram todas — sem isto, as animações disparam nos sítios errados.
    const id = requestAnimationFrame(() => {
      lenisRef.current?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

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
    registarScrollSuave(lenis);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const aoTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(aoTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(aoTick);
      registarScrollSuave(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
