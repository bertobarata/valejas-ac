import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: {
    default: "Valejas Atlético Clube | O clube da nossa terra desde 1966",
    template: "%s | Valejas AC",
  },
  description:
    "Clube desportivo de Valejas, Oeiras. Futebol e futsal federados, forte na formação, mais aulas de comunidade. A casa do clube desde 1966.",
  keywords: ["Valejas", "futebol", "futsal", "clube desportivo", "Oeiras", "AF Lisboa"],
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
    <html lang="pt" suppressHydrationWarning>
      <body>
        <Providers>
          <SmoothScroll>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
