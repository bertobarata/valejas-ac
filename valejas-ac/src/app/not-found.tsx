import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

/**
 * Sem este ficheiro, qualquer endereço errado caía na página por omissão
 * do Next: fundo preto, texto em inglês, sem emblema e sem saída. Num
 * site português de um clube, isso é pior do que o erro em si.
 */
export default function NaoEncontrada() {
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
            Erro 404
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            Esta página não <span>existe</span>
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 leading-relaxed">
            Ou nunca existiu, ou mudou de sítio. Acontece. Daqui consegues
            chegar ao resto do clube.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link href="/" className="btn-primary text-sm">Início</Link>
            <Link href="/comunicados" className="btn-ghost text-sm">Comunicados</Link>
            <Link href="/jogos" className="btn-ghost text-sm">Jogos</Link>
            <Link href="/modalidades" className="btn-ghost text-sm">Modalidades</Link>
            <Link href="/contactos" className="btn-ghost text-sm">Contactos</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
