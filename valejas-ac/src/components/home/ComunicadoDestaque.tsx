import Link from "next/link";
import { getComunicados, type Comunicado } from "@/lib/data/comunicados";
import { fetchComunicados } from "@/sanity/queries";

/**
 * Banda "A Direção comunica" — mostra o comunicado oficial mais recente
 * logo abaixo do hero. Materializa o princípio nº1: a Direção fala aqui primeiro.
 */
export default async function ComunicadoDestaque() {
  const sanity = (await fetchComunicados()) as Comunicado[] | null;
  const ultimo = (sanity ?? getComunicados())[0];
  if (!ultimo) return null;

  const data = new Date(ultimo.data).toLocaleDateString("pt-PT", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <section className="bg-surface-high border-y border-on-surface/10">
      <div className="section-container py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="md:w-48 shrink-0">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow">
              A Direção comunica
            </p>
            <time className="font-body text-sm text-on-surface-muted">{data}</time>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-display text-2xl md:text-3xl text-on-surface leading-tight">
              {ultimo.titulo}
            </h2>
            {ultimo.corpo?.[0] && (
              <p className="font-body text-on-surface-muted mt-2 line-clamp-2">
                {ultimo.corpo[0]}
              </p>
            )}
          </div>

          <Link
            href="/comunicados"
            className="btn-ghost shrink-0 self-start md:self-center whitespace-nowrap"
          >
            Ver comunicados
          </Link>
        </div>
      </div>
    </section>
  );
}
