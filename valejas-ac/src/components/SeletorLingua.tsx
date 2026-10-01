"use client";

/**
 * SELETOR DE LÍNGUA
 * ─────────────────────────────────────────────────────────────────
 * Canto superior direito. Mostra a sigla da língua atual e abre a
 * lista das cinco, cada uma escrita na própria língua — quem não lê
 * português tem de reconhecer a sua sem ler a dos outros.
 *
 * Mudar de língua fica na mesma página: /modalidades em inglês é
 * /en/modalidades, não a página inicial em inglês.
 *
 * Cada língua leva a bandeira ao lado do nome (pedido do Berto,
 * 01/10/2026): o crioulo com a de Cabo Verde, o inglês com a do Reino
 * Unido. A bandeira ajuda a encontrar, o nome é que diz a língua — por
 * isso nunca aparece sozinha e é decorativa para os leitores de ecrã.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LINGUAS, NOME_LINGUA, type Lingua } from "@/i18n/routing";

export default function SeletorLingua({ variante = "faixa" }: { variante?: "faixa" | "barra" }) {
  const lingua = useLocale() as Lingua;
  const t = useTranslations("comum.lingua");
  const router = useRouter();
  const caminho = usePathname();
  const [aberto, setAberto] = useState(false);
  const [aMudar, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAberto(false);
    };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setAberto(false); };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", escape);
    };
  }, [aberto]);

  const escolher = (nova: Lingua) => {
    setAberto(false);
    if (nova === lingua) return;
    startTransition(() => {
      // O #âncora não passa pelo router: junta-se à mão.
      router.replace(caminho + window.location.hash, { locale: nova });
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={t("escolher")}
        disabled={aMudar}
        className={clsx(
          "inline-flex items-center gap-1.5 font-body font-semibold uppercase tracking-widest transition-opacity",
          variante === "faixa"
            ? "text-xs text-white hover:opacity-80 min-h-7 px-1"
            : "text-xs text-on-surface-muted hover:text-yellow w-11 h-11 justify-center",
          aMudar && "opacity-60"
        )}
      >
        <Bandeira lingua={lingua} tamanho={variante === "faixa" ? 16 : 22} />
        <span className={variante === "barra" ? "sr-only" : undefined}>{lingua}</span>
      </button>

      <ul
        role="listbox"
        aria-label={t("escolher")}
        className={clsx(
          "absolute right-0 top-full mt-2 min-w-[11rem] bg-surface border border-on-surface/10 shadow-ambient py-2 z-[60]",
          "transition-all duration-200",
          aberto ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"
        )}
      >
        {LINGUAS.map((l) => (
          <li key={l} role="option" aria-selected={l === lingua}>
            <button
              type="button"
              lang={l}
              onClick={() => escolher(l)}
              className={clsx(
                "w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left font-body text-sm normal-case tracking-normal transition-colors",
                l === lingua ? "text-yellow" : "text-on-surface hover:text-yellow"
              )}
            >
              <span className="inline-flex items-center gap-2.5">
                <Bandeira lingua={l} tamanho={20} />
                {NOME_LINGUA[l]}
              </span>
              {l === lingua && <Check size={14} aria-hidden />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bandeira({ lingua, tamanho }: { lingua: Lingua; tamanho: number }) {
  return (
    <Image
      src={`/linguas/${lingua}.webp`}
      alt=""
      width={tamanho}
      height={tamanho}
      className="rounded-full shrink-0 ring-1 ring-black/10"
    />
  );
}
