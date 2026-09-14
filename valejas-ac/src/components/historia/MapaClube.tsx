/**
 * MAPA DO CLUBE
 * ─────────────────────────────────────────────────────────────────
 * O mapa aparece de imediato. Havia aqui um botão «Ver mapa» a servir
 * de portão — nada era pedido ao Google enquanto ninguém carregasse —
 * mas quem chega à página quer ver onde fica a sede, não carregar num
 * botão para ver onde fica a sede.
 *
 * A contrapartida é real e está dita nas páginas de privacidade e de
 * cookies: ao abrir esta página, o Google recebe um pedido e pode
 * guardar cookies próprias. `loading="lazy"` adia esse pedido até o
 * mapa estar quase à vista, e `referrerpolicy` não lhe diz de que
 * página vieste.
 * ─────────────────────────────────────────────────────────────────
 */

import { ExternalLink } from "lucide-react";
import { LOCALIZACAO, urlMapa, urlMapaEmbed } from "@/lib/data/historia";

export default function MapaClube() {
  return (
    <div className="border border-on-surface/15">
      <div className="relative aspect-[16/10] bg-surface-high">
        <iframe
          src={urlMapaEmbed()}
          title="Mapa com a localização do Valejas Atlético Clube"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>

      <div className="p-5 border-t border-on-surface/10 flex flex-wrap items-center justify-between gap-4">
        <p className="font-body text-sm text-on-surface-muted">
          {LOCALIZACAO.coordenadas.lat}, {LOCALIZACAO.coordenadas.lng}
        </p>
        <a
          href={urlMapa()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-sm"
        >
          Abrir no Google Maps <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
