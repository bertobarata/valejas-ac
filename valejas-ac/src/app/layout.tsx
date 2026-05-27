import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: {
    default: "Valejas Atlético Clube | A Vanguarda do Futsal",
    template: "%s | Valejas AC",
  },
  description:
    "Clube desportivo de Valejas. Futsal, ciclismo, kung fu, dança e yoga. A vanguarda do pavilhão.",
  keywords: ["futsal", "Valejas", "clube desportivo", "futebol de salão"],
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
