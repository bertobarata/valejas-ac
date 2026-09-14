import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import {
  CATEGORIAS, FORNECEDOR, PRAZO_ENCOMENDA_SEMANAS, getProduto, produtosPorCategoria,
} from "@/lib/data/loja";
import CartaoProduto from "@/components/loja/CartaoProduto";
import BarraCarrinho from "@/components/loja/BarraCarrinho";
import RodapeLoja from "@/components/loja/RodapeLoja";

export const metadata: Metadata = {
  title: "Loja",
  description:
    "Equipamento oficial do Valejas Atlético Clube. Kit de formação, material de jogo e de treino. Levantamento sempre na sede.",
};

export default function LojaPage() {
  // O equipamento principal abre a loja: é o que mais gente vem procurar.
  const destaque = getProduto("equipamento-principal");

  return (
    <div className="bg-surface pb-28">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Equipamento oficial
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            Loja do <span>clube</span>
          </h1>

          {/* As duas regras que governam tudo o resto */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8 max-w-2xl">
            <p className="flex items-start gap-3 font-body text-on-surface-muted leading-relaxed">
              <MapPin size={18} className="text-yellow shrink-0 mt-1" aria-hidden />
              Levantamento sempre na sede do clube. Não enviamos para casa.
            </p>
            <p className="flex items-start gap-3 font-body text-on-surface-muted leading-relaxed">
              <Clock size={18} className="text-yellow shrink-0 mt-1" aria-hidden />
              O que não está na sede encomenda-se, até {PRAZO_ENCOMENDA_SEMANAS} semanas.
            </p>
          </div>
        </div>
      </section>

      {/* Equipamento principal em destaque */}
      {destaque && (
        <section className="section-container py-14 md:py-20">
          <div className="max-w-2xl mb-8">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow mb-2">
              As cores do clube
            </p>
            <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
              {destaque.nome}
            </h2>
          </div>
          <CartaoProduto produto={destaque} destaque />
        </section>
      )}

      {/* Categorias */}
      {CATEGORIAS.map((cat) => {
        const itens = produtosPorCategoria(cat.id);
        if (itens.length === 0) return null;

        return (
          <section
            key={cat.id}
            id={cat.id}
            className="section-container py-12 md:py-16 border-t border-on-surface/10 scroll-mt-24"
          >
            <div className="max-w-2xl mb-8">
              <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface">
                {cat.nome}
              </h2>
              <p className="font-body text-on-surface-muted mt-2">{cat.intro}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-on-surface/10">
              {itens.map((p) => (
                <CartaoProduto key={p.slug} produto={p} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Dúvidas */}
      <section className="section-container pt-4">
        <p className="font-body text-on-surface-muted">
          Dúvidas de tamanhos? Passa pela sede e experimenta antes de encomendar,
          ou <Link href="/contactos" className="text-yellow underline">fala connosco</Link>.
        </p>
        <p className="font-body text-sm text-on-surface-muted mt-3">
          Equipamento produzido pela {FORNECEDOR.nome}. Catálogo e preços
          atualizados a {FORNECEDOR.atualizado}.
        </p>
      </section>

      <RodapeLoja />

      <BarraCarrinho />
    </div>
  );
}
