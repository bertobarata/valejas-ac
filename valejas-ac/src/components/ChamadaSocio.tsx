"use client";

/**
 * CHAMADA A SÓCIO — EM TODAS AS PÁGINAS
 * ─────────────────────────────────────────────────────────────────
 * A Direção quer o convite a ser sócio em todo o lado, e não só na
 * página inicial. Em vez de o colar página a página — que foi o que
 * estava a acontecer, em duas variantes diferentes e com metade das
 * páginas esquecidas — o bloco vive aqui e o layout mostra-o sempre.
 *
 * As exceções são as páginas onde ele estorva em vez de convidar:
 * a ficha de inscrição (já se está a inscrever), o carrinho (está a
 * fechar uma encomenda) e a área da Direção, que é trabalho interno.
 * ─────────────────────────────────────────────────────────────────
 */

import { usePathname } from "next/navigation";
import SociosCTA from "@/components/SociosCTA";

const SEM_CHAMADA = [
  "/socios/inscricao",
  "/loja/carrinho",
  // A página dos sócios já abre com este mesmo convite em grande —
  // repeti-lo lá em baixo era dizer a mesma coisa duas vezes.
  "/socios-contacto",
];

const PREFIXOS_SEM_CHAMADA = ["/direcao", "/studio"];

export default function ChamadaSocio() {
  const pathname = usePathname();

  if (SEM_CHAMADA.includes(pathname)) return null;
  if (PREFIXOS_SEM_CHAMADA.some((p) => pathname.startsWith(p))) return null;

  return <SociosCTA />;
}
