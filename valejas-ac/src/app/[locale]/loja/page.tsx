import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { paraPagina } from "@/lib/seo/metadados";
import type { Lingua } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { MapPin, Clock } from "lucide-react";
import {
  FORNECEDOR, KIT_ATLETA, KIT_GUARDA_REDES, PRAZO_ENCOMENDA_SEMANAS,
} from "@/lib/data/loja";
import CartaoProduto from "@/components/loja/CartaoProduto";
import CatalogoLoja from "@/components/loja/CatalogoLoja";
import BarraCarrinho from "@/components/loja/BarraCarrinho";
import RodapeLoja from "@/components/loja/RodapeLoja";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Lingua };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "loja.meta" });
  return paraPagina("/loja", { title: t("titulo"), description: t("descricao") }, locale);
}

export default function LojaPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("loja");

  // Inglês britânico («14 September 2026»), não o americano. Isto só
  // corre no servidor, por isso o crioulo pode usar os dados de `kea`.
  const localeData = locale === "en" ? "en-GB" : locale === "pt" ? "pt-PT" : locale;
  const dataCatalogo = new Intl.DateTimeFormat(localeData, {
    day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Lisbon",
  }).format(new Date(`${FORNECEDOR.atualizadoEm}T12:00:00Z`));

  return (
    <div className="bg-surface pb-28">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {t("cabecalho.etiqueta")}
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            {t.rich("cabecalho.titulo", { destaque: (c) => <span>{c}</span> })}
          </h1>

          {/* As duas regras que governam tudo o resto — ditas aqui uma vez,
              para não terem de ser repetidas em cada peça e cada tamanho. */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8 max-w-2xl">
            <p className="flex items-start gap-3 font-body text-on-surface-muted leading-relaxed">
              <MapPin size={18} className="text-yellow shrink-0 mt-1" aria-hidden />
              {t("cabecalho.levantamento")}
            </p>
            <p className="flex items-start gap-3 font-body text-on-surface-muted leading-relaxed">
              <Clock size={18} className="text-yellow shrink-0 mt-1" aria-hidden />
              {t("cabecalho.prazo", { semanas: PRAZO_ENCOMENDA_SEMANAS })}
            </p>
          </div>
        </div>
      </section>

      {/* Kit obrigatório — o que traz cá a maioria de quem entra na loja */}
      <section className="section-container py-14 md:py-20">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-14 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow mb-3">
              {t("kit.etiqueta")}
            </p>
            <h2 className="font-headline font-black uppercase text-4xl md:text-5xl tracking-tighter text-on-surface leading-none">
              {t.rich("kit.titulo", { destaque: (c) => <span className="text-yellow">{c}</span> })}
            </h2>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-5 max-w-md">
              {t("kit.texto")}
            </p>
            <p className="font-body text-on-surface-muted leading-relaxed mt-4 max-w-md">
              {t("kit.guardaRedes")}
            </p>
          </div>

          <div className="flex flex-col gap-px bg-on-surface/10">
            <CartaoProduto produto={KIT_ATLETA} destaque />
            <CartaoProduto produto={KIT_GUARDA_REDES} destaque />
          </div>
        </div>
      </section>

      {/* Catálogo com filtros */}
      <div className="border-t border-on-surface/10">
        <CatalogoLoja />
      </div>

      {/* Dúvidas */}
      <section className="section-container">
        <p className="font-body text-on-surface-muted">
          {t.rich("duvidas.texto", {
            link: (c) => <Link href="/contactos" className="text-yellow underline">{c}</Link>,
          })}
        </p>
        <p className="font-body text-sm text-on-surface-muted mt-3">
          {t("duvidas.fornecedor", { fornecedor: FORNECEDOR.nome, data: dataCatalogo })}
        </p>
      </section>

      <RodapeLoja />

      <BarraCarrinho />
    </div>
  );
}
