import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { sessaoValida, authConfigurada, COOKIE_SESSAO } from "@/lib/auth-direcao";
import EntrarDirecao from "@/components/direcao/EntrarDirecao";
import GestorEncomendas from "@/components/direcao/GestorEncomendas";
import { PRAZO_ENCOMENDA_SEMANAS } from "@/lib/data/loja";

export const metadata: Metadata = {
  title: "Encomendas — Área da Direção",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DirecaoEncomendasPage() {
  const autenticado = sessaoValida(cookies().get(COOKIE_SESSAO)?.value);

  return (
    <div className="bg-surface min-h-screen py-16 md:py-24">
      <div className="section-container max-w-4xl">
        <Link
          href="/direcao"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-on-surface-muted hover:text-yellow transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Área da Direção
        </Link>

        <header className="mb-12">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow">
            Loja do clube
          </p>
          <h1 className="font-headline font-black text-4xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface mt-3">
            <span className="text-yellow">Encomendas</span>
          </h1>
          <p className="font-body text-base text-on-surface-muted mt-4 max-w-2xl leading-relaxed">
            Percurso de cada encomenda: entra pelo site, pede-se ao fornecedor
            o que falta, chega à sede, e alguém a vem buscar. O prazo prometido
            a quem encomenda é de {PRAZO_ENCOMENDA_SEMANAS} semanas.
          </p>
        </header>

        {!authConfigurada() ? (
          <p className="font-body text-base text-on-surface-muted leading-relaxed">
            Esta área ainda não está configurada no servidor.
          </p>
        ) : autenticado ? (
          <GestorEncomendas />
        ) : (
          <EntrarDirecao />
        )}
      </div>
    </div>
  );
}
