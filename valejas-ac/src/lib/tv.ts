/**
 * VALEJAS TV — HÁ DIRETO OU NÃO?
 * ─────────────────────────────────────────────────────────────────
 * O botão TV da barra leva ao direto do canal do clube, se houver um
 * a decorrer. Para saber, pergunta-se ao próprio YouTube: o endereço
 * /@canal/live aponta para o vídeo em direto quando existe, e para o
 * canal quando não.
 *
 * Não usa a API do YouTube de propósito. A API pede uma chave, e a
 * pesquisa de diretos gasta 100 das 10 000 unidades diárias por
 * pedido — verificar de 2 em 2 minutos esgotava a quota a meio da
 * manhã. A página pública não tem quota.
 *
 * O preço: se o YouTube mudar a página, isto deixa de detetar o
 * direto e o botão passa a dizer "não estamos em live". Falha para o
 * lado seguro — nunca manda ninguém para um vídeo errado.
 * ─────────────────────────────────────────────────────────────────
 */

import { CONTACTO } from "@/lib/data/socios";

export const CANAL_TV = CONTACTO.redesSociais.youtube;

export type EstadoTV =
  | { live: true;  url: string }
  | { live: false; url: string };

export async function estadoTV(): Promise<EstadoTV> {
  const semDireto: EstadoTV = { live: false, url: CANAL_TV };

  try {
    const res = await fetch(`${CANAL_TV}/live`, {
      headers: {
        // Sem um navegador "a sério" no cabeçalho, o YouTube responde
        // com a página de consentimento de cookies e não com o canal.
        "User-Agent":      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
        "Accept-Language": "pt-PT,pt;q=0.9",
      },
      next: { revalidate: 120 },
    });
    if (!res.ok) return semDireto;

    const html = await res.text();
    const canonico = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];

    // Um direto agendado também tem endereço de vídeo — só conta o que
    // está a acontecer agora.
    const aDecorrer = /"isLiveNow":true/.test(html);

    if (canonico?.includes("/watch?v=") && aDecorrer) {
      return { live: true, url: canonico };
    }
    return semDireto;
  } catch {
    return semDireto;
  }
}
