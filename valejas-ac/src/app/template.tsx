"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * template.tsx — Re-mounts on every navigation.
 *
 * Diferente de layout.tsx (persiste entre rotas), template.tsx
 * é desmontado e remontado em cada navegação. Isto permite-nos
 * aplicar uma animação de entrada a cada página automaticamente.
 *
 * Resultado: fade-in suave + slide vertical de 20px em cada transição.
 */
export default function PageTemplate({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Animate page entrance
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        clearProps: "transform",
      }
    );
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
