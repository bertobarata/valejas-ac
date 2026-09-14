"use client";

/**
 * CONTEÚDO PRINCIPAL
 * ─────────────────────────────────────────────────────────────────
 * A barra do topo é fixa e não ocupa espaço no fluxo. Sem compensação,
 * o título de cada página nascia por trás dela.
 *
 * As duas exceções são a home e a página do emblema: abrem com o
 * emblema em ecrã inteiro e o hero passa por baixo da barra de
 * propósito — é daí que vem o efeito de o emblema aterrar na barra.
 * ─────────────────────────────────────────────────────────────────
 */

import { usePathname } from "next/navigation";
import clsx from "clsx";
import { PAGINAS_COM_HERO } from "@/lib/paginas";

export default function ConteudoPrincipal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const temHero = PAGINAS_COM_HERO.includes(pathname);

  return (
    <main id="conteudo" className={clsx(!temHero && "abaixo-da-barra")}>
      {children}
    </main>
  );
}
