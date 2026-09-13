import type { Metadata } from "next";
import "./globals.css";
import { archivo, generalSans } from "./fonts";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import EcraCarregamento from "@/components/EcraCarregamento";

export const metadata: Metadata = {
  title: {
    default: "Valejas Atlético Clube | O clube da nossa terra desde 1966",
    template: "%s | Valejas AC",
  },
  description:
    "Clube desportivo de Valejas, Oeiras. Futsal e atletismo federados, forte na formação, mais judo, karate, dança, teatro e Academia Sénior. A casa do clube desde 1966.",
  keywords: ["Valejas", "futsal", "atletismo", "clube desportivo", "Oeiras", "AF Lisboa", "academia sénior"],
  openGraph: {
    siteName: "Valejas Atlético Clube",
    locale: "pt_PT",
    type: "website",
  },
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
            <main id="conteudo">{children}</main>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
