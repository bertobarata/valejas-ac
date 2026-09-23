/**
 * DADOS ESTRUTURADOS — schema.org
 * ─────────────────────────────────────────────────────────────────
 * O que o Google lê para perceber que isto é um clube desportivo e
 * não um sítio qualquer: morada, contactos, redes sociais, e o
 * calendário de jogos como eventos.
 *
 * Sem isto, o motor de busca adivinha a partir do texto. Com isto, o
 * clube pode aparecer como entidade — com morada, telefone e ligação
 * às redes — e os jogos como eventos com data e local.
 *
 * Os dados não se escrevem aqui: vêm todos das mesmas camadas que
 * alimentam as páginas, para não haver duas versões da morada a
 * divergir com o tempo.
 * ─────────────────────────────────────────────────────────────────
 */

import { CONTACTO } from "@/lib/data/socios";
import { LOCALIZACAO } from "@/lib/data/historia";
import { CALENDARIO, CLUBE, ehValejas, type Jogo } from "@/lib/data/jogos";

/** O endereço público. Em pré-visualização não há domínio fechado. */
function base(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://valejasac.pt";
}

const MORADA = {
  "@type": "PostalAddress",
  streetAddress: LOCALIZACAO.morada,
  addressLocality: LOCALIZACAO.localidade,
  postalCode: LOCALIZACAO.codigoPostal,
  addressRegion: LOCALIZACAO.concelho,
  addressCountry: "PT",
};

/**
 * O clube. `SportsOrganization` é o tipo certo — `SportsTeam` diria
 * que somos uma equipa, e somos sete modalidades e uma academia.
 */
export function organizacao() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": `${base()}/#clube`,
    name: "Valejas Atlético Clube",
    alternateName: "Valejas AC",
    url: base(),
    logo: `${base()}/imagem-partilha`,
    foundingDate: "1966-11-01",
    sport: [
      "Futsal", "Atletismo", "Karate", "Cicloturismo",
      "Judo", "Dança", "Teatro",
    ],
    address: MORADA,
    geo: {
      "@type": "GeoCoordinates",
      latitude: LOCALIZACAO.coordenadas.lat,
      longitude: LOCALIZACAO.coordenadas.lng,
    },
    telephone: CONTACTO.telefone,
    email: CONTACTO.email,
    sameAs: [
      CONTACTO.redesSociais.facebook,
      CONTACTO.redesSociais.instagram,
      CONTACTO.redesSociais.youtube,
    ],
  };
}

/**
 * Um jogo do calendário. Só os que ainda não aconteceram: um evento
 * passado no Google não ajuda ninguém a encontrar o próximo jogo.
 */
function evento(j: Jogo) {
  const emCasa = ehValejas(j.casa);
  const adversario = emCasa ? j.fora : j.casa;

  return {
    "@type": "SportsEvent",
    name: `${j.casa} — ${j.fora}`,
    description: `Jornada ${j.jornada} do campeonato distrital de futsal da AF Lisboa.`,
    startDate: j.data,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    /* Só se sabe o pavilhão quando o jogo é em casa. Fora, sabe-se o
     * adversário mas não a morada dele — e inventar um local é pior
     * do que dizer só a localidade. */
    location: emCasa
      ? {
          "@type": "Place",
          name: "Pavilhão do Valejas Atlético Clube",
          address: MORADA,
        }
      : { "@type": "Place", name: `Pavilhão do ${adversario}` },
    homeTeam: { "@type": "SportsTeam", name: j.casa },
    awayTeam: { "@type": "SportsTeam", name: j.fora },
    organizer: { "@type": "Organization", name: "AF Lisboa" },
    url: `${base()}/jogos`,
  };
}

/** Os jogos que ainda estão para vir, no máximo dez. */
export function proximosJogos(agora: Date = new Date()) {
  const porVir = CALENDARIO
    .filter((j) => new Date(j.data).getTime() >= agora.getTime())
    .slice(0, 10);

  if (porVir.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@graph": porVir.map(evento),
  };
}

/** Marca uma página como parte do sítio do clube. */
export function paginaWeb(titulo: string, rota: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: titulo,
    url: `${base()}${rota}`,
    isPartOf: { "@id": `${base()}/#clube` },
  };
}

/** O nome do clube tal como está no calendário, para não divergir. */
export const NOME_NO_CALENDARIO = CLUBE;
