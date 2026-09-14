"use client";

/**
 * ECRÃ DE CARREGAMENTO
 * ─────────────────────────────────────────────────────────────────
 * O emblema sobre o azul do clube, com um brilho amarelo à volta.
 * Aparece no primeiro carregamento de cada sessão — não em cada
 * navegação, que seria irritante.
 *
 * Três cuidados:
 *  - Sai assim que a página está pronta, com um mínimo de meio segundo
 *    para não piscar. Um splash que demora mais do que o site é pior
 *    do que não ter splash.
 *  - Há um limite de tempo: mesmo que algo fique pendurado, sai ao fim
 *    de 2,5 segundos. Ninguém fica preso a olhar para um logótipo.
 *  - Se o JavaScript falhar, o CSS tira-o na mesma (ver globals.css).
 *    Sem isso, uma falha de script deixava o site inacessível.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";

const CHAVE_SESSAO = "vac_splash_visto";
const MINIMO_MS    = 500;
const LIMITE_MS    = 2500;

export default function EcraCarregamento() {
  const [aSair, setASair]   = useState(false);
  const [fora, setFora]     = useState(false);

  useEffect(() => {
    // Já foi visto nesta sessão? Sai já, sem animação.
    if (sessionStorage.getItem(CHAVE_SESSAO)) {
      setFora(true);
      return;
    }

    const inicio = Date.now();
    let terminado = false;

    const sair = () => {
      if (terminado) return;
      terminado = true;
      sessionStorage.setItem(CHAVE_SESSAO, "1");

      const decorrido = Date.now() - inicio;
      const espera = Math.max(0, MINIMO_MS - decorrido);

      window.setTimeout(() => {
        setASair(true);
        // Esperar pela transição antes de tirar do DOM.
        window.setTimeout(() => setFora(true), 450);
      }, espera);
    };

    // Pronto = página carregada e tipografia disponível. Sem esta
    // segunda parte, o site aparecia e trocava de fonte à frente de
    // quem estava a olhar.
    const quandoPronto = async () => {
      try {
        await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
      } catch {
        /* se o browser não souber responder, seguimos na mesma */
      }
      sair();
    };

    if (document.readyState === "complete") {
      quandoPronto();
    } else {
      window.addEventListener("load", quandoPronto, { once: true });
    }

    const limite = window.setTimeout(sair, LIMITE_MS);

    return () => {
      window.removeEventListener("load", quandoPronto);
      window.clearTimeout(limite);
    };
  }, []);

  if (fora) return null;

  return (
    <div
      data-splash
      role="status"
      aria-live="polite"
      className={`splash-fundo fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-[450ms] ${
        aSair ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/crest.png"
        alt=""
        width={280}
        height={280}
        className="splash-emblema w-36 h-36 md:w-52 md:h-52 object-contain"
      />

      <span className="sr-only">A carregar o site do Valejas Atlético Clube</span>
    </div>
  );
}
