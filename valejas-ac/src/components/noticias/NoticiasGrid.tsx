"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, User, ArrowRight, FileText } from "lucide-react";
import {
  CATEGORIAS, formatData,
  type Artigo, type Categoria,
} from "@/lib/data/noticias";

gsap.registerPlugin(ScrollTrigger);

// ── Categoria badge colours ──────────────────────────────────────
const CAT_COLOUR: Record<string, string> = {
  Resultados:  "bg-yellow text-black",
  Mercado:     "bg-blue text-white",
  Clube:       "bg-surface-highest text-on-surface",
  Entrevista:  "bg-surface-highest text-on-surface",
  Comunicado:  "bg-red text-white",
};

// ── Single article card ──────────────────────────────────────────
function ArtigoCard({ a }: { a: Artigo }) {
  const isComunicado = a.categoria === "Comunicado";

  return (
    <Link
      href={`/noticias/${a.slug}`}
      className="article-card group bg-surface-high hover:bg-surface-highest transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image / placeholder */}
      {!isComunicado ? (
        <div className="relative h-48 bg-surface-mid overflow-hidden flex-shrink-0">
          {a.imagemUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={a.imagemUrl}
              alt={a.titulo}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-surface-highest to-surface-mid group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <span className="font-headline font-black text-[6rem] text-on-surface italic leading-none">V</span>
              </div>
            </>
          )}
          {/* Categoria */}
          <div className="absolute top-3 left-3">
            <span className={`font-body text-[9px] font-black uppercase tracking-widest px-2.5 py-1 ${CAT_COLOUR[a.categoria] ?? "bg-surface-high text-on-surface"}`}>
              {a.categoria}
            </span>
          </div>
        </div>
      ) : (
        /* Comunicado — sem imagem, estilo diferente */
        <div className="h-12 bg-red/10 flex items-center px-5 gap-2 flex-shrink-0">
          <FileText size={14} className="text-red flex-shrink-0" />
          <span className="font-body text-[10px] font-black uppercase tracking-widest text-red">
            Comunicado Oficial
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-headline font-black italic text-lg uppercase leading-tight tracking-tighter text-on-surface group-hover:text-yellow transition-colors duration-300 line-clamp-2">
          {a.titulo}
        </h3>
        <p className="font-body text-sm text-on-surface-muted leading-relaxed line-clamp-2 flex-1">
          {a.excerto}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-on-surface/10">
          <div className="flex flex-wrap gap-3 text-on-surface-muted">
            <span className="flex items-center gap-1 font-body text-[10px]">
              <Calendar size={10} />{formatData(a.data)}
            </span>
            <span className="flex items-center gap-1 font-body text-[10px]">
              <User size={10} />{a.autor}
            </span>
          </div>
          <ArrowRight
            size={14}
            className="text-on-surface-muted group-hover:text-yellow group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
          />
        </div>
      </div>
    </Link>
  );
}

// ── Main component ───────────────────────────────────────────────
interface Props {
  artigos: Artigo[];
}

export default function NoticiasGrid({ artigos }: Props) {
  const [activeCategoria, setActiveCategoria] = useState<Categoria | "Tudo">("Tudo");
  const [visibleCount, setVisibleCount]       = useState(6);
  const gridRef    = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = activeCategoria === "Tudo"
    ? artigos
    : artigos.filter((a) => a.categoria === activeCategoria);
  const visible  = filtered.slice(0, visibleCount);
  const hasMore  = visibleCount < filtered.length;

  // Re-animate on filter change
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.querySelectorAll(".article-card"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" }
    );
  }, [activeCategoria]);

  // Scroll entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-surface py-12 md:py-16">
      <div className="section-container">

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-on-surface/10">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategoria(cat); setVisibleCount(6); }}
              className={`font-body font-semibold text-xs uppercase tracking-wider px-4 py-2 transition-all duration-200 ${
                activeCategoria === cat
                  ? "bg-yellow text-black"
                  : "bg-surface-high text-on-surface-muted hover:text-on-surface hover:bg-surface-highest"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto font-body text-xs text-on-surface-muted hidden sm:inline">
            {filtered.length} artigo{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <>
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-on-surface/10"
            >
              {visible.map((a) => (
                <ArtigoCard key={a.slug} a={a} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="btn-ghost text-sm"
                >
                  Carregar mais notícias
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center text-on-surface-muted font-body">
            Não existem artigos nesta categoria.
          </div>
        )}
      </div>
    </section>
  );
}
