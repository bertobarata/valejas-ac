"use client";

/**
 * template.tsx — remonta a cada navegação.
 *
 * Diferente de layout.tsx (que persiste entre rotas), este é desmontado
 * e remontado a cada navegação, o que permite animar a entrada de cada
 * página.
 *
 * ⚠️ Ponto crítico: este elemento embrulha o site inteiro. Se começasse
 * em `opacity: 0` e o JavaScript falhasse ou demorasse, o site seria uma
 * página em branco. Por isso a opacidade inicial vem do CSS com uma
 * animação que a repõe sozinha — o GSAP assume se puder, e se não puder
 * o conteúdo aparece na mesma.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTemplate({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // O CSS já está a revelar o conteúdo; o GSAP toma conta a partir daqui.
    ref.current.style.animation = "none";

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
    <div ref={ref} className="entrada-pagina">
      {children}
    </div>
  );
}
