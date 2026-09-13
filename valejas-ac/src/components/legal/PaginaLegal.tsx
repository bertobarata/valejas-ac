/**
 * MOLDURA DAS PÁGINAS LEGAIS
 * ─────────────────────────────────────────────────────────────────
 * As três páginas legais partilham cabeçalho, largura de leitura e
 * data de atualização. Texto legal lê-se mal em coluna larga, por
 * isso a medida é curta de propósito.
 * ─────────────────────────────────────────────────────────────────
 */

import Link from "next/link";

export const ATUALIZADO_EM = "13 de setembro de 2026";

const PAGINAS = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos",      label: "Termos e Condições" },
  { href: "/cookies",     label: "Cookies" },
];

export default function PaginaLegal({
  titulo, resumo, atual, children,
}: {
  titulo:  string;
  resumo:  string;
  atual:   string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface">
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Valejas Atlético Clube
          </p>
          <h1 className="section-title text-4xl md:text-6xl">{titulo}</h1>
          <p className="font-body text-lg text-on-surface-muted mt-4 max-w-2xl leading-relaxed">
            {resumo}
          </p>
          <p className="font-body text-sm text-on-surface-muted mt-6">
            Última atualização: {ATUALIZADO_EM}
          </p>
        </div>
      </section>

      {/* Navegação entre as três */}
      <nav aria-label="Páginas legais" className="section-container pt-10">
        <ul className="flex flex-wrap gap-2">
          {PAGINAS.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={p.href === atual ? "page" : undefined}
                className={`inline-block font-body text-sm px-4 py-2 border transition-colors duration-200 ${
                  p.href === atual
                    ? "border-yellow bg-yellow/10 text-on-surface"
                    : "border-on-surface/20 text-on-surface-muted hover:border-on-surface/50 hover:text-on-surface"
                }`}
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article className="section-container py-12 md:py-16 max-w-3xl texto-legal">
        {children}
      </article>
    </div>
  );
}
