import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Carrinho from "@/components/loja/Carrinho";

export const metadata: Metadata = {
  title: "Carrinho",
  description:
    "Rever e enviar a encomenda de equipamento do Valejas Atlético Clube. Levantamento na sede.",
  robots: { index: false, follow: false },
};

export default function CarrinhoPage() {
  return (
    <div className="bg-surface pb-20">
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-12 md:py-16">
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors mb-4"
          >
            <ArrowLeft size={16} aria-hidden />
            Voltar à loja
          </Link>
          <h1 className="section-title text-4xl md:text-5xl">
            A tua <span>encomenda</span>
          </h1>
        </div>
      </section>

      <div className="section-container">
        <Carrinho />
      </div>
    </div>
  );
}
