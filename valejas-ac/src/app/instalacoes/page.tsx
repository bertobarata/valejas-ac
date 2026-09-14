import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Camera, MapPin } from "lucide-react";
import { INSTALACOES, type Instalacao } from "@/lib/data/instalacoes";

export const metadata: Metadata = {
  title: "As Nossas Instalações",
  description:
    "A sede do Valejas Atlético Clube e o Pavilhão Multiusos — onde o clube trabalha, treina, joga e convive.",
};

export default function InstalacoesPage() {
  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-20 md:py-28">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Barcarena, Oeiras
          </p>
          <h1 className="section-title text-5xl md:text-7xl">
            As nossas <span>instalações</span>
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            Dois espaços, dois papéis. Na sede trata-se do clube e convive-se;
            no pavilhão joga-se.
          </p>
        </div>
      </section>

      {INSTALACOES.map((inst, i) => (
        <Espaco key={inst.slug} instalacao={inst} inverter={i % 2 === 1} />
      ))}

      {/* CTA */}
      <section className="section-container pb-20 md:pb-28">
        <div className="bg-surface-high p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="max-w-xl">
            <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface">
              Passa por cá
            </h2>
            <p className="font-body text-on-surface-muted leading-relaxed mt-2">
              A porta está aberta. Para inscrições, dúvidas ou só para conhecer o
              clube por dentro.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/contactos" className="btn-primary text-sm">
              Horários e contactos
            </Link>
            <Link href="/clube" className="btn-ghost text-sm">
              Onde fica
            </Link>
          </div>
        </div>
      </section></div>
  );
}

function Espaco({ instalacao, inverter }: { instalacao: Instalacao; inverter: boolean }) {
  const temFotos = instalacao.fotos.length > 0;

  return (
    <section
      id={instalacao.slug}
      className="section-container py-16 md:py-20 border-t border-on-surface/10 scroll-mt-24"
    >
      <div
        className={`grid md:grid-cols-2 gap-10 md:gap-16 items-start ${
          inverter ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Texto */}
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-yellow">
            {instalacao.tipo}
          </p>
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface mt-2">
            {instalacao.nome}
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-4">
            {instalacao.descricao}
          </p>

          {instalacao.morada && (
            <div className="flex items-start gap-3 mt-6">
              <MapPin size={18} className="text-yellow flex-shrink-0 mt-1" />
              <address className="font-body text-sm text-on-surface-muted not-italic leading-relaxed">
                {instalacao.morada}
              </address>
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-muted border-b border-on-surface/10 pb-3 mb-4">
              O que lá acontece
            </h3>
            <ul className="space-y-2.5">
              {instalacao.usos.map((u) => (
                <li key={u} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="w-1.5 h-1.5 rounded-full bg-yellow flex-shrink-0 mt-2.5"
                  />
                  <span className="font-body text-on-surface-muted leading-relaxed">{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fotografias */}
        <div>
          {temFotos ? (
            <div className="grid grid-cols-1 gap-px bg-on-surface/10">
              {instalacao.fotos.map((f) => (
                <figure key={f.ficheiro} className="bg-surface-high">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={`/instalacoes/${f.ficheiro}`}
                      alt={f.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {f.legenda && (
                    <figcaption className="font-body text-sm text-on-surface-muted p-4">
                      {f.legenda}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-on-surface/25 aspect-[4/3] flex flex-col items-center justify-center gap-3 p-8 text-center">
              <Camera size={28} className="text-on-surface-muted" />
              <p className="font-body text-sm text-on-surface-muted max-w-xs leading-relaxed">
                Fotografias deste espaço ainda por publicar.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
