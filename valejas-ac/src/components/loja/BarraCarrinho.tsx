"use client";

/**
 * BARRA DO CARRINHO
 * ─────────────────────────────────────────────────────────────────
 * Fica colada ao fundo assim que houver alguma coisa dentro. Numa loja
 * que se percorre a rolar, o carrinho tem de estar sempre à mão — e um
 * ícone pequeno no topo passa despercebido a quem tem 60 anos.
 * ─────────────────────────────────────────────────────────────────
 */

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCarrinho } from "@/lib/loja/carrinho";
import { formatEuros } from "@/lib/data/loja";

export default function BarraCarrinho() {
  const { totalItens, total, pronto } = useCarrinho();

  if (!pronto || totalItens === 0) return null;

  return (
    <div
      className="section-dark fixed bottom-0 left-0 right-0 z-40 bg-blue text-white shadow-[0_-8px_30px_rgba(0,0,0,0.18)]"
      role="status"
      aria-live="polite"
    >
      <div className="section-container py-4 flex items-center justify-between gap-4">
        <p className="flex items-center gap-3 font-body text-sm md:text-base">
          <ShoppingBag size={20} className="text-yellow shrink-0" aria-hidden />
          <span>
            <strong className="font-headline font-black">{totalItens}</strong>{" "}
            {totalItens === 1 ? "peça" : "peças"}
            <span className="text-white/85"> · {formatEuros(total)}</span>
          </span>
        </p>

        <Link
          href="/loja/carrinho"
          className="btn-primary bg-yellow text-blue-deep hover:bg-yellow-dim text-sm shrink-0"
        >
          Ver carrinho
        </Link>
      </div>
    </div>
  );
}
