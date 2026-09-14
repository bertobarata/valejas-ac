"use client";

/**
 * MODALIDADES NA HOME
 * ─────────────────────────────────────────────────────────────────
 * Oito modalidades, uma delas muito maior que as outras. A grelha
 * antiga era de 6 colunas com o futsal a ocupar 2: sobravam três
 * células vazias na segunda linha e o bloco acabava a meio, com um
 * degrau. Agora o futsal ocupa uma faixa inteira e as restantes vivem
 * numa fila que se enrola — a última linha estica para fechar a
 * margem, seja qual for a largura do ecrã. São seis, e a base de 20rem
 * parte-as em 3+3: duas linhas iguais, sem nenhuma a sobrar meia cheia.
 *
 * Cada cartão diz o mesmo sobre si: grupo, nome, tagline e uma linha
 * de pé que responde à pergunta que se faz sempre — compete-se ou não?
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { MODALIDADES, type Grupo, type Modalidade } from "@/lib/data/modalidades";

gsap.registerPlugin(ScrollTrigger);

const GRUPO_LABEL: Record<Grupo, string> = {
  desporto: "Desporto",
  cultura:  "Cultura",
};
// Barra de acento por grupo. Tipado a Grupo de propósito: se algum dia
// nascer outro grupo, isto deixa de compilar em vez de sair sem cor.
const GRUPO_ACCENT: Record<Grupo, string> = {
  desporto: "bg-yellow",
  cultura:  "bg-blue",
};

/**
 * A linha de pé de cada cartão. Compete-se, forma-se, ou nem uma coisa
 * nem outra — dito por extenso, que é o que a página de modalidades
 * promete: «está dito em cada uma».
 */
function pePagina(m: Modalidade): string {
  if (m.apenasFormacao) {
    return m.parceria ? `Só formação · ${m.parceria.nome}` : "Só formação";
  }
  if (m.compete) return "Competição federada";
  return "Sem competição";
}

export default function ModalidadesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".modalidade-card",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = MODALIDADES.find((m) => m.slug === "futsal") ?? MODALIDADES[0];
  const rest     = MODALIDADES.filter((m) => m.slug !== featured.slug);

  return (
    <section ref={sectionRef} className="bg-surface-low py-28 md:py-40 bg-texture">
      <div className="section-container">

        {/* Header */}
        <div className="mb-10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-yellow mb-3">
            As nossas modalidades
          </p>
          <h2 className="section-title">
            Um clube, <span>muitas formas de pertencer</span>
          </h2>
        </div>

        {/* O fundo faz de risco entre cartões: cada um é opaco e o gap de
            1px deixa passar esta cor. Uma linha, sem borders a duplicar. */}
        <div className="bg-on-surface/10 flex flex-col gap-px">

          {/* Futsal — faixa inteira */}
          <Link
            href={`/modalidades#${featured.slug}`}
            className="modalidade-card group relative overflow-hidden bg-surface-highest p-6 md:p-10"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${GRUPO_ACCENT[featured.grupo]}`} />

            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-14 items-stretch">
              <div>
                <span className="font-body text-xs font-bold uppercase tracking-widest text-yellow">
                  {GRUPO_LABEL[featured.grupo]}
                </span>
                <h3 className="font-headline font-black wdth-condensed text-4xl md:text-6xl text-on-surface mt-2 leading-none uppercase group-hover:text-yellow transition-colors duration-300">
                  {featured.nome}
                </h3>
                <p className="font-body text-base text-on-surface-muted mt-4 leading-relaxed max-w-xl">
                  {featured.descricao}
                </p>
              </div>

              <div className="flex flex-col gap-6 lg:items-end lg:justify-between">
                {/* Equipas e escalões: o que distingue o futsal de tudo o resto */}
                {(featured.equipas || featured.escaloes) && (
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {featured.equipas?.map((e) => (
                      <span
                        key={e.nome}
                        className="font-body text-xs uppercase tracking-widest text-on-surface border border-on-surface/20 px-3 py-1.5"
                      >
                        {e.nome}
                      </span>
                    ))}
                    {featured.escaloes && (
                      <span className="font-body text-xs uppercase tracking-widest text-blue-deep bg-yellow px-3 py-1.5">
                        {featured.escaloes.length} escalões
                      </span>
                    )}
                  </div>
                )}

                <span className="inline-flex items-center gap-3 font-body text-xs uppercase tracking-widest text-on-surface">
                  Ver plantel e escalões
                  <span className="w-10 h-10 bg-yellow flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <ArrowUpRight size={18} className="text-blue-deep" />
                  </span>
                </span>
              </div>
            </div>
          </Link>

          {/* Restantes — fila que se enrola e fecha sempre a margem */}
          <div className="flex flex-wrap gap-px">
            {rest.map((m) => (
              <Link
                key={m.slug}
                href={`/modalidades#${m.slug}`}
                className="modalidade-card group relative overflow-hidden bg-surface-highest flex-1 basis-[min(100%,20rem)] min-h-[11.5rem] flex flex-col justify-between p-6"
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${GRUPO_ACCENT[m.grupo]}`} />

                <div>
                  <span className="font-body text-xs font-bold uppercase tracking-widest text-on-surface-muted">
                    {GRUPO_LABEL[m.grupo]}
                  </span>
                  <h3 className="font-headline font-black text-2xl text-on-surface mt-1.5 leading-none uppercase group-hover:text-yellow transition-colors duration-300">
                    {m.nome}
                  </h3>
                  <p className="font-body text-sm text-on-surface-muted mt-2 leading-relaxed">
                    {m.tagline}
                  </p>
                </div>

                <div className="flex items-end justify-between gap-3 pt-5 mt-5 border-t border-on-surface/10">
                  <span className="font-body text-xs uppercase tracking-widest text-on-surface-muted">
                    {pePagina(m)}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-on-surface-muted group-hover:text-yellow transition-colors duration-300 shrink-0"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
