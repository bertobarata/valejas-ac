"use client";

/**
 * Nem tudo se traduz (decisão do Berto, 01/10/2026): os comunicados, os
 * jogos, as equipas e as páginas legais ficam em português. Quem chega
 * a uma delas noutra língua vê este aviso no topo, em vez de achar que
 * a tradução se partiu.
 */

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

const SO_EM_PORTUGUES = [
  "/comunicados",
  "/jogos",
  "/equipas",
  "/privacidade",
  "/termos",
  "/cookies",
  "/loja/condicoes",
  "/direcao",
];

export default function AvisoSoPortugues() {
  const lingua = useLocale();
  const caminho = usePathname();
  const t = useTranslations("comum");

  if (lingua === "pt") return null;
  if (!SO_EM_PORTUGUES.some((p) => caminho === p || caminho.startsWith(p + "/"))) return null;

  return (
    <div
      role="note"
      lang={lingua}
      className="bg-yellow text-blue-deep font-body text-sm font-semibold text-center px-4 py-2.5"
    >
      {t("soEmPortugues")}
    </div>
  );
}
