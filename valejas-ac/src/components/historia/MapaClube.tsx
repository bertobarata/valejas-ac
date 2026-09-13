"use client";

/**
 * MAPA DO CLUBE
 * ─────────────────────────────────────────────────────────────────
 * O mapa do Google só é carregado depois de a pessoa carregar no
 * botão. Enquanto ninguém pede, não há pedido ao Google nem cookies
 * de terceiros — o que poupa ao clube um problema de RGPD que um
 * iframe embebido de raiz criaria.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { LOCALIZACAO, urlMapa, urlMapaEmbed } from "@/lib/data/historia";

export default function MapaClube() {
  const [carregado, setCarregado] = useState(false);

  return (
    <div className="border border-on-surface/15">
      <div className="relative aspect-[16/10] bg-surface-high">
        {carregado ? (
          <iframe
            src={urlMapaEmbed()}
            title="Mapa com a localização do Valejas Atlético Clube"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <MapPin size={32} className="text-yellow" />
            <p className="font-body text-sm text-on-surface-muted max-w-xs leading-relaxed">
              O mapa é carregado do Google. Carrega no botão para o ver — assim
              nada é pedido ao Google sem tu quereres.
            </p>
            <button
              type="button"
              onClick={() => setCarregado(true)}
              className="btn-primary text-sm"
            >
              Ver mapa
            </button>
          </div>
        )}
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
