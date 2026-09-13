"use client";

/**
 * LISTA DE MODALIDADES EM DROPDOWN
 * ─────────────────────────────────────────────────────────────────
 * Cada modalidade é uma linha fechada: nome, o que é, e etiquetas a
 * dizer se compete. Abre para mostrar equipas, escalões e parcerias.
 *
 * Assim a página cabe num ecrã de telemóvel em vez de ser um rolo,
 * e o futsal — que tem muito mais conteúdo do que os outros — não
 * esmaga o resto da lista.
 *
 * Os links do rodapé apontam para /modalidades#slug, por isso a
 * modalidade indicada no endereço abre sozinha.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronDown, Trophy, Users } from "lucide-react";
import type { Modalidade } from "@/lib/data/modalidades";

export default function ModalidadesAccordion({ itens }: { itens: Modalidade[] }) {
  const [aberta, setAberta] = useState<string | null>(null);

  // Abrir a modalidade que vem no endereço (#futsal, #judo, …).
  useEffect(() => {
    const abrirDoHash = () => {
      const slug = window.location.hash.replace("#", "");
      if (slug && itens.some((m) => m.slug === slug)) {
        setAberta(slug);
        // Esperar pela expansão antes de rolar até lá.
        requestAnimationFrame(() => {
          document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    abrirDoHash();
    window.addEventListener("hashchange", abrirDoHash);
    return () => window.removeEventListener("hashchange", abrirDoHash);
  }, [itens]);

  return (
    <div className="flex flex-col divide-y divide-on-surface/10 border-y border-on-surface/10">
      {itens.map((m) => {
        const estaAberta = aberta === m.slug;
        const painelId = `painel-${m.slug}`;

        return (
          <div key={m.slug} id={m.slug} className="scroll-mt-24">
            <h3>
              <button
                type="button"
                onClick={() => setAberta(estaAberta ? null : m.slug)}
                aria-expanded={estaAberta}
                aria-controls={painelId}
                className="w-full text-left py-6 flex items-start gap-5 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-display text-2xl md:text-3xl text-on-surface group-hover:text-yellow transition-colors duration-200">
                      {m.nome}
                    </span>

                    {m.compete && (
                      <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-blue-deep bg-yellow px-2.5 py-1">
                        <Trophy size={12} /> Compete
                      </span>
                    )}
                    {m.apenasFormacao && (
                      <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-on-surface border border-on-surface/25 px-2.5 py-1">
                        <Users size={12} /> Só formação
                      </span>
                    )}
                    {m.parceria && (
                      <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted border border-on-surface/25 px-2.5 py-1">
                        Parceria
                      </span>
                    )}
                  </div>

                  <p className="font-display text-base text-blue mt-1">{m.tagline}</p>
                </div>

                <ChevronDown
                  size={22}
                  aria-hidden
                  className={clsx(
                    "text-on-surface-muted shrink-0 mt-2 transition-transform duration-300",
                    estaAberta && "rotate-180 text-yellow"
                  )}
                />
              </button>
            </h3>

            {/* Painel */}
            <div
              id={painelId}
              aria-hidden={!estaAberta}
              className={clsx(
                "pb-8 gap-8 md:gap-14 md:grid-cols-[minmax(0,1fr)_auto]",
                estaAberta ? "grid" : "hidden"
              )}
            >
              <div className="max-w-prose">
              <p className="font-body text-on-surface-muted leading-relaxed">
                {m.descricao}
              </p>

              {m.equipas && (
                <div className="mt-6">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">
                    Equipas
                  </p>
                  <ul className="space-y-2">
                    {m.equipas.map((e) => (
                      <li key={e.nome} className="font-body text-sm text-on-surface-muted">
                        <span className="font-headline font-black uppercase text-on-surface">
                          {e.nome}
                        </span>{" "}
                        — {e.descricao}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {m.parceria && (
                <div className="mt-6 pt-5 border-t border-on-surface/15">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1">
                    Em parceria com
                  </p>
                  <p className="font-headline font-black uppercase text-base text-on-surface">
                    {m.parceria.nome}
                  </p>
                  <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-1">
                    {m.parceria.descricao}
                  </p>
                  {m.parceria.valores && (
                    <p className="font-body text-sm text-on-surface-muted mt-2">
                      {m.parceria.valores.join(" · ")}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-7">
                <p className="font-body text-xs uppercase tracking-widest text-on-surface-muted">
                  {m.publico}
                </p>
                {m.ancora && (
                  <Link href="/equipas" className="btn-ghost text-sm">
                    Ver plantel
                  </Link>
                )}
              </div>
              </div>

              {/* Percurso de formação — coluna própria, de cima para baixo,
                  para se ler como uma escada e não como uma frase. */}
              {m.escaloes && (
                <aside className="md:w-60 md:border-l md:border-on-surface/10 md:pl-8">
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-4">
                    Percurso de formação
                  </p>
                  <ol className="relative">
                    {m.escaloes.map((e, i) => {
                      const ultimo = i === m.escaloes!.length - 1;
                      return (
                        <li key={e} className="relative flex items-center gap-4 pb-4 last:pb-0">
                          {/* Linha que liga os degraus */}
                          {!ultimo && (
                            <span
                              aria-hidden
                              className="absolute left-[5px] top-4 bottom-0 w-px bg-on-surface/20"
                            />
                          )}
                          <span
                            aria-hidden
                            className={clsx(
                              "relative z-10 w-[11px] h-[11px] rounded-full shrink-0",
                              ultimo ? "bg-yellow" : "bg-on-surface/30"
                            )}
                          />
                          <span
                            className={clsx(
                              "font-body text-sm",
                              ultimo ? "text-on-surface font-semibold" : "text-on-surface-muted"
                            )}
                          >
                            {e}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </aside>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
