/**
 * Carrega as traduções da língua do pedido.
 *
 * As mensagens estão partidas por página em messages/<lingua>/*.json,
 * para quem traduz uma página não mexer no ficheiro de outra.
 *
 * O que ainda não estiver traduzido sai em português, em vez de
 * aparecer a chave crua ("inicio.hero.titulo") no meio da página.
 */

import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { routing, type Lingua } from "./routing";
import { NAMESPACES } from "../../messages/namespaces";

type Mensagens = AbstractIntlMessages;

async function carregar(lingua: Lingua): Promise<Mensagens> {
  const partes = await Promise.all(
    NAMESPACES.map(async (ns) => {
      try {
        return [ns, (await import(`../../messages/${lingua}/${ns}.json`)).default] as const;
      } catch {
        return [ns, {}] as const;
      }
    })
  );
  return Object.fromEntries(partes);
}

function fundir(base: Mensagens, por_cima: Mensagens): Mensagens {
  const resultado: Mensagens = { ...base };
  for (const [chave, valor] of Object.entries(por_cima)) {
    const anterior = resultado[chave];
    resultado[chave] =
      valor && typeof valor === "object" && !Array.isArray(valor) &&
      anterior && typeof anterior === "object" && !Array.isArray(anterior)
        ? fundir(anterior as Mensagens, valor as Mensagens)
        : valor;
  }
  return resultado;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const pedida = await requestLocale;
  const lingua: Lingua = routing.locales.includes(pedida as Lingua)
    ? (pedida as Lingua)
    : routing.defaultLocale;

  const pt = await carregar("pt");
  const messages = lingua === "pt" ? pt : fundir(pt, await carregar(lingua));

  return {
    locale: lingua,
    messages,
    timeZone: "Europe/Lisbon",
  };
});
