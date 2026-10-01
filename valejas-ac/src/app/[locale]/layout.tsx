import type { Metadata } from "next";
import "../globals.css";
import { archivo, generalSans } from "../fonts";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_OG, type Lingua } from "@/i18n/routing";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import EcraCarregamento from "@/components/EcraCarregamento";
import ConteudoPrincipal from "@/components/ConteudoPrincipal";
import ChamadaSocio from "@/components/ChamadaSocio";
import DadosEstruturados from "@/components/seo/DadosEstruturados";
import { organizacao } from "@/lib/seo/dadosEstruturados";

/** Cada língua é gerada à partida, como o português sempre foi. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: Lingua } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "comum.meta" });
  return {
    ...metadata,
    title: { default: t("titulo"), template: "%s | Valejas AC" },
    description: t("descricao"),
    openGraph: {
      ...metadata.openGraph,
      locale: LOCALE_OG[params.locale],
      title: t("titulo"),
      description: t("descricaoPartilha"),
    },
  };
}

const metadata: Metadata = {
  title: {
    default: "Valejas Atlético Clube | O clube da nossa terra desde 1966",
    template: "%s | Valejas AC",
  },
  description:
    "Clube desportivo de Valejas, Oeiras. Futsal e atletismo federados, forte na formação, mais judo, karate, dança, teatro e Academia Sénior. A casa do clube desde 1966.",
  keywords: ["Valejas", "futsal", "atletismo", "clube desportivo", "Oeiras", "AF Lisboa", "academia sénior"],
  /*
   * Endereço de base para tudo o que precisa de ser absoluto: imagens
   * de partilha, hreflang, canónicos. Em desenvolvimento fica o
   * localhost; em produção vem da variável, que é o domínio do clube.
   */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    siteName: "Valejas Atlético Clube",
    locale: "pt_PT",
    type: "website",
    url: "/",
    title: "Valejas Atlético Clube | O clube da nossa terra desde 1966",
    description:
      "Futsal, atletismo, karate, cicloturismo, judo, dança e teatro. Mais a Academia Sénior. A casa do clube desde 1966.",
    images: [{ url: "/imagem-partilha", width: 1200, height: 630, alt: "Valejas Atlético Clube" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/imagem-partilha"],
  },
  // O canónico vive em cada página (`paraPagina`). Aqui herdava-o toda a
  // gente, e o Google lia todas as páginas como cópias da inicial.

  /*
   * Search Console. O Google dá um código para provar que o site é
   * nosso; põe-se em `GOOGLE_SITE_VERIFICATION` na Vercel e aparece
   * como meta tag. Sem a variável, não se escreve tag nenhuma — uma
   * verificação vazia é pior do que nenhuma.
   *
   * Só serve depois do domínio apontado: o Google verifica
   * valejasac.pt, não o endereço de pré-visualização.
   */
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Lingua };
}) {
  if (!routing.locales.includes(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations("comum");

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${archivo.variable} ${generalSans.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
        <DadosEstruturados dados={organizacao()} />
        <EcraCarregamento />

        {/* Link de salto: com cabeçalho fixo e oito itens de navegação,
            quem usa teclado percorria a barra inteira em cada página.
            Fica escondido até receber foco. */}
        <a href="#conteudo" className="link-salto">
          {t("saltarParaConteudo")}
        </a>
        <Providers>
          <SmoothScroll>
            <Navbar />
            <ConteudoPrincipal>{children}</ConteudoPrincipal>
            <ChamadaSocio />
            <Footer />
          </SmoothScroll>
        </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
