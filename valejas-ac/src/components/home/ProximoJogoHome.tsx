import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { fetchJogos } from "@/sanity/queries";
import {
  PROXIMO_JOGO, doSanity, proximoDe, ehValejas,
  formatarData, formatarHora,
} from "@/lib/data/jogos";

/**
 * Banda do próximo jogo, logo abaixo do comunicado.
 * ─────────────────────────────────────────────────────────────────
 * O PRODUCT.md define sucesso como "um sócio abre o site no telemóvel,
 * vê o último comunicado e o próximo jogo em segundos". Isto é a
 * segunda metade dessa frase.
 *
 * Lê a mesma fonte que a página de jogos, para as duas nunca poderem
 * discordar. O componente antigo tinha "FC Porto" escrito à mão.
 * ─────────────────────────────────────────────────────────────────
 */
export default async function ProximoJogoHome() {
  const doCms = await fetchJogos();
  const jogo = doCms?.length ? proximoDe(doCms.map(doSanity)) : PROXIMO_JOGO;
  if (!jogo) return null;

  return (
    <section className="section-dark bg-blue text-white">
      <div className="section-container py-10 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-7 lg:gap-12">
          <p className="font-body text-xs font-bold uppercase tracking-widest text-yellow lg:w-40 shrink-0">
            Próximo jogo
          </p>

          <div className="flex-1 min-w-0">
            <p className="font-headline font-black uppercase text-2xl md:text-3xl leading-none tracking-tighter">
              <span className={ehValejas(jogo.casa) ? "text-yellow" : ""}>
                {jogo.casa}
              </span>
              <span className="text-white/60 mx-3">vs</span>
              <span className={ehValejas(jogo.fora) ? "text-yellow" : ""}>
                {jogo.fora}
              </span>
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">
              <span className="flex items-center gap-2 font-body text-sm text-white/85">
                <CalendarDays size={15} className="text-yellow shrink-0" />
                <span className="first-letter:uppercase">{formatarData(jogo.data)}</span>
                <span>· {formatarHora(jogo.data)}</span>
              </span>
              <span className="flex items-center gap-2 font-body text-sm text-white/85">
                <MapPin size={15} className="text-yellow shrink-0" />
                {jogo.local}
              </span>
            </div>
          </div>

          <Link
            href="/jogos"
            className="btn-primary shrink-0 self-start lg:self-center bg-yellow text-blue-deep hover:bg-yellow-dim text-sm"
          >
            Jogos e classificação
          </Link>
        </div>
      </div>
    </section>
  );
}
