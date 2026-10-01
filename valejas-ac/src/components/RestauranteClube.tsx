/**
 * RESTAURANTE DO CLUBE
 * ─────────────────────────────────────────────────────────────────
 * O Ninho da Rola nos contactos: quem quer reservar mesa liga
 * diretamente para o restaurante, sem passar pela sede.
 *
 * Componente de servidor — leva também os dados estruturados de
 * restaurante, para o Google o mostrar com telefone e horário.
 * ─────────────────────────────────────────────────────────────────
 */

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Phone, MapPin } from "lucide-react";
import { RESTAURANTE, linkTelefone } from "@/lib/data/restaurante";
import DadosEstruturados from "@/components/seo/DadosEstruturados";

const DIA_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dadosRestaurante() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANTE.nome,
    telephone: RESTAURANTE.telefone,
    servesCuisine: "Portuguesa",
    acceptsReservations: true,
    hasMap: RESTAURANTE.mapa,
    openingHoursSpecification: RESTAURANTE.horario
      .filter((h) => h.abre)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DIA_SCHEMA[h.dia],
        opens: h.abre,
        // Fechar à meia-noite escreve-se 23:59 em schema.org.
        closes: h.fecha === "00:00" ? "23:59" : h.fecha,
      })),
    parentOrganization: { "@type": "SportsClub", name: "Valejas Atlético Clube" },
  };
}

export default function RestauranteClube() {
  const t = useTranslations("contactos.restaurante");

  return (
    <section id="restaurante" aria-labelledby="titulo-restaurante" className="bg-surface-low py-20 md:py-28 border-t border-on-surface/10">
      <DadosEstruturados dados={dadosRestaurante()} />

      <div className="section-container text-left grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-start">
        <div>
          <p className="font-body font-semibold text-xs uppercase tracking-[0.35em] text-yellow mb-4">
            {t("etiqueta")}
          </p>

          <div className="flex items-center gap-5">
            {/* O logótipo já traz o seu fundo preto: fica como é, com um
                filete para não se perder no modo escuro. */}
            <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 border border-on-surface/15">
              <Image
                src={RESTAURANTE.logo}
                alt=""
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <h2
              id="titulo-restaurante"
              className="font-headline font-black text-4xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface"
            >
              {RESTAURANTE.nome}
            </h2>
          </div>

          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-6 max-w-xl">
            {t("texto")}
          </p>


          <div className="flex flex-wrap gap-3 mt-10">
            <a href={linkTelefone(RESTAURANTE.telefone)} className="btn-primary text-sm">
              <Phone size={16} aria-hidden />
              {t("reservar", { telefone: RESTAURANTE.telefone })}
            </a>
            <a href={RESTAURANTE.mapa} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
              <MapPin size={16} aria-hidden />
              {t("comoChegar")}
            </a>
          </div>
        </div>

        <div className="bg-surface border border-on-surface/10 p-6 md:p-8">
          <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface mb-5">
            {t("horario")}
          </h3>
          <dl className="divide-y divide-on-surface/10">
            {RESTAURANTE.horario.map((h) => (
              <div key={h.dia} className="flex justify-between gap-4 py-2.5 font-body text-sm">
                <dt className="text-on-surface">{t(`dias.${h.dia}`)}</dt>
                <dd className={h.abre ? "text-on-surface-muted tabular-nums" : "text-red font-semibold"}>
                  {h.abre ? `${h.abre} – ${h.fecha}` : t("fechado")}
                </dd>
              </div>
            ))}
          </dl>
          <p className="font-body text-xs text-on-surface-muted mt-5 leading-relaxed">
            {t("servicos")}
          </p>
        </div>
      </div>
    </section>
  );
}
