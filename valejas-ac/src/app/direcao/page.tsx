import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { sessaoValida, authConfigurada, COOKIE_SESSAO } from "@/lib/auth-direcao";
import EntrarDirecao from "@/components/direcao/EntrarDirecao";
import EditorComunicado from "@/components/direcao/EditorComunicado";

export const metadata: Metadata = {
  title: "Área da Direção",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DirecaoPage() {
  const autenticado = sessaoValida(cookies().get(COOKIE_SESSAO)?.value);

  return (
    <div className="bg-surface min-h-screen py-16 md:py-24">
      <div className="section-container max-w-3xl">
        <header className="mb-12">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow">
            Valejas Atlético Clube
          </p>
          <h1 className="font-headline font-black text-4xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface mt-3">
            Área da <span className="text-yellow">Direção</span>
          </h1>
        </header>

        {!authConfigurada() ? (
          <p className="font-body text-base text-on-surface-muted leading-relaxed">
            Esta área ainda não está configurada. Faltam as variáveis
            <code className="text-yellow mx-1">DIRECAO_PASSWORD</code> e
            <code className="text-yellow mx-1">DIRECAO_SECRET</code> no servidor.
          </p>
        ) : autenticado ? (
          <>
            <nav aria-label="Secções" className="flex flex-wrap gap-4 mb-10">
              <span className="btn-primary text-sm pointer-events-none">
                Publicar comunicado
              </span>
              <Link href="/direcao/jogos" className="btn-ghost text-sm">
                Jogos e classificação
              </Link>
              <Link href="/direcao/plantel" className="btn-ghost text-sm">
                Plantéis
              </Link>
              <Link href="/direcao/encomendas" className="btn-ghost text-sm">
                Encomendas da loja
              </Link>
            </nav>
            <EditorComunicado />
          </>
        ) : (
          <EntrarDirecao />
        )}
      </div>
    </div>
  );
}
