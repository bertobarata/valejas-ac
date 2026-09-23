import type { Metadata } from "next";
import "./globals.css";
import { archivo, generalSans } from "./fonts";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import EcraCarregamento from "@/components/EcraCarregamento";
import ConteudoPrincipal from "@/components/ConteudoPrincipal";
import ChamadaSocio from "@/components/ChamadaSocio";
import DadosEstruturados from "@/components/seo/DadosEstruturados";
import { organizacao } from "@/lib/seo/dadosEstruturados";

export const metadata: Metadata = {
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
  alternates: { canonical: "/" },

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt"
      suppressHydrationWarning
      className={`${archivo.variable} ${generalSans.variable}`}
    >
      <body>
        <DadosEstruturados dados={organizacao()} />
        <EcraCarregamento />

        {/* Link de salto: com cabeçalho fixo e oito itens de navegação,
            quem usa teclado percorria a barra inteira em cada página.
            Fica escondido até receber foco. */}
        <a href="#conteudo" className="link-salto">
          Saltar para o conteúdo
        </a>
        <Providers>
          <SmoothScroll>
            <Navbar />
            <ConteudoPrincipal>{children}</ConteudoPrincipal>
            <ChamadaSocio />
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
