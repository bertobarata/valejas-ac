import type { Metadata } from "next";

// O Studio é a porta de trás do CMS. O robots.txt já o esconde, mas isso
// só impede o rastreio: um link de fora ainda o punha nos resultados.
export const metadata: Metadata = {
  title: "Gestor de conteúdos",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
