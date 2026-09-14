import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import {
  FORNECEDOR, KIT_ATLETA, PRAZO_ENCOMENDA_SEMANAS,
} from "@/lib/data/loja";
import CartaoProduto from "@/components/loja/CartaoProduto";
import CatalogoLoja from "@/components/loja/CatalogoLoja";
import BarraCarrinho from "@/components/loja/BarraCarrinho";
import RodapeLoja from "@/components/loja/RodapeLoja";

export const metadata: Metadata = {
  title: "Loja",
  description:
    "Equipamento oficial do Valejas Atlético Clube. Kit obrigatório de atleta, material de jogo, treino e acessórios. Levantamento sempre na sede.",
};

export default function LojaPage() {
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

          {/* As duas regras que governam tudo o resto — ditas aqui uma vez,
              para não terem de ser repetidas em cada peça e cada tamanho. */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8 max-w-2xl">
            <p className="flex items-start gap-3 font-body text-on-surface-muted leading-relaxed">
              <MapPin size={18} className="text-yellow shrink-0 mt-1" aria-hidden />
              Levantamento sempre na sede do clube. Não enviamos para casa.
            </p>
            <p className="flex items-start gap-3 font-body text-on-surface-muted leading-relaxed">
              <Clock size={18} className="text-yellow shrink-0 mt-1" aria-hidden />
              O que não houver em stock é encomendado, num prazo máximo de{" "}
              {PRAZO_ENCOMENDA_SEMANAS} semanas.
            </p>
          </div>
        </div>
      </section>

      {/* Kit obrigatório — o que traz cá a maioria de quem entra na loja */}
      <section className="section-container py-14 md:py-20">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-14 items-center">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow mb-3">
              Obrigatório para quem joga
            </p>
            <h2 className="font-headline font-black uppercase text-4xl md:text-5xl tracking-tighter text-on-surface leading-none">
              Kit de <span className="text-yellow">atleta</span>
            </h2>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-5 max-w-md">
              Quem se inscreve para jogar leva isto: as cores do clube para os
              jogos em casa, o equipamento alternativo para quando as cores
              chocam com as do adversário, e um conjunto para treinar durante
              a semana.
            </p>
            <p className="font-body text-on-surface-muted leading-relaxed mt-4 max-w-md">
              Escolhe o tamanho uma vez e leva as três peças de uma assentada.
              Depois, cada uma pode ser comprada à parte aqui em baixo.
            </p>
          </div>

          <CartaoProduto produto={KIT_ATLETA} destaque />
        </div>
      </section>

      {/* Catálogo com filtros */}
      <div className="border-t border-on-surface/10">
        <CatalogoLoja />
      </div>

      {/* Dúvidas */}
      <section className="section-container">
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
