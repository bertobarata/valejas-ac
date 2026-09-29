/**
 * TIPOGRAFIA DO CLUBE
 * ─────────────────────────────────────────────────────────────────
 * Títulos: Archivo. Grotesk variável com três coisas que o desenho
 * precisa e a Trench Slab não tinha — peso até 900, itálico verdadeiro
 * e um eixo de largura (62 a 125). É a largura que resolve o problema
 * do hero: aperta-se o título onde o espaço é curto, sem trocar de
 * fonte entre o hero, os cartões e os cabeçalhos internos.
 *
 * Texto: General Sans. Variável, com itálico, legível em corpo pequeno.
 *
 * Ambas servidas do próprio site. A Archivo vem pelo next/font/google,
 * que a descarrega no build e a serve daqui — não há pedido ao Google
 * em tempo de execução.
 * ─────────────────────────────────────────────────────────────────
 */

import { Archivo } from "next/font/google";
import localFont from "next/font/local";

/*
 * Só o subconjunto latino e só o estilo normal. O latino já cobre o
 * português inteiro (acentos, ç, travessões). O `latin-ext` e o itálico
 * eram três ficheiros de ~90 KB descarregados em cada visita — o
 * next/font pré-carrega todos os subconjuntos pedidos — e nenhum era
 * usado: os títulos nunca levam itálico (DESIGN.md).
 */
export const archivo = Archivo({
  subsets: ["latin"],
  // Além do peso, expor o eixo de largura para os títulos grandes.
  axes: ["wdth"],
  style: ["normal"],
  variable: "--font-headline",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const generalSans = localFont({
  src: [
    {
      path: "../../public/fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans-VariableItalic.woff2",
      weight: "200 700",
      style: "italic",
    },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
