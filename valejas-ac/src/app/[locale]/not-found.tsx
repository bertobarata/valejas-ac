import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("comum.erro404");
  return { title: t("titulo"), robots: { index: false, follow: false } };
}

/**
 * Sem este ficheiro, qualquer endereço errado caía na página por omissão
 * do Next: fundo preto, texto em inglês, sem emblema e sem saída. Num
 * site português de um clube, isso é pior do que o erro em si.
 */
export default function NaoEncontrada() {
  const t = useTranslations("comum.erro404");
  const nav = useTranslations("comum.nav");
  return (
    <main className="bg-surface min-h-[70vh] flex items-center">
      <div className="section-container py-20 md:py-28">
        <div className="max-w-xl">
          <Image
            src="/brand/crest.png"
            alt=""
            width={88}
            height={88}
            className="w-20 h-20 object-contain mb-8"
          />

          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            {t("etiqueta")}
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            {t.rich("cabecalho", { destaque: (c) => <span>{c}</span> })}
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 leading-relaxed">
            {t("texto")}
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link href="/" className="btn-primary text-sm">{nav("inicio")}</Link>
            <Link href="/comunicados" className="btn-ghost text-sm">{nav("comunicados")}</Link>
            <Link href="/jogos" className="btn-ghost text-sm">{t("jogos")}</Link>
            <Link href="/modalidades" className="btn-ghost text-sm">{nav("modalidades")}</Link>
            <Link href="/contactos" className="btn-ghost text-sm">{nav("contactos")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
