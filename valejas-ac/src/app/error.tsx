"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

/**
 * Rede para erros inesperados em tempo de execução. Sem isto, o visitante
 * via a página de erro por omissão do Next, sem marca e em inglês.
 */
export default function Erro({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Fica no servidor para quem mantém o site; o visitante não precisa.
    console.error("Erro na página:", error.message);
  }, [error]);

  return (
    <main className="bg-surface min-h-[70vh] flex items-center">
      <div className="section-container py-20 md:py-28">
        <div className="max-w-xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Alguma coisa correu mal
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            Não conseguimos <span>mostrar isto</span>
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 leading-relaxed">
            O problema é nosso, não teu. Tenta outra vez; se continuar,
            avisa-nos.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <button onClick={reset} className="btn-primary text-sm">
              <RotateCcw size={14} /> Tentar outra vez
            </button>
            <Link href="/" className="btn-ghost text-sm">Início</Link>
            <Link href="/contactos" className="btn-ghost text-sm">Avisar o clube</Link>
          </div>

          {error.digest && (
            <p className="font-body text-xs text-on-surface-muted mt-8">
              Referência do erro: {error.digest}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
