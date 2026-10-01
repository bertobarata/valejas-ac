/**
 * Encaminha cada pedido para a sua língua. Sem prefixo é português;
 * /en, /es, /fr e /kea são as outras. Ver src/i18n/routing.ts.
 *
 * Ficam de fora a API, os ficheiros estáticos e as rotas geradas na
 * raiz (sitemap, robots, imagem de partilha).
 */

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|imagem-partilha|sitemap.xml|robots.txt|.*\\..*).*)"],
};
