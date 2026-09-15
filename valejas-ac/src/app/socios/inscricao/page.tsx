import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropostaSocioForm from "@/components/socios/PropostaSocioForm";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";

export const metadata: Metadata = {
  title: "Inscrição de Sócio",
  description:
    `Torna-te sócio do Valejas Atlético Clube. Quota de ${formatEuros(QUOTA_MENSAL)} por mês. ` +
    "Aberto a toda a gente, e obrigatório para quem quer praticar uma modalidade.",
};

export default function InscricaoPage() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-surface-low border-b border-on-surface/10 bg-texture">
        <div className="section-container py-14 md:py-20">
          <Link
            href="/socios-contacto"
            className="inline-flex items-center gap-2 min-h-11 font-body text-xs uppercase tracking-widest text-on-surface-muted hover:text-yellow transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Sócios
          </Link>

          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow">
            Valejas Atlético Clube
          </p>
          <h1 className="font-headline font-black text-5xl md:text-7xl uppercase leading-none tracking-tighter text-on-surface mt-3">
            Faz-te <span className="text-yellow">Sócio</span>
          </h1>
          <p className="font-body text-base md:text-lg text-on-surface-muted mt-5 max-w-xl leading-relaxed">
            A quota é de {formatEuros(QUOTA_MENSAL)} por mês, igual para toda a gente.
            Qualquer pessoa se pode inscrever — e quem quer praticar uma modalidade
            no clube tem de ser sócio primeiro. Leva cinco minutos.
          </p>
        </div>
      </header>

      {/* Formulário */}
      <div className="section-container py-14 md:py-20">
        <div className="max-w-3xl">
          <PropostaSocioForm />
        </div>
      </div>
    </div>
  );
}
