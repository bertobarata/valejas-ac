"use client";

/**
 * SECÇÃO — QUOTA DE SÓCIO
 * ─────────────────────────────────────────────────────────────────
 * Substitui os antigos "planos" Adepto/Águia/Elite, que eram
 * inventados. A Direção fixou quota única de 1€/mês por pessoa;
 * o sócio só escolhe de quanto em quanto tempo paga.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import {
  PERIODICIDADES, QUOTA_MENSAL, METODOS_PAGAMENTO, metodosAtivos, valorPorCobranca,
  temTaxa, formatEuros,
} from "@/lib/data/quota";
import LogoMetodo from "@/components/pagamento/LogoMetodo";

gsap.registerPlugin(ScrollTrigger);

export default function QuotaSocio() {
  const ref = useRef<HTMLElement>(null);
  const haTaxa = METODOS_PAGAMENTO.some((m) => temTaxa(m.id));
  // Só os meios com marca própria — e só os que o clube tem ligados.
  const marcas = metodosAtivos().filter((m) => m.logo);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".quota-card",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-surface py-20 md:py-28">
      <div className="section-container">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow mb-3">
            Quota
          </p>
          <h2 className="font-headline font-black text-5xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface">
            {formatEuros(QUOTA_MENSAL)} por <span className="text-yellow">mês</span>
          </h2>
          <p className="font-body text-base text-on-surface-muted mt-5 leading-relaxed">
            Uma quota só, igual para toda a gente. Sem escalões, sem jóia de entrada.
            Escolhes apenas de quanto em quanto tempo queres pagar.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-on-surface/10 max-w-4xl mx-auto">
          {PERIODICIDADES.map((p) => (
            <div
              key={p.id}
              className={`quota-card flex flex-col items-center text-center p-8 ${
                p.destaque ? "bg-blue" : "bg-surface-high"
              }`}
            >
              <span
                className={`font-body text-xs font-semibold uppercase tracking-widest ${
                  p.destaque ? "text-white/85" : "text-on-surface-muted"
                }`}
              >
                {p.nome}
              </span>
              <span className="font-headline font-black text-4xl md:text-5xl leading-none text-yellow mt-3">
                {formatEuros(valorPorCobranca(p.id))}
              </span>
              <span
                className={`font-body text-xs mt-3 ${
                  p.destaque ? "text-white/85" : "text-on-surface-muted"
                }`}
              >
                {p.nota}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/socios/inscricao" className="btn-primary text-base px-10 py-5">
            Inscrever-me como Sócio <ArrowRight size={16} />
          </Link>
          <p className="font-body text-sm text-on-surface-muted mt-5 max-w-md mx-auto leading-relaxed">
            Aberto a toda a gente. Quem quer praticar futsal, atletismo ou qualquer
            outra modalidade tem de ser sócio primeiro — a inscrição desportiva
            é depois tratada na sede.
          </p>
          {haTaxa && (
            <p className="font-body text-xs text-on-surface-muted mt-3 max-w-md mx-auto leading-relaxed">
              Aos pagamentos online acresce uma taxa de processamento, mostrada
              antes de pagares.
            </p>
          )}

          {/* Marcas aceites: quem reconhece o logótipo percebe antes de ler. */}
          {marcas.length > 0 && (
            <div className="mt-8">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">
                Podes pagar com
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {marcas.map((m) => (
                  <LogoMetodo key={m.id} logo={m.logo!} altura={22} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
