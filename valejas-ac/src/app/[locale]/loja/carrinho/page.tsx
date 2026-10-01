import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Lingua } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import Carrinho from "@/components/loja/Carrinho";
import RodapeLoja from "@/components/loja/RodapeLoja";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Lingua };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "loja.metaCarrinho" });
  return {
    title: t("titulo"),
    description: t("descricao"),
    robots: { index: false, follow: false },
  };
}

export default function CarrinhoPage({ params: { locale } }: { params: { locale: Lingua } }) {
  setRequestLocale(locale);
  const t = useTranslations("loja.carrinho");

  return (
    <div className="bg-surface pb-20">
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-12 md:py-16">
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 min-h-11 font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors mb-2"
          >
            <ArrowLeft size={16} aria-hidden />
            {t("voltar")}
          </Link>
          <h1 className="section-title text-4xl md:text-5xl">
            {t.rich("titulo", { destaque: (c) => <span>{c}</span> })}
          </h1>
        </div>
      </section>

      <div className="section-container">
        <Carrinho />
      </div>

      <RodapeLoja />
    </div>
  );
}
