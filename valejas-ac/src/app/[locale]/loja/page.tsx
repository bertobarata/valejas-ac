import type { Metadata } from "next";
import { paraPagina } from "@/lib/seo/metadados";
import { Link } from "@/i18n/navigation";
import { MapPin, Clock } from "lucide-react";
import {
  FORNECEDOR, KIT_ATLETA, KIT_GUARDA_REDES, PRAZO_ENCOMENDA_SEMANAS,
} from "@/lib/data/loja";
import CartaoProduto from "@/components/loja/CartaoProduto";
import CatalogoLoja from "@/components/loja/CatalogoLoja";
import BarraCarrinho from "@/components/loja/BarraCarrinho";
import RodapeLoja from "@/components/loja/RodapeLoja";

export const metadata: Metadata = paraPagina("/loja", {
  title: "Loja",
  description:
    "Equipamento oficial do Valejas Atlético Clube. Kit obrigatório de atleta, material de jogo, treino e acessórios. Levantamento sempre na sede.",
});

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
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-14 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow mb-3">
              Obrigatório para quem joga
            </p>
            <h2 className="font-headline font-black uppercase text-4xl md:text-5xl tracking-tighter text-on-surface leading-none">
              Kit de <span className="text-yellow">atleta</span>
            </h2>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-5 max-w-md">
              Quem se inscreve para jogar leva quatro peças: o equipamento
              principal, o alternativo para quando as cores chocam com as do
              adversário, um conjunto para treinar durante a semana e o fato
              de treino.
            </p>
            <p className="font-body text-on-surface-muted leading-relaxed mt-4 max-w-md">
              O guarda-redes tem o seu kit, em verde. Os equipamentos de jogo
              já levam as meias. Escolhe o
              tamanho uma vez e leva tudo de uma assentada; cada peça também
              se compra à parte aqui em baixo.
            </p>
          </div>

          <div className="flex flex-col gap-px bg-on-surface/10">
            <CartaoProduto produto={KIT_ATLETA} destaque />
            <CartaoProduto produto={KIT_GUARDA_REDES} destaque />
          </div>
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
